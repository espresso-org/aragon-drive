pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "./libraries/PermissionLibrary.sol";
import "./libraries/GroupLibrary.sol";
import "./libraries/FileLibrary.sol";

/**
 * Since inheritance is not currently supported (see https://github.com/aragon/aragon-cli/issues/133) 
 * the Datastore smart contract is added directly in this file.
 */

//import "aragon-datastore/contracts/Datastore.sol"

contract Datastore {

    using PermissionLibrary for PermissionLibrary.OwnerData;
    using PermissionLibrary for PermissionLibrary.PermissionData;
    using FileLibrary for FileLibrary.FileList;
    using GroupLibrary for GroupLibrary.GroupData;

    event FileRename(address indexed entity, uint fileId);
    event FileContentUpdate(address indexed entity, uint fileId);
    event NewFile(address indexed entity, uint fileId);
    event NewWritePermission(address indexed entity, uint fileId);
    event NewReadPermission(address indexed entity, uint fileId);
    event NewEntityPermissions(address indexed entity, uint fileId);
    event NewGroupPermissions(address indexed entity, uint fileId);
    event NewPermissions(address indexed entity, uint fileId);
    event DeleteFile(address indexed entity, uint fileId);
    event SettingsChanged(address indexed entity);
    event GroupChange(address indexed entity);
    event EntityPermissionsRemoved(address indexed entity);
    event GroupPermissionsRemoved(address indexed entity);

    /**
     * Datastore settings
     */
    enum StorageProvider { None, Ipfs, Filecoin, Swarm }
    enum EncryptionProvider { None, Aes }

    struct Settings {
        StorageProvider storageProvider;
        EncryptionProvider encryptionProvider;

        string ipfsHost;
        uint16 ipfsPort;
        string ipfsProtocol;

        string aesName;
        uint aesLength;
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
        uint length;
    }

    FileLibrary.FileList private fileList;
    PermissionLibrary.OwnerData private fileOwners;
    PermissionLibrary.PermissionData private permissions;
    GroupLibrary.GroupData private groups;
    Settings public settings;

    modifier onlyFileOwner(uint256 _fileId) {
        require(fileOwners.isOwner(_fileId, msg.sender));
        _;
    } 

    /**
     * @notice Add a file to the datastore
     * @param _storageRef Storage Id of the file (IPFS only for now)
     * @param _name File name
     * @param _fileSize File size in bytes
     * @param _isPublic Is file readable by anyone
     * @param _encryptionKey File encryption key
     */
    function addFile(string _storageRef, string _name, uint _fileSize, bool _isPublic, string _encryptionKey) external
    {
        uint fId = fileList.addFile(_storageRef, _name, _fileSize, _isPublic, _encryptionKey);

        fileOwners.addOwner(fId, msg.sender);
        PermissionLibrary.initializePermissionAddresses(permissions, fId);
        emit NewFile(msg.sender, fId);
    }

    /**
     * @notice Returns the file with Id `_fileId`
     * @param _fileId File id
     */
    function getFile(uint _fileId) 
        external
        view 
        returns (
            string storageRef,
            string name,
            uint fileSize,
            bool isPublic,
            bool isDeleted,
            address owner,
            bool isOwner,
            uint lastModification,
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
        owner = fileOwners.fileOwners[_fileId];
        isOwner = fileOwners.isOwner(_fileId, msg.sender);
        lastModification = file.lastModification;
        permissionAddresses = permissions.permissionAddresses[_fileId];
        writeAccess = hasWriteAccess(_fileId, msg.sender);
    }

    /**
     * @notice Returns the file with Id `_fileId`
     * @param _fileId File id
     * @param _caller Caller address
     */
    function getFileAsCaller(uint _fileId, address _caller) 
        external
        view 
        returns (
            string storageRef,
            string name,
            uint fileSize,
            bool isPublic,
            bool isDeleted,
            address owner,
            bool isOwner,
            uint lastModification,
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
        owner = fileOwners.fileOwners[_fileId];
        isOwner = fileOwners.isOwner(_fileId, _caller);
        lastModification = file.lastModification;
        permissionAddresses = permissions.permissionAddresses[_fileId];
        writeAccess = hasWriteAccess(_fileId, _caller);
    }

    /**
     * @notice Returns the encryption key for file with `_fileId`
     * @param _fileId File Id 
     */
    function getFileEncryptionKey(uint _fileId) external view returns(string) {
        if (hasReadAccess(_fileId, msg.sender)) {
            FileLibrary.File storage file = fileList.files[_fileId];
            return file.cryptoKey;
        }
        return "0";
    } 

    /**
     * @notice Delete file with Id `_fileId`
     * @param _fileId File Id
     */
    function deleteFile(uint _fileId) public onlyFileOwner(_fileId) {
        fileList.deleteFile(_fileId);
    }

    /**
     * @notice Returns the last file Id
     */
    function lastFileId() public view returns (uint256) {
        return fileList.lastFileId;
    }

    /**
     * @notice Changes name of file `_fileId` to `_newName`
     * @param _fileId File Id
     * @param _newName New file name
     */
    function setFileName(uint _fileId, string _newName) external {
        require(hasWriteAccess(_fileId, msg.sender));

        fileList.setFileName(_fileId, _newName);
        emit FileRename(msg.sender, _fileId);
    }

    /**
     * @notice Changes encryption key of file `_fileId` to `_cryptoKey`
     * @param _fileId File Id
     * @param _cryptoKey Encryption key    
     */
    function setEncryptionKey(uint _fileId, string _cryptoKey) public {
        require(hasWriteAccess(_fileId, msg.sender));

        fileList.setEncryptionKey(_fileId, _cryptoKey);
        emit FileContentUpdate(msg.sender, lastFileId());
    }

    /**
     * @notice Change file content of file `_fileId` to content stored at `_storageRef`
     * with size of `_fileSize` bytes
     * @param _fileId File Id
     * @param _storageRef Storage Id (IPFS)
     * @param _fileSize File size in bytes
     */
    function setFileContent(uint _fileId, string _storageRef, uint _fileSize) external {
        require(hasWriteAccess(_fileId, msg.sender));

        fileList.setFileContent(_fileId, _storageRef, _fileSize);
        emit FileContentUpdate(msg.sender, lastFileId());
    }

    /**
     * @notice Returns entity addresses on which permissions are set for file `_fileId`
     * @param _fileId File Id
     * @return addresses Array of entity addresses
     */
    function getEntitiesWithPermissionsOnFile(uint _fileId) external view returns (address[]) {
        return permissions.permissionAddresses[_fileId];
    }

    /**
     * @notice Returns group ids on which permissions are set for file `_fileId`
     * @param _fileId File Id
     * @return Array of group ids
     */
    function getGroupsWithPermissionsOnFile(uint _fileId) external view returns (uint256[]) {
        return permissions.groupIds[_fileId];
    }

    /**
     * @notice Get write and read permissions for entity `_entity` on file `_fileId`
     * @param _fileId File Id
     * @param _entity Entity address
     */
    function getEntityPermissionsOnFile(uint256 _fileId, address _entity) external view returns (bool write, bool read) {
        PermissionLibrary.Permission storage permission = permissions.entityPermissions[_fileId][_entity];
        write = permission.write;
        read = permission.read;
    } 

    /**
     * @notice Get write and read permissions for group `_groupId` on file `_fileId`
     * @param _fileId File Id
     * @param _groupId Group Id
     */
    function getGroupPermissionsOnFile(uint256 _fileId, uint256 _groupId) external view returns (bool write, bool read) {
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
    function setEntityPermissions(uint _fileId, address _entity, bool _read, bool _write) external onlyFileOwner(_fileId) 
    {
        permissions.setEntityPermissions(_fileId, _entity, _read, _write);
        emit NewEntityPermissions(msg.sender, _fileId);
    }

    /**
     * @notice Remove entity from file permissions
     * @param _fileId Id of the file
     * @param _entity Entity address
     */
    function removeEntityFromFile(uint _fileId, address _entity) external onlyFileOwner(_fileId) {
        permissions.removeEntityFromFile(_fileId, _entity);
        emit EntityPermissionsRemoved(msg.sender);       
    }
    
    /**
     * @notice Change the storage provider
     * @param _storageProvider Storage provider
     */
    function setStorageProvider(StorageProvider _storageProvider) public {
        require(settings.storageProvider == StorageProvider.None);
        settings.storageProvider = _storageProvider;
        emit SettingsChanged(msg.sender);
    }

    /**
     * @notice Change the encryption provider
     * @param _encryptionProvider Encryption provider
     */
    function setEncryptionProvider(EncryptionProvider _encryptionProvider) public {
        require(settings.encryptionProvider == EncryptionProvider.None);
        settings.encryptionProvider = _encryptionProvider;
        emit SettingsChanged(msg.sender);
    }

    /**
     * @notice Sets IPFS as the storage provider for the datastore.
     * Since switching between storage providers is not supported,
     * the method can only be called if storage isn't set or already IPFS.
     * Also sets AES as the encryption provider.
     * @param _host Host
     * @param _port Port
     * @param _protocol HTTP protocol
     * @param _name Name of the AES encryption algorithm
     * @param _length Length of the encryption key
     */
    function setSettings(string _host, uint16 _port, string _protocol, string _name, uint _length) public {
        require(settings.storageProvider == StorageProvider.None || settings.storageProvider == StorageProvider.Ipfs);
        require(settings.encryptionProvider == EncryptionProvider.None || settings.encryptionProvider == EncryptionProvider.Aes);

        settings.ipfsHost = _host;
        settings.ipfsPort = _port;
        settings.ipfsProtocol = _protocol;
        settings.storageProvider = StorageProvider.Ipfs;

        settings.aesName = _name;
        settings.aesLength = _length;
        settings.encryptionProvider = EncryptionProvider.Aes;

        emit SettingsChanged(msg.sender);
    }

  /**
     * @notice Returns true if `_entity` has read access on file `_fileId`
     * @param _fileId File Id
     * @param _entity Entity address     
     */
    function hasReadAccess(uint _fileId, address _entity) public view returns (bool) {
        if (fileOwners.isOwner(_fileId, _entity) || permissions.entityPermissions[_fileId][_entity].read)
            return true;

        for (uint i = 0; i < groups.groupList.length; i++) {
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
    function hasWriteAccess(uint _fileId, address _entity) public view returns (bool) {
        if (fileOwners.isOwner(_fileId, _entity) || permissions.entityPermissions[_fileId][_entity].write)
            return true;

        for (uint i = 0; i < groups.groupList.length; i++) {
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
        groups.createGroup(_groupName);
        emit GroupChange(msg.sender);
    }

    /**
     * @notice Delete a group from the datastore
     * @param _groupId Id of the group to delete
     */
    function deleteGroup(uint _groupId) external {
        require(groups.groups[_groupId].exists);
        groups.deleteGroup(_groupId);
        emit GroupChange(msg.sender);
    }

    /**
     * @notice Rename a group
     * @param _groupId Id of the group to rename
     * @param _newGroupName New name for the group
     */
    function renameGroup(uint _groupId, string _newGroupName) external {
        require(groups.groups[_groupId].exists);
        groups.renameGroup(_groupId, _newGroupName);
        emit GroupChange(msg.sender);
    }

    /**
     * @notice Get a specific group
     * @param _groupId Id of the group to return
     */
    function getGroup(uint _groupId) public view returns (address[], string) {
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
     * @notice Get an entity inside a specific group
     * @param _groupId Id of the group to retrieve the entity from
     * @param _entityIndex Index of the entity to retrieve from the group
     */
    function getEntityInGroup(uint _groupId, uint _entityIndex) public view returns (address) {
        require(groups.groups[_groupId].exists);
        return groups.getEntityInGroup(_groupId, _entityIndex);
    }

    /**
     * @notice Get the number of entities in a group
     * @param _groupId Id of the group to get the count from
     */
    function getGroupEntityCount(uint _groupId) public view returns(uint) {
        require(groups.groups[_groupId].exists);
        return groups.getGroupEntityCount(_groupId);
    }

    /**
     * @notice Add an entity to a group
     * @param _groupId Id of the group to add the entity in
     * @param _entity Address of the entity
     */
    function addEntityToGroup(uint _groupId, address _entity) public {
        require(groups.groups[_groupId].exists);
        groups.addEntityToGroup(_groupId, _entity);
        emit GroupChange(msg.sender);
    }

    /**
     * @notice Remove an entity from a group
     * @param _groupId Id of the group to remove the entity from 
     * @param _entity Address of the entity
     */
    function removeEntityFromGroup(uint _groupId, address _entity) public {
        require(groups.groups[_groupId].exists);
        groups.removeEntityFromGroup(_groupId, _entity);
        emit GroupChange(msg.sender);
    }

    /**
     * @notice Set the read and write permissions on a file for a specified group
     * @param _fileId Id of the file
     * @param _groupId Id of the group
     * @param _read Read permission
     * @param _write Write permission
     */
    function setGroupPermissions(uint _fileId, uint _groupId, bool _read, bool _write) public onlyFileOwner(_fileId) {
        permissions.setGroupPermissions(_fileId, _groupId, _read, _write);
        emit NewGroupPermissions(msg.sender, _fileId);
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
        uint _fileSize, string _encryptionKey) 
        public 
        onlyFileOwner(_fileId) 
    {
        for(uint256 i = 0; i < _groupIds.length; i++) 
            permissions.setGroupPermissions(_fileId, _groupIds[i], _groupRead[i], _groupWrite[i]);
        
        for(uint256 j = 0; j < _entities.length; j++) 
            permissions.setEntityPermissions(_fileId, _entities[j], _entityRead[j], _entityWrite[j]);

        fileList.setPublic(_fileId, _isPublic);

        if (!_isPublic || (_isPublic && keccak256(_encryptionKey) == keccak256(""))) {
            fileList.setFileContent(_fileId, _storageRef, _fileSize);
            fileList.setEncryptionKey(_fileId, _encryptionKey);
        }
        emit NewPermissions(msg.sender, _fileId);
    }

    /**
     * @notice Remove group from file permissions
     * @param _fileId Id of the file
     * @param _groupId Id of the group
     */
    function removeGroupFromFile(uint _fileId, uint _groupId) public onlyFileOwner(_fileId) {
        permissions.removeGroupFromFile(_fileId, _groupId);
        emit GroupPermissionsRemoved(msg.sender);
    }
}

contract DriveApp is AragonApp, Datastore {
    using SafeMath for uint256;

    function initialize() external {
        /* settings = Settings({
            storageProvider: StorageProvider.Ipfs,
            encryptionProvider: EncryptionProvider.Aes,
            ipfsHost: "localhost",
            ipfsPort: 5001,
            ipfsProtocol: "http"
        }); */
    }
}
