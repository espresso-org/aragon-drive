pragma solidity ^0.4.18;

import '@aragon/os/contracts/apps/AragonApp.sol';
import '@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol';

library PermissionLibrary {
    using SafeMath for uint256;

    /**
     * Owners of files    
     */
    struct OwnerData {
        mapping (uint => address) fileOwners;
    }

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
        mapping (uint => mapping (address => Permission)) permissions;      // Read and Write permissions for each entity
        mapping (uint => address[]) permissionAddresses;                    // Internal references for permission listing
        mapping (uint => mapping (uint => Permission)) groupPermissions;    // Read and Write permissions for groups
        mapping (uint => uint[]) groupIds;                                  // Internal references for files groups listing
    }

    // ************* OwnerData ************* //
    /**
     * @notice Returns true if `_entity` is owner of file `_fileId`
     * @param _self OwnerData 
     * @param _fileId File Id
     * @param _entity Entity address
     */
    function isOwner(OwnerData storage _self, uint _fileId, address _entity) internal view returns (bool) {
        return _self.fileOwners[_fileId] == _entity;
    }

    /**
     * @notice Adds an `_entity` as owner to file with `_fileId`
     * @param _self OwnerData
     * @param _fileId File Id
     * @param _entity Entity address
     */
    function addOwner(OwnerData storage _self, uint _fileId, address _entity) internal {
        _self.fileOwners[_fileId] = _entity;
    }

    // ************* PermissionData ************* //
    /**
     * @notice Initializes the permissionAddresses array for the file with `_fileId`
     * @param _self PermissionData
     * @param _fileId File Id
     */
    function initializePermissionAddresses(PermissionData storage _self, uint _fileId) internal {
        _self.permissionAddresses[_fileId] = new address[](0);
    }

    /**
     * @notice Set read permission to `_hasPermission` for `_entity` on file `_fileId`
     * @param _self PermissionData
     * @param _fileId File Id
     * @param _entity Entity address
     * @param _hasPermission Read permission
     */
    function setReadPermission(PermissionData storage _self, uint _fileId, address _entity, bool _hasPermission) internal {
        if (!_self.permissions[_fileId][_entity].exists) {
            _self.permissionAddresses[_fileId].push(_entity);
            _self.permissions[_fileId][_entity].exists = true;
        }

        _self.permissions[_fileId][_entity].read = _hasPermission;
    }

    /**
     * @notice Set write permission to `_hasPermission` for `_entity` on file `_fileId`
     * @param _self PermissionData
     * @param _fileId File Id
     * @param _entity Entity address
     * @param _hasPermission Write permission
     */
    function setWritePermission(PermissionData storage _self, uint _fileId, address _entity, bool _hasPermission) internal {
        if (!_self.permissions[_fileId][_entity].exists) {
            _self.permissionAddresses[_fileId].push(_entity);
            _self.permissions[_fileId][_entity].exists = true;
        }

        _self.permissions[_fileId][_entity].write = _hasPermission;
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
     * @notice Remove group from file permissions
     * @param _self PermissionData
     * @param _fileId Id of the file
     * @param _groupId Id of the group
     */
    function removeGroupFromFile(PermissionData storage _self, uint _fileId, uint _groupId) internal {
        if(_self.groupPermissions[_fileId][_groupId].exists) {
            delete _self.groupPermissions[_fileId][_groupId];
            for(uint i = 0; i < _self.groupIds[_fileId].length; i++) {
                if(_self.groupIds[_fileId][i] == _groupId)
                    delete _self.groupIds[_fileId][i];
            }
        }
    }
}