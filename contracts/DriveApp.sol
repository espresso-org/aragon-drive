pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/os/contracts/acl/ACLSyntaxSugar.sol";
import "@espresso-org/object-acl/contracts/ObjectACL.sol";
import "./libraries/PermissionLibrary.sol";
import "./libraries/GroupLibrary.sol";
import "./libraries/FileLibrary.sol";

/**
 * Since inheritance is not currently supported (see https://github.com/aragon/aragon-cli/issues/133) 
 * the Datastore smart contract is added directly in this file.
 */

//import "@espresso-org/aragon-datastore/contracts/Datastore.sol"

contract Datastore is AragonApp {
    using PermissionLibrary for PermissionLibrary.PermissionData;
    using FileLibrary for FileLibrary.FileList;
    using FileLibrary for FileLibrary.LabelList;
    using GroupLibrary for GroupLibrary.GroupData;

    bytes32 constant public DATASTORE_MANAGER_ROLE = keccak256(abi.encodePacked("DATASTORE_MANAGER_ROLE"));
    bytes32 constant public FILE_READ_ROLE = keccak256(abi.encodePacked("FILE_READ_ROLE"));
    bytes32 constant public FILE_WRITE_ROLE = keccak256(abi.encodePacked("FILE_WRITE_ROLE"));
    bytes32 constant public DATASTORE_GROUP = keccak256(abi.encodePacked("DATASTORE_GROUP"));
    
    event FileChange(uint256 fileId);
    event LabelChange(uint256 labelId);
    event PermissionChange(uint256 fileId);
    event SettingsChange();
    event GroupChange(uint256 groupId);

    /**
     * Datastore settings
     */
    enum StorageProvider { None, Ipfs, Swarm, Filecoin }
    enum EncryptionProvider { None, Aes }

    struct Settings {
        StorageProvider storageProvider;
        EncryptionProvider encryptionProvider;

        string ipfsHost;
        uint16 ipfsPort;
        string ipfsProtocol;

        string aesName;
        uint256 aesLength;
    }

    /** 
     *  TODO: Use IpfsSettings inside Settings when aragon supports nested structs
     */
    struct IpfsSettings {
        string host;
        uint16 port;
        string protocol;        
    }
    
    /** 
     *  TODO: Use AesSettings inside Settings when aragon supports nested structs
     */
    struct AesSettings {
        string name;
        uint256 length;
    }

    FileLibrary.FileList private fileList;
    FileLibrary.LabelList private labelList;
    PermissionLibrary.PermissionData private permissions;
    GroupLibrary.GroupData private groups;
    Settings public settings;
    ObjectACL private objectACL;

    modifier onlyFileOwner(uint256 _fileId) {
        require(permissions.isOwner(_fileId, msg.sender));
        _;
    }    

    function initialize(address _objectACL) onlyInit public {
        initialized();
        objectACL = ObjectACL(_objectACL);
        permissions.initialize(objectACL, FILE_READ_ROLE, FILE_WRITE_ROLE);
        groups.initialize(objectACL, DATASTORE_GROUP);
    }      
    
    /**
     * @notice Add a file to the datastore
     * @param _storageRef Storage Id of the file (IPFS only for now)
     * @param _name File name
     * @param _fileSize File size in bytes
     * @param _isPublic Is file readable by anyone
     * @param _encryptionKey File encryption key
     */
    function addFile(string _storageRef, string _name, uint128 _fileSize, bool _isPublic, string _encryptionKey) 
        external 
        auth(DATASTORE_MANAGER_ROLE) 
        returns (uint256 fileId) 
    {
        uint256 fId = fileList.addFile(_storageRef, _name, _fileSize, _isPublic, _encryptionKey);

        permissions.addOwner(fId, msg.sender);
        emit FileChange(fId);
        return fId;
    }

    /**
     * @notice Returns the file with Id `_fileId`
     * @param _fileId File id
     * @param _caller Caller address
     */
    function getFileAsCaller(uint256 _fileId, address _caller) 
        external
        view 
        returns (
            string storageRef,
            string name,
            uint128 fileSize,
            bool isPublic,
            bool isDeleted,
            address owner,
            bool isOwner,
            uint64 lastModification,
            address[] permissionAddresses,
            bool writeAccess
        )
    {
        FileLibrary.File storage file = fileList.files[_fileId];

        storageRef = file.storageRef;
        name = file.name;
        fileSize = file.fileSize;
        isPublic = file.isPublic;
        isDeleted = file.isDeleted;
        owner = permissions.getOwner(_fileId);
        isOwner = permissions.isOwner(_fileId, _caller);
        lastModification = file.lastModification;
        permissionAddresses = permissions.permissionAddresses[_fileId];
        writeAccess = hasWriteAccess(_fileId, _caller);
    }

    /**
     * @notice Returns the encryption key for file with `_fileId`
     * @param _fileId File Id 
     */
    function getFileEncryptionKey(uint256 _fileId) external view returns(string) {
        if (hasReadAccess(_fileId, msg.sender)) {
            FileLibrary.File storage file = fileList.files[_fileId];
            return file.cryptoKey;
        }
        return "0";
    } 

    /**
     * @notice Set file `_fileId` as deleted or not.
     * @param _fileId File Id
     * @param _isDeleted Is file deleted or not
     * @param _deletePermanently If true, will delete file permanently
     */
    function deleteFile(uint256 _fileId, bool _isDeleted, bool _deletePermanently) public onlyFileOwner(_fileId) {
        if (_isDeleted && _deletePermanently) {
            fileList.permanentlyDeleteFile(_fileId);
            emit FileChange(_fileId);            
        }
        else {
            fileList.setIsDeleted(_fileId, _isDeleted);
            emit FileChange(_fileId);
        }
    }

    /**
     * @notice Delete files in `_fileIds`. Files cannot be restored
     * @param _fileIds File Ids
     */
    function deleteFilesPermanently(uint256[] _fileIds) public {
        for(uint256 i = 0; i < _fileIds.length; i++) {
            fileList.permanentlyDeleteFile(_fileIds[i]);
            emit FileChange(i);
        }
    }      

    /**
     * @notice Returns the last file Id
     */
    function lastFileId() external view returns (uint256) {
        return fileList.lastFileId;
    }

    /**
     * @notice Changes name of file `_fileId` to `_newName`
     * @param _fileId File Id
     * @param _newName New file name
     */
    function setFileName(uint256 _fileId, string _newName) external {
        require(hasWriteAccess(_fileId, msg.sender));

        fileList.setFileName(_fileId, _newName);
        emit FileChange(_fileId);
    }

    /**
     * @notice Changes encryption key of file `_fileId` to `_cryptoKey`
     * @param _fileId File Id
     * @param _cryptoKey Encryption key    
     */
    function setEncryptionKey(uint256 _fileId, string _cryptoKey) public {
        require(hasWriteAccess(_fileId, msg.sender));

        fileList.setEncryptionKey(_fileId, _cryptoKey);
        emit FileChange(_fileId);
    }    

    /**
     * @notice Change file content of file `_fileId` to content stored at `_storageRef`
     * with size of `_fileSize` bytes
     * @param _fileId File Id
     * @param _storageRef Storage Id (IPFS)
     * @param _fileSize File size in bytes
     */
    function setFileContent(uint256 _fileId, string _storageRef, uint128 _fileSize) external {
        require(hasWriteAccess(_fileId, msg.sender));

        fileList.setFileContent(_fileId, _storageRef, _fileSize);
        emit FileChange(_fileId);
    }

    /**
     * @notice Returns entity addresses on which permissions are set for file `_fileId`
     * @param _fileId File Id
     * @return addresses Array of entity addresses
     */
    function getEntitiesWithPermissionsOnFile(uint256 _fileId) 
        external 
        view 
        returns (address[]) 
    {
        return permissions.permissionAddresses[_fileId];
    }

    /**
     * @notice Returns group ids on which permissions are set for file `_fileId`
     * @param _fileId File Id
     * @return Array of group ids
     */
    function getGroupsWithPermissionsOnFile(uint256 _fileId) 
        external 
        view 
        returns (uint256[]) 
    {
        return permissions.groupIds[_fileId];
    }

    /**
     * @notice Get write and read permissions for entity `_entity` on file `_fileId`
     * @param _fileId File Id
     * @param _entity Entity address
     */
    function getEntityPermissionsOnFile(uint256 _fileId, address _entity) 
        external 
        view 
        returns (bool write, bool read) 
    {
        /*
        PermissionLibrary.Permission storage permission = permissions.entityPermissions[_fileId][_entity];
        write = permission.write;
        read = permission.read;*/
        return permissions.getEntityPermissionsOnFile(_fileId, _entity);
    } 

    /**
     * @notice Get write and read permissions for group `_groupId` on file `_fileId`
     * @param _fileId File Id
     * @param _groupId Group Id
     */
    function getGroupPermissionsOnFile(uint256 _fileId, uint256 _groupId) 
        external 
        view 
        returns (bool write, bool read) 
    {
        PermissionLibrary.Permission storage permission = permissions.groupPermissions[_fileId][_groupId];
        write = permission.write;
        read = permission.read;
    } 

    /**
     * @notice Add/Remove permissions to an entity for a specific file
     * @param _fileId File Id
     * @param _entity Entity address
     * @param _read Read permission
     * @param _write Write permission     
     */
    function setEntityPermissions(uint256 _fileId, address _entity, bool _read, bool _write) 
        external 
        onlyFileOwner(_fileId) 
    {
        permissions.setEntityPermissions(_fileId, _entity, _read, _write);
        emit PermissionChange(_fileId);
    }

    /**
     * @notice Remove entity from file permissions
     * @param _fileId Id of the file
     * @param _entity Entity address
     */
    function removeEntityFromFile(uint256 _fileId, address _entity) external onlyFileOwner(_fileId) {
        permissions.removeEntityFromFile(_fileId, _entity);
        emit PermissionChange(_fileId);       
    }
    
    /**
     * @notice Sets the storage and encryption providers for the datastore
     * @dev Since switching between storage providers is not supported,
     * the method can only be called if storage isn't set or already IPFS.
     * @param _storageProvider Storage provider
     * @param _encryptionProvider Encryption provider
     * @param _ipfsHost Host
     * @param _ipfsPort Port
     * @param _ipfsProtocol HTTP protocol
     * @param _aesMode Mode of the AES encryption algorithm
     * @param _encryptionKeylength Length of the encryption key
     */
    function setSettings(
        StorageProvider _storageProvider,
        EncryptionProvider _encryptionProvider,
        string _ipfsHost, 
        uint16 _ipfsPort, 
        string _ipfsProtocol, 
        string _aesMode, 
        uint256 _encryptionKeylength
    ) public {
        require(
            settings.storageProvider == StorageProvider.None || settings.encryptionProvider == EncryptionProvider.None,
            "Settings already set"
        );

        // Storage provider
        settings.storageProvider = _storageProvider;
        if (settings.storageProvider == StorageProvider.Ipfs) {
            settings.ipfsHost = _ipfsHost;
            settings.ipfsPort = _ipfsPort;
            settings.ipfsProtocol = _ipfsProtocol;
        }

        // Encryption
        settings.encryptionProvider = _encryptionProvider;
        if (settings.encryptionProvider == EncryptionProvider.Aes) {
            settings.aesName = _aesMode;
            settings.aesLength = _encryptionKeylength;
        }
        emit SettingsChange();
    }

    /**
     * @notice Returns true if `_entity` has read access on file `_fileId`
     * @param _fileId File Id
     * @param _entity Entity address     
     */
    function hasReadAccess(uint256 _fileId, address _entity) public view returns (bool) {
        if (permissions.hasReadAccess(_fileId, _entity))
            return true;

        for (uint256 i = 0; i < groups.groupList.length; i++) {
            if (permissions.groupPermissions[_fileId][groups.groupList[i]].exists) {
                if (permissions.groupPermissions[_fileId][groups.groupList[i]].read) {
                    if (groups.isEntityInGroup(groups.groupList[i], _entity)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * @notice Returns true if `_entity` has write access on file `_fileId`
     * @param _fileId File Id
     * @param _entity Entity address     
     */
    function hasWriteAccess(uint256 _fileId, address _entity) public view returns (bool) {
        if (permissions.hasWriteAccess(_fileId, _entity))
            return true;

        for (uint256 i = 0; i < groups.groupList.length; i++) {
            if (permissions.groupPermissions[_fileId][groups.groupList[i]].exists) {
                if (permissions.groupPermissions[_fileId][groups.groupList[i]].write) {
                    if (groups.isEntityInGroup(groups.groupList[i], _entity)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * @notice Add a group to the datastore
     * @param _groupName Name of the group
     */
    function createGroup(string _groupName) external {
        uint256 groupId = groups.createGroup(_groupName);
        emit GroupChange(groupId);
    }

    /**
     * @notice Delete a group from the datastore
     * @param _groupId Id of the group to delete
     */
    function deleteGroup(uint256 _groupId) external auth(DATASTORE_MANAGER_ROLE) {
        require(groups.groups[_groupId].exists);
        groups.deleteGroup(_groupId);
        emit GroupChange(_groupId);
    }

    /**
     * @notice Rename a group
     * @param _groupId Id of the group to rename
     * @param _newGroupName New name for the group
     */
    function renameGroup(uint256 _groupId, string _newGroupName) external auth(DATASTORE_MANAGER_ROLE) {
        require(groups.groups[_groupId].exists);
        groups.renameGroup(_groupId, _newGroupName);
        emit GroupChange(_groupId);
    }

    /**
     * @notice Get a specific group
     * @param _groupId Id of the group to return
     */
    function getGroup(uint256 _groupId) public view returns (address[], string) {
        require(groups.groups[_groupId].exists);
        return groups.getGroup(_groupId);
    }

    /**
     * @notice Get a list of all the groups Id's
     */
    function getGroupIds() public view returns (uint[]) {
        return groups.groupList;
    }

    /**
     * @notice Add an entity to a group
     * @param _groupId Id of the group to add the entity in
     * @param _entity Address of the entity
     */
    function addEntityToGroup(uint256 _groupId, address _entity) public {
        require(groups.groups[_groupId].exists);
        groups.addEntityToGroup(_groupId, _entity);
        emit GroupChange(_groupId);
    }

    /**
     * @notice Remove an entity from a group
     * @param _groupId Id of the group to remove the entity from 
     * @param _entity Address of the entity
     */
    function removeEntityFromGroup(uint256 _groupId, address _entity) public {
        require(groups.groups[_groupId].exists);
        groups.removeEntityFromGroup(_groupId, _entity);
        emit GroupChange(_groupId);
    }

    /**
     * @notice Set the read and write permissions on a file for a specified group
     * @param _fileId Id of the file
     * @param _groupId Id of the group
     * @param _read Read permission
     * @param _write Write permission
     */
    function setGroupPermissions(uint256 _fileId, uint256 _groupId, bool _read, bool _write) public onlyFileOwner(_fileId) {
        permissions.setGroupPermissions(_fileId, _groupId, _read, _write);
        emit PermissionChange(_fileId);
    }

    /**
     * @notice Set the read and write permissions on a file
     * @param _fileId Id of the file
     * @param _groupIds Ids of the groups
     * @param _groupRead Read permission
     * @param _groupWrite Write permission
     * @param _entities Ids of the groups
     * @param _entityRead Read permission
     * @param _entityWrite Write permission
     * @param _isPublic Public status
     * @param _storageRef Storage reference
     * @param _fileSize File size
     * @param _encryptionKey Encryption key
     */
    function setMultiplePermissions(
        uint256 _fileId, uint256[] _groupIds, bool[] _groupRead, bool[] _groupWrite, 
        address[] _entities, bool[] _entityRead, bool[] _entityWrite, bool _isPublic, string _storageRef, 
        uint128 _fileSize, string _encryptionKey) 
        public 
        onlyFileOwner(_fileId) 
    {
        for(uint256 i = 0; i < _groupIds.length; i++) 
            permissions.setGroupPermissions(_fileId, _groupIds[i], _groupRead[i], _groupWrite[i]);
        
        for(uint256 j = 0; j < _entities.length; j++) 
            permissions.setEntityPermissions(_fileId, _entities[j], _entityRead[j], _entityWrite[j]);

        fileList.setPublic(_fileId, _isPublic);

        if (!_isPublic || (_isPublic && keccak256(abi.encodePacked(_encryptionKey)) == keccak256(abi.encodePacked("")))) {
            fileList.setFileContent(_fileId, _storageRef, _fileSize);
            fileList.setEncryptionKey(_fileId, _encryptionKey);
        }
        emit PermissionChange(_fileId);
    }

    /**
     * @notice Remove group from file permissions
     * @param _fileId Id of the file
     * @param _groupId Id of the group
     */
    function removeGroupFromFile(uint256 _fileId, uint256 _groupId) public onlyFileOwner(_fileId) {
        permissions.removeGroupFromFile(_fileId, _groupId);
        emit PermissionChange(_fileId);
    }

    /**
     * @notice Add a label to the datastore
     * @param _name Name of the label
     * @param _color Color of the label
     */
    function createLabel(bytes28 _name, bytes4 _color) external auth(DATASTORE_MANAGER_ROLE) {
        labelList.createLabel(_name, _color);
        emit LabelChange(labelList.lastLabelId);
    }

    /**
     * @notice Delete a label from the datastore
     * @param _labelId Id of the label
     */
    function deleteLabel(uint _labelId) external {
        labelList.deleteLabel(_labelId);
        emit LabelChange(_labelId);
    }

    /**
     * @notice Assign a label to a file
     * @param _fileId Id of the file
     * @param _labelId Id of the label
     */
    function assignLabel(uint _fileId, uint _labelId) external onlyFileOwner(_fileId) {
        fileList.assignLabel(_fileId, _labelId);
        emit FileChange(_fileId);
    }

    /**
     * @notice Unassign a label from a file
     * @param _fileId Id of the file
     * @param _labelIdPosition Position of the label's Id
     */
    function unassignLabel(uint _fileId, uint _labelIdPosition) external onlyFileOwner(_fileId) {
        fileList.unassignLabel(_fileId, _labelIdPosition);
        emit FileChange(_fileId);
    }

    /**
     * @notice Returns the label with Id `_labelId`
     * @param _labelId Label id
     */
    function getLabel(uint _labelId) external view returns (bytes28 name, bytes4 color) {
        FileLibrary.Label storage label = labelList.labels[_labelId];
        name = label.name;
        color = label.color;
    }

    /**
     * @notice Returns every label Ids    
     */
    function getLabels() external view returns (uint[]) {
        return labelList.labelIds;
    }

    /**
     * @notice Returns a file's label list
     * @param _fileId Label id
     */
    function getFileLabelList(uint _fileId) external view returns (uint[]) {
        FileLibrary.File storage file = fileList.files[_fileId];
        return file.labels;
    }
}

contract DriveApp is Datastore {
    function initialize() external {
        /*settings = Settings({
            storageProvider: StorageProvider.Ipfs,
            encryptionProvider: EncryptionProvider.Aes,
            ipfsHost: "localhost",
            ipfsPort: 5001,
            ipfsProtocol: "http",
            aesName: "AES-CBC",
            aesLength: 256
        });*/
    }
}
