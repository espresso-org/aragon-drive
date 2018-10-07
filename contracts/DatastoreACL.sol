pragma solidity ^0.4.24;

import '@aragon/os/contracts/acl/ACL.sol';
import '@aragon/os/contracts/acl/ACLSyntaxSugar.sol';


contract DatastoreACL is ACL {

    bytes32 constant public FILE_OWNER_ROLE = keccak256("FILE_OWNER_ROLE");

    address private datastore;

    modifier auth(bytes32 _role) {
        require(canPerform(msg.sender, _role, new uint256[](0)));
        _;
    }


    /**
    * @dev Initialize can only be called once. It saves the block number in which it was initialized.
    * @notice Initialize an ACL instance and set `_permissionsCreator` as the entity that can create other permissions
    * @param _permissionsCreator Entity that will be given permission over createPermission
    */
    function initialize(address _permissionsCreator) public {
        //initialized();
        // TODO: Set initialized
        datastore = _permissionsCreator;
        _createPermission(_permissionsCreator, this, CREATE_PERMISSIONS_ROLE, _permissionsCreator);
    }


    function canPerform(address _sender, bytes32 _role, uint256[] _params) public view returns (bool) {
        /*if (!hasInitialized()) {
            return false;
        }*/
        // TODO: check init

        bytes memory how; // no need to init memory as it is never used
        if (_params.length > 0) {
            uint256 byteLength = _params.length * 32;
            assembly {
                how := _params // forced casting
                mstore(how, byteLength)
            }
        }
        return hasPermission(_sender, address(this), _role, how);
    }        
    
    /**
    * @dev Creates a permission that wasn't previously set and managed.
    *      If a created permission is removed it is possible to reset it with createPermission.
    *      This is the **ONLY** way to create permissions and set managers to permissions that don't
    *      have a manager.
    *      In terms of the ACL being initialized, this function implicitly protects all the other
    *      state-changing external functions, as they all require the sender to be a manager.
    * @notice Create a new permission granting `_entity` the ability to perform actions requiring `_role` on `_app`, setting `_manager` as the permission's manager
    * @param _entity Address of the whitelisted entity that will be able to perform the role
    * @param _app Address of the app in which the role will be allowed (requires app to depend on kernel for ACL)
    * @param _role Identifier for the group of actions in app given access to perform
    * @param _manager Address of the entity that will be able to grant and revoke the permission further.
    */
    function createPermission(address _entity, address _app, bytes32 _role, address _manager)
        external
        auth(CREATE_PERMISSIONS_ROLE)
        noPermissionManager(_app, _role)
    {
        _createPermission(_entity, _app, _role, _manager);
    }  


    function createPermissionWithArg(uint256 _arg, bytes32 _role)
        external
        auth(CREATE_PERMISSIONS_ROLE)
        noPermissionManager(datastore, _role)
    {
        _createPermission(datastore, datastore, keccak256(_role, _arg), datastore);
    }  

    function hasPermissionWithArg(address _entity, uint256 _arg, bytes32 _role) public view returns (bool)
    {
        return hasPermission(_entity, datastore, keccak256(_role, _arg), new uint256[](0));
    }   

    function grantPermissionWithArg(address _entity, uint256 _arg, bytes32 _role)
        external
    {
        if (getPermissionManager(datastore, keccak256(_role, _arg)) == 0)
            _createPermission(_entity, datastore, keccak256(_role, _arg), datastore);

        _setPermission(_entity, datastore, keccak256(_role, _arg), EMPTY_PARAM_HASH);
    }

    function revokePermissionWithArg(address _entity, uint256 _arg, bytes32 _role)
        external
    {
        if (getPermissionManager(datastore, keccak256(_role, _arg)) == msg.sender)
            _setPermission(_entity, datastore, keccak256(_role, _arg), NO_PERMISSION);
    }


  

    function hasPermission(address _entity, address _app, bytes32 _role) public view returns (bool)
    {
        return hasPermission(_entity, _app, _role, new uint256[](0));
    }


}

