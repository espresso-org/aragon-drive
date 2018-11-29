pragma solidity ^0.4.24;

import "@espresso-org/object-acl/contracts/ObjectACL.sol";

library PermissionLibrary {
    /**
     * Read and write permission for an entity on a specific file
     */
    struct Permission {
        bool write;             
        bool read;
        bool exists;    // Used internally to check if an entity has a stored permission
    }

    /**
     * Users permissions on files and internal references
     */
    struct PermissionData {
        mapping (uint => mapping (address => Permission)) entityPermissions;      // Read and Write permissions for each entity
        mapping (uint => address[]) permissionAddresses;                          // Internal references for permission listing
        mapping (uint => mapping (uint => Permission)) groupPermissions;          // Read and Write permissions for groups
        mapping (uint => uint[]) groupIds;                                        // Internal references for files groups listing

        bytes32 FILE_READ_ROLE;
        bytes32 FILE_WRITE_ROLE;  

        ObjectACL acl;      
    }

    function initialize(PermissionData storage _self, ObjectACL _acl, bytes32 _FILE_READ_ROLE, bytes32 _FILE_WRITE_ROLE) internal {
        _self.acl = _acl;
        _self.FILE_READ_ROLE = _FILE_READ_ROLE;
        _self.FILE_WRITE_ROLE = _FILE_WRITE_ROLE;
    }

    /**
     * @notice Returns true if `_entity` is owner of file `_fileId`
     * @param _self PermissionData 
     * @param _fileId File Id
     * @param _entity Entity address
     */
    function isOwner(PermissionData storage _self, uint _fileId, address _entity) internal view returns (bool) {
        return _self.acl.getObjectPermissionManager(_fileId, _self.FILE_WRITE_ROLE) == _entity;
    }

    /**
     * @notice Adds an `_entity` as owner to file with `_fileId`
     * @param _self PermissionData
     * @param _fileId File Id
     * @param _entity Entity address
     */
    function addOwner(PermissionData storage _self, uint _fileId, address _entity) internal {
        _self.acl.createObjectPermission(_entity, _fileId, _self.FILE_READ_ROLE, _entity);
        _self.acl.createObjectPermission(_entity, _fileId, _self.FILE_WRITE_ROLE, _entity);
    }

    /**
     * @notice Returns the owner for the file `_fileId`
     * @param _self PermissionData
     * @param _fileId File Id
     */
    function getOwner(PermissionData storage _self, uint _fileId) internal view returns (address) {
        return _self.acl.getObjectPermissionManager(_fileId, _self.FILE_WRITE_ROLE);
    }

    function getEntityPermissionsOnFile(PermissionData storage _self, uint256 _fileId, address _entity) 
        internal 
        view 
        returns (bool write, bool read) 
    {
        read = _self.acl.hasObjectPermission(_entity, _fileId, _self.FILE_READ_ROLE);
        write = _self.acl.hasObjectPermission(_entity, _fileId, _self.FILE_WRITE_ROLE);
    }

    function getEntityReadPermissions(PermissionData storage _self, uint256 _fileId, address _entity)
        internal 
        view 
        returns (bool) 
    {
        return _self.acl.hasObjectPermission(_entity, _fileId, _self.FILE_READ_ROLE);
    }

    function getEntityWritePermissions(PermissionData storage _self, uint256 _fileId, address _entity)
        internal 
        view 
        returns (bool) 
    {
        return _self.acl.hasObjectPermission(_entity, _fileId, _self.FILE_WRITE_ROLE);
    }

    function hasWriteAccess(PermissionData storage _self, uint256 _fileId, address _entity)
        internal 
        view 
        returns (bool) 
    {
        return isOwner(_self, _fileId, _entity) || getEntityWritePermissions(_self, _fileId, _entity);
    }    

    function hasReadAccess(PermissionData storage _self, uint256 _fileId, address _entity)
        internal 
        view 
        returns (bool) 
    {
        return isOwner(_self, _fileId, _entity) || getEntityReadPermissions(_self, _fileId, _entity);
    }  

    /**
     * @notice Set the read and write permissions on a file for a specified group
     * @param _self PermissionData
     * @param _fileId Id of the file
     * @param _entity Id of the group
     * @param _read Read permission
     * @param _write Write permission
     */
    function setEntityPermissions(PermissionData storage _self, uint _fileId, address _entity, bool _read, bool _write) internal { 
        if (!_self.entityPermissions[_fileId][_entity].exists) {
            _self.permissionAddresses[_fileId].push(_entity);
            _self.entityPermissions[_fileId][_entity].exists = true;
        }
        _self.entityPermissions[_fileId][_entity].read = _read;
        _self.entityPermissions[_fileId][_entity].write = _write;

        if (_read) {
            _self.acl.createObjectPermission(_entity, _fileId, _self.FILE_READ_ROLE, msg.sender);
            _self.acl.grantObjectPermission(_entity, _fileId, _self.FILE_READ_ROLE, msg.sender);        
        }

        if (_write) {
            _self.acl.createObjectPermission(_entity, _fileId, _self.FILE_WRITE_ROLE, msg.sender);
            _self.acl.grantObjectPermission(_entity, _fileId, _self.FILE_WRITE_ROLE, msg.sender);
        }
    }   

    /**
     * @notice Set the read and write permissions on a file for a specified group
     * @param _self PermissionData
     * @param _fileId Id of the file
     * @param _groupId Id of the group
     * @param _read Read permission
     * @param _write Write permission
     */
    function setGroupPermissions(PermissionData storage _self, uint _fileId, uint _groupId, bool _read, bool _write) internal {
        if (!_self.groupPermissions[_fileId][_groupId].exists) {
            _self.groupIds[_fileId].push(_groupId);
            _self.groupPermissions[_fileId][_groupId].exists = true;
        }
        _self.groupPermissions[_fileId][_groupId].read = _read;
        _self.groupPermissions[_fileId][_groupId].write = _write;
    }

    /**
     * @notice Remove entity from file permissions
     * @param _self PermissionData
     * @param _fileId Id of the file
     * @param _entity Entity address
     */
    function removeEntityFromFile(PermissionData storage _self, uint _fileId, address _entity) internal {
        if (_self.entityPermissions[_fileId][_entity].exists) {
            delete _self.entityPermissions[_fileId][_entity];
            for (uint i = 0; i < _self.permissionAddresses[_fileId].length; i++) {
                if (_self.permissionAddresses[_fileId][i] == _entity)
                    delete _self.permissionAddresses[_fileId][i];
            }
            _self.acl.revokeObjectPermission(_entity, _fileId, _self.FILE_READ_ROLE, msg.sender);
            _self.acl.revokeObjectPermission(_entity, _fileId, _self.FILE_WRITE_ROLE, msg.sender);
        }
    }

    /**
     * @notice Remove group from file permissions
     * @param _self PermissionData
     * @param _fileId Id of the file
     * @param _groupId Id of the group
     */
    function removeGroupFromFile(PermissionData storage _self, uint _fileId, uint _groupId) internal {
        if (_self.groupPermissions[_fileId][_groupId].exists) {
            delete _self.groupPermissions[_fileId][_groupId];
            for (uint i = 0; i < _self.groupIds[_fileId].length; i++) {
                if (_self.groupIds[_fileId][i] == _groupId)
                    delete _self.groupIds[_fileId][i];
            }
        }
    }
}