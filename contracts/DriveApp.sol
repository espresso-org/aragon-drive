pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";
import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/os/contracts/acl/ACLSyntaxSugar.sol";
import "./libraries/PermissionLibrary.sol";
import "./libraries/GroupLibrary.sol";

/**
 * Since inheritance is not currently supported (see https://github.com/aragon/aragon-cli/issues/133) 
 * the Datastore smart contract is added directly in this file.
 */

//import "aragon-datastore/contracts/Datastore.sol"

contract Datastore is AragonApp {
    using SafeMath for uint256;
    using PermissionLibrary for PermissionLibrary.OwnerData;
    using PermissionLibrary for PermissionLibrary.PermissionData;
    using GroupLibrary for GroupLibrary.GroupData;

    bytes32 constant public DATASTORE_MANAGER_ROLE = keccak256("DATASTORE_MANAGER_ROLE");
    bytes32 constant public INCREMENT_ROLE = keccak256("INCREMENT_ROLE");
    bytes32 constant public DECREMENT_ROLE = keccak256("DECREMENT_ROLE");    

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
    enum EncryptionType { None, Aes }

    struct Settings {
        StorageProvider storageProvider;
        EncryptionType encryption;

        string ipfsHost;
        uint16 ipfsPort;
        string ipfsProtocol;
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
     * File stored in the Datastore
     */
    struct File {
        string storageRef;      // Storage Id of IPFS (Filecoin, Swarm in the future)
        string name;            // File name
        uint fileSize;          // File size in bytes
        string keepRef;         // Keep Id for encryption key
        bool isPublic;          // True if file can be read by anyone
        bool isDeleted;         // Is file deleted
        uint lastModification;  // Timestamp of the last file content update
    }

    /**
     * Id of the last file added to the datastore. 
     * Also represents the total number of files stored.
     */
    uint public lastFileId = 0;
    mapping (uint => File) private files;
    PermissionLibrary.OwnerData private fileOwners;
    PermissionLibrary.PermissionData private permissions;
    GroupLibrary.GroupData private groups;
    Settings public settings;

    ACL private acl;


    function init() onlyInit public
    {
        initialized();

        acl = ACL(kernel().acl());

        //acl.createPermission(this, this, FILE_OWNER_ROLE, this);
        //acl.createPermission(this, this, DATASTORE_MANAGER_ROLE, this);

        //acl.grantPermission(msg.sender, this, DATASTORE_MANAGER_ROLE);
    }      
    
    /**
     * @notice Add a file to the datastore
     * @param _storageRef Storage Id of the file (IPFS only for now)
     * @param _name File name
     * @param _fileSize File size in bytes
     * @param _isPublic Is file readable by anyone
     */
    function addFile(string _storageRef, string _name, uint _fileSize, bool _isPublic) external auth(DATASTORE_MANAGER_ROLE) returns (uint fileId) {
        lastFileId = lastFileId.add(1);

        files[lastFileId] = File({
            storageRef: _storageRef,
            name: _name,
            fileSize: _fileSize,
            keepRef: "",
            isPublic: _isPublic,
            isDeleted: false,
            lastModification: now
        });
        PermissionLibrary.addOwner(fileOwners, lastFileId, msg.sender);
        PermissionLibrary.initializePermissionAddresses(permissions, lastFileId);
        emit NewFile(msg.sender, lastFileId);
        return lastFileId;
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
        File storage file = files[_fileId];

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
        File storage file = files[_fileId];

        storageRef = file.storageRef;
        name = file.name;
        fileSize = file.fileSize;
        isPublic = file.isPublic;
        isDeleted = file.isDeleted;
        owner = fileOwners.fileOwners[_fileId];
        isOwner = fileOwners.isOwner(_fileId, msg.sender);
        lastModification = file.lastModification;
        permissionAddresses = permissions.permissionAddresses[_fileId];
        writeAccess = hasWriteAccess(_fileId, _caller);
    }    

    /**
     * @notice Delete file with Id `_fileId`
     * @param _fileId File Id
     */
    function deleteFile(uint _fileId) public {
        require(fileOwners.isOwner(_fileId, msg.sender));

        files[_fileId].isDeleted = true;
        files[_fileId].lastModification = now;
        emit DeleteFile(msg.sender, lastFileId);
    }

    /**
     * @notice Changes name of file `_fileId` to `_newName`
     * @param _fileId File Id
     * @param _newName New file name
     */
    function setFileName(uint _fileId, string _newName) external {
        require(hasWriteAccess(_fileId, msg.sender));

        files[_fileId].name = _newName;
        files[_fileId].lastModification = now;
        emit FileRename(msg.sender, lastFileId);
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

        files[_fileId].storageRef = _storageRef;
        files[_fileId].fileSize = _fileSize;
        files[_fileId].lastModification = now;
        emit FileContentUpdate(msg.sender, lastFileId);
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
     * @notice Set read permission to `_hasPermission` for `_entity` on file `_fileId`
     * @param _fileId File Id
     * @param _entity Entity address
     * @param _hasPermission Read permission
     */
    function setReadPermission(uint _fileId, address _entity, bool _hasPermission) external {
        require(fileOwners.isOwner(_fileId, msg.sender));
        permissions.setReadPermission(_fileId, _entity, _hasPermission);
        emit NewReadPermission(msg.sender, lastFileId);
    }

    /**
     * @notice Set write permission to `_hasPermission` for `_entity` on file `_fileId`
     * @param _fileId File Id
     * @param _entity Entity address
     * @param _hasPermission Write permission
     */
    function setWritePermission(uint _fileId, address _entity, bool _hasPermission) external {
        require(fileOwners.isOwner(_fileId, msg.sender));
        permissions.setWritePermission(_fileId, _entity, _hasPermission);
        emit NewWritePermission(msg.sender, lastFileId);
    }

    /**
     * @notice Add/Remove permissions to an entity for a specific file
     * @param _fileId File Id
     * @param _entity Entity address
     * @param _read Read permission
     * @param _write Write permission     
     */
    function setEntityPermissions(uint _fileId, address _entity, bool _read, bool _write) external {
        require(fileOwners.isOwner(_fileId, msg.sender));
        permissions.setEntityPermissions(_fileId, _entity, _read, _write);
        emit NewEntityPermissions(msg.sender, lastFileId);
    }

    /**
     * @notice Remove entity from file permissions
     * @param _fileId Id of the file
     * @param _entity Entity address
     */
    function removeEntityFromFile(uint _fileId, address _entity) external {
        require(fileOwners.isOwner(_fileId, msg.sender));
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
     * Sets IPFS as the storage provider for the datastore.
     * Since switching between storage providers is not supported,
     * the method can only be called if storage isn't set or already IPFS
     */
    function setIpfsStorageSettings(string host, uint16 port, string protocol) public {
        require(settings.storageProvider == StorageProvider.None || settings.storageProvider == StorageProvider.Ipfs);

        settings.ipfsHost = host;
        settings.ipfsPort = port;
        settings.ipfsProtocol = protocol;
        /*
        settings.ipfs = IpfsSettings({
            host: host,
            port: port,
            protocol: protocol
        });*/

        settings.storageProvider = StorageProvider.Ipfs;
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
    function createGroup(string _groupName) external auth(DATASTORE_MANAGER_ROLE) returns (uint) {
        uint id = groups.createGroup(_groupName);
        emit GroupChange(msg.sender);
        return id;
    }

    /**
     * @notice Delete a group from the datastore
     * @param _groupId Id of the group to delete
     */
    function deleteGroup(uint _groupId) external auth(DATASTORE_MANAGER_ROLE) {
        require(groups.groups[_groupId].exists);
        groups.deleteGroup(_groupId);
        emit GroupChange(msg.sender);
    }

    /**
     * @notice Rename a group
     * @param _groupId Id of the group to rename
     * @param _newGroupName New name for the group
     */
    function renameGroup(uint _groupId, string _newGroupName) external auth(DATASTORE_MANAGER_ROLE) {
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
    function getGroupIds() public view returns (uint[]){
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
    function setGroupPermissions(uint _fileId, uint _groupId, bool _read, bool _write) public {
        require(fileOwners.isOwner(_fileId, msg.sender));
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
     */
    function setMultiplePermissions(uint256 _fileId, uint256[] _groupIds, bool[] _groupRead, bool[] _groupWrite, address[] _entities, bool[] _entityRead, bool[] _entityWrite, bool _isPublic) public {
        require(fileOwners.isOwner(_fileId, msg.sender));

        for(uint256 i = 0; i < _groupIds.length; i++) 
            permissions.setGroupPermissions(_fileId, _groupIds[i], _groupRead[i], _groupWrite[i]);
        
        for(uint256 j = 0; j < _entities.length; j++) 
            permissions.setEntityPermissions(_fileId, _entities[j], _entityRead[j], _entityWrite[j]);

        files[_fileId].isPublic = _isPublic;
        emit NewPermissions(msg.sender, _fileId);
    }    

    /**
     * @notice Remove group from file permissions
     * @param _fileId Id of the file
     * @param _groupId Id of the group
     */
    function removeGroupFromFile(uint _fileId, uint _groupId) public {
        require(fileOwners.isOwner(_fileId, msg.sender));
        permissions.removeGroupFromFile(_fileId, _groupId);
        emit GroupPermissionsRemoved(msg.sender);
    }
}

contract DriveApp is Datastore {
    using SafeMath for uint256;

    function initialize() external {
        super.init();

        settings = Settings({
            storageProvider: StorageProvider.Ipfs,
            encryption: EncryptionType.Aes,
            ipfsHost: "localhost",
            ipfsPort: 5001,
            ipfsProtocol: "http"
        });
    }
}
