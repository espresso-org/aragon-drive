pragma solidity ^0.4.24;

import "../DatastoreACL.sol";


library GroupLibrary {
    /**
     * Represents a group and its entities within it   
     */
    struct Group {
        string groupName;
        mapping (address => uint) entitiesWithIndex;
        address[] entities;
        bool exists;    // Used internally to check if a group really exists
    }

    /**
     * Groups of entities
     */
    struct GroupData {
        mapping (uint => Group) groups;     // Read and Write permissions for each entity
        uint[] groupList;                   // Internal references for list of groups
        DatastoreACL acl;
        bytes32 DATASTORE_GROUP;
    }


    function init(GroupData storage _self, DatastoreACL _acl) internal {
        _self.DATASTORE_GROUP = keccak256("DATASTORE_GROUP");
        _self.acl = _acl;
    }

    /**
     * @notice Add a group to the datastore
     * @param _self GroupData
     * @param _groupName Name of the group
     */
    function createGroup(GroupData storage _self, string _groupName) internal returns (uint) {
        uint id = _self.groupList.length + 1;
        _self.groups[id].groupName = _groupName;
        _self.groups[id].exists = true;
        _self.groupList.push(id);
        _self.acl.createPermissionWithArg(id, _self.DATASTORE_GROUP);
        return id;
    }

    /**
     * @notice Delete a group from the datastore
     * @param _self GroupData
     * @param _groupId Id of the group to delete
     */
    function deleteGroup(GroupData storage _self, uint _groupId) internal {
        delete _self.groups[_groupId];
        delete _self.groupList[_groupId - 1];
    }

    /**
     * @notice Rename a group
     * @param _self GroupData
     * @param _groupId Id of the group to rename
     * @param _newGroupName New name for the group
     */
    function renameGroup(GroupData storage _self, uint _groupId, string _newGroupName) internal {
        _self.groups[_groupId].groupName = _newGroupName;
    }

    /**
     * @notice Get a specific group
     * @param _self GroupData
     * @param _groupId Id of the group to return
     */
    function getGroup(GroupData storage _self, uint _groupId) internal view returns (address[] _entities, string _groupName) {
        _entities = _self.groups[_groupId].entities;
        _groupName = _self.groups[_groupId].groupName;
    }

    /**
     * @notice Returns if an entity is part of a group
     * @param _self GroupData
     * @param _groupId Id of the group
     * @param _entity Address of the entity
     */
    function isEntityInGroup(GroupData storage _self, uint _groupId, address _entity) internal view returns (bool) {
        return _self.acl.hasPermissionWithArg(_entity, _groupId, _self.DATASTORE_GROUP);
    }

    /**
     * @notice Add an entity to a group
     * @param _self GroupData
     * @param _groupId Id of the group to add the entity in
     * @param _entity Address of the entity
     */
    function addEntityToGroup(GroupData storage _self, uint _groupId, address _entity) internal {
        _self.groups[_groupId].entitiesWithIndex[_entity] = _self.groups[_groupId].entities.length + 1;
        _self.groups[_groupId].entities.push(_entity);
        _self.acl.grantPermissionWithArg(_entity, _groupId, _self.DATASTORE_GROUP);
    }

    /**
     * @notice Remove an entity from a group
     * @param _self GroupData
     * @param _groupId Id of the group to remove the entity from 
     * @param _entity Address of the entity
     */
    function removeEntityFromGroup(GroupData storage _self, uint _groupId, address _entity) internal {
        uint indexOfEntity = _self.groups[_groupId].entitiesWithIndex[_entity];
        if (indexOfEntity > 0) {
            indexOfEntity--;
            delete _self.groups[_groupId].entities[indexOfEntity];
            delete _self.groups[_groupId].entitiesWithIndex[_entity];
            _self.acl.revokePermissionWithArg(_entity, _groupId, _self.DATASTORE_GROUP);
        }
    }
}