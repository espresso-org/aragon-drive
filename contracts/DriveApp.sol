pragma solidity ^0.4.4;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/apps/AppProxyUpgradeable.sol";
import "@aragon/os/contracts/kernel/KernelStorage.sol";
import "@aragon/os/contracts/acl/ACL.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";

contract DriveApp is AragonApp {
    using SafeMath for uint256;

    address constant ANY_ENTITY = address(-1);
    bytes32 constant public APP_BASES_NAMESPACE = 0xf1f3eb40f5bc1ad1344716ced8b8a0431d840b5783aea1fd01786bc26f35ac0f;
    bytes32 constant public APP_ADDR_NAMESPACE = 0xd6f028ca0e8edb4a8c9757ca4fdccab25fa1e0317da1188108f7d2dee14902fb;

    /// Events
    event Increment(address indexed entity, uint256 step);
    event Decrement(address indexed entity, uint256 step);

    /// State
    uint256 public value;
    bytes32 public myAppName;
    bytes32 public myAppNamespace;
    bytes32 public myAppId;
    address public myApp;
    address public myAppThis;
    bool public hasCreatePermission;
    bool public hasIncrementPermission;
    bool public hasTestPermission;

    ACL public acl;
    address public permissionManager;


    /// ACL
    bytes32 constant public INCREMENT_ROLE = keccak256("INCREMENT_ROLE");
    bytes32 constant public DECREMENT_ROLE = keccak256("DECREMENT_ROLE");
    bytes32 constant public DATASTORE_ROLE = keccak256("DATASTORE_ROLE");
    bytes32 constant public CREATE_PERMISSIONS_ROLE = keccak256("CREATE_PERMISSIONS_ROLE");
    bytes32 constant public TEST_ROLE = keccak256("TEST_ROLE");


    function initialize() onlyInit external {
        initialized();
        acl = ACL(kernel.acl());
        myAppName = keccak256("drive-aragon-app.aragonpm.eth");
        myAppNamespace = APP_BASES_NAMESPACE;
        myAppId = keccak256(myAppNamespace, myAppName);
        myApp = kernel.getApp(keccak256(APP_BASES_NAMESPACE, appId));
        myAppThis = this;
        permissionManager = acl.getPermissionManager(this, INCREMENT_ROLE);
        hasCreatePermission = acl.hasPermission(this, this, CREATE_PERMISSIONS_ROLE);
        hasTestPermission = acl.hasPermission(this, this, TEST_ROLE);
    }

    function createPermission() external {
        acl.createPermission(msg.sender, this, DATASTORE_ROLE, this);
    }


    /**
     * @notice Increment the counter by `step`
     * @param step Amount to increment by
     */
    function increment(uint256 step) auth(INCREMENT_ROLE) external {
        value = value.add(step);
        Increment(msg.sender, step);
    }

    /**
     * @notice Decrement the counter by `step`
     * @param step Amount to decrement by
     */
    function decrement(uint256 step) auth(DECREMENT_ROLE) external {
        value = value.sub(step);
        Decrement(msg.sender, step);
    }
}
