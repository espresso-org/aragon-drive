pragma solidity ^0.4.24;

import '@aragon/os/contracts/apps/AragonApp.sol';



contract DatastoreACL is AragonApp, ACLHelpers {

    bytes32 public constant DATASTOREACL_ADMIN_ROLE = keccak256("DATASTOREACL_ADMIN_ROLE");

    event SetObjectPermission(address indexed entity, bytes32 indexed obj, bytes32 indexed role, bool allowed);
    event ChangeObjectPermissionManager(bytes32 indexed obj, bytes32 indexed role, address indexed manager);


    mapping (bytes32 => mapping (bytes32 => bool)) internal objectPermissions; 
    mapping (bytes32 => address) internal objectPermissionManager;



    modifier onlyPermissionManager(address _sender, bytes32 _obj, bytes32 _role) {
        require(getObjectPermissionManager(_obj, _role) == _sender, "Must be the object permission manager");
        _;
    }


    /**
    * @dev Initialize can only be called once. It saves the block number in which it was initialized.
    */
    function initialize() public onlyInit {
        initialized();
    } 

    /**
    * @dev Creates a `_role` permission with a uint object on the Datastore
    * @param _entity Entity for which to set the permission
    * @param _obj Object
    * @param _role Identifier for the group of actions in app given access to perform
    * @param _permissionManager The permission manager
    */
    function createObjectPermission(address _entity, uint256 _obj, bytes32 _role, address _permissionManager)
        external
    {
        createObjectPermission(_entity, keccak256(abi.encodePacked(_obj)), _role, _permissionManager);
    } 

    /**
    * @dev Creates a `_role` permission with an object on the Datastore
    * @param _entity Entity for which to set the permission
    * @param _obj Object
    * @param _role Identifier for the group of actions in app given access to perform
    * @param _permissionManager The permission manager
    */
    function createObjectPermission(address _entity, bytes32 _obj, bytes32 _role, address _permissionManager)
        public
        auth(DATASTOREACL_ADMIN_ROLE)
    {
        _setObjectPermission(_entity, _obj, _role, true);
        _setObjectPermissionManager(_permissionManager, _obj, _role);
    }       


    /**
    * @dev Function called to verify permission for role `_role` and uint object `_obj` status on `_entity`
    * @param _entity Address of the entity
    * @param _obj Object
    * @param _role Identifier for the group of actions in app given access to perform
    * @return boolean indicating whether the ACL allows the role or not
    */
    function hasObjectPermission(address _entity, uint256 _obj, bytes32 _role) public view returns (bool)
    {
        return hasObjectPermission(_entity, keccak256(abi.encodePacked(_obj)), _role);
    }  

    /**
    * @dev Function called to verify permission for role `_role` and an object `_obj` status on `_entity`
    * @param _entity Address of the entity
    * @param _obj Object
    * @param _role Identifier for the group of actions in app given access to perform
    * @return boolean indicating whether the ACL allows the role or not
    */
    function hasObjectPermission(address _entity, bytes32 _obj, bytes32 _role) public view returns (bool)
    {
        return objectPermissions[_obj][permissionHash(_entity, _role)];
    }       

    /**
    * @dev Grants permission for role `_role` on object `_obj`, if allowed. 
    * @param _entity Address of the whitelisted entity that will be able to perform the role
    * @param _obj Object
    * @param _role Identifier for the group of actions in app given access to perform
    * @param _sender The entity that wants to grant the permission
    */
    function grantObjectPermission(address _entity, uint256 _obj, bytes32 _role, address _sender)
        external
    {
        return grantObjectPermission(_entity, keccak256(abi.encodePacked(_obj)), _role, _sender);
    }


    /**
    * @dev Grants permission for role `_role` on object `_obj`, if allowed. 
    * @param _entity Address of the whitelisted entity that will be able to perform the role
    * @param _obj Object
    * @param _role Identifier for the group of actions in app given access to perform
    * @param _sender The entity that wants to grant the permission
    */
    function grantObjectPermission(address _entity, bytes32 _obj, bytes32 _role, address _sender)
        public
        auth(DATASTOREACL_ADMIN_ROLE)
        onlyPermissionManager(_sender, _obj, _role)
    {
        _setObjectPermission(_entity, _obj, _role, true);
    }


    /**
    * @dev Revokes permission for role `_role` on object `_obj`, if allowed. 
    * @param _entity Address of the whitelisted entity to revoke access from
    * @param _obj Object
    * @param _role Identifier for the group of actions in app being revoked
    * @param _sender The entity that wants to revoke the permission
    */
    function revokeObjectPermission(address _entity, uint256 _obj, bytes32 _role, address _sender)
        external
    {
        revokeObjectPermission(_entity, keccak256(abi.encodePacked(_obj)), _role, _sender);
    }    

    /**
    * @dev Revokes permission for role `_role` on object `_obj`, if allowed. 
    * @param _entity Address of the whitelisted entity to revoke access from
    * @param _obj Object
    * @param _role Identifier for the group of actions in app being revoked
    * @param _sender The entity that wants to revoke the permission
    */
    function revokeObjectPermission(address _entity, bytes32 _obj, bytes32 _role, address _sender)
        public
        auth(DATASTOREACL_ADMIN_ROLE)
        onlyPermissionManager(_sender, _obj, _role)
    {
        _setObjectPermission(_entity, _obj, _role, false);
    }



    
    /**
    * @dev Get manager for permission
    * @param _obj Object
    * @param _role Identifier for a group of actions in app
    * @return address of the manager for the permission
    */
    function getObjectPermissionManager(uint _obj, bytes32 _role) public view returns (address) {
        return getObjectPermissionManager(keccak256(abi.encodePacked(_obj)), _role);
    }
    
    /**
    * @dev Get manager for permission
    * @param _obj Object
    * @param _role Identifier for a group of actions in app
    * @return address of the manager for the permission
    */
    function getObjectPermissionManager(bytes32 _obj, bytes32 _role) public view returns (address) {
        return objectPermissionManager[objectRoleHash(_obj, _role)];
    }


    /**
    * @dev Internal function called to actually save the permission
    */
    function _setObjectPermission(address _entity, bytes32 _obj, bytes32 _role, bool _hasPermission) internal {
        objectPermissions[_obj][permissionHash(_entity, _role)] = _hasPermission;

        emit SetObjectPermission(_entity, _obj, _role, _hasPermission);
    }   

    function _setObjectPermissionManager(address _newManager, bytes32 _obj, bytes32 _role) internal {
        objectPermissionManager[objectRoleHash(_obj, _role)] = _newManager;
        emit ChangeObjectPermissionManager(_obj, _role, _newManager);
    }

    function permissionHash(address _entity, bytes32 _role) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("OBJECT_PERMISSION", _entity, _role));
    } 

    function objectRoleHash(bytes32 _obj, bytes32 _role) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("OBJECT_ROLE", _obj, _role));
    }     


}
