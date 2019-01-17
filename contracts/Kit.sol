pragma solidity 0.4.24;

import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/apm/Repo.sol";
import "@aragon/os/contracts/lib/ens/ENS.sol";
import "@aragon/os/contracts/lib/ens/PublicResolver.sol";
import "@aragon/os/contracts/apm/APMNamehash.sol";
import "@espresso-org/aragon-comments/contracts/AragonComments.sol";
import "@espresso-org/object-acl/contracts/ObjectACL.sol";
import "./DriveApp.sol";

contract KitBase is APMNamehash {
    ENS public ens;
    DAOFactory public fac;

    event DeployInstance(address dao);
    event InstalledApp(address appProxy, bytes32 appId);

    function KitBase(DAOFactory _fac, ENS _ens) {
        ens = _ens;

        // If no factory is passed, get it from on-chain bare-kit
        if (address(_fac) == address(0)) {
            bytes32 bareKit = apmNamehash("bare-kit");
            fac = KitBase(latestVersionAppBase(bareKit)).fac();
        } else {
            fac = _fac;
        }
    }

    function latestVersionAppBase(bytes32 appId) public view returns (address base) {
        Repo repo = Repo(PublicResolver(ens.resolver(appId)).addr(appId));
        (,base,) = repo.getLatest();

        return base;
    }
}

contract Kit is KitBase {

    uint256 constant PCT = 10 ** 16;
    address constant ANY_ENTITY = address(-1);

    function Kit(ENS ens) KitBase(DAOFactory(0), ens) {
    }

    function newInstance() {
        Kernel dao = fac.newDAO(this);
        ACL acl = ACL(dao.acl());
        acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

        address root = msg.sender;
        bytes32 objectACLId = apmNamehash("object-acl");
        bytes32 appId = apmNamehash("drive");
        bytes32 aragonCommentsId = apmNamehash("aragon-comments");

        AragonComments araComments = AragonComments(dao.newAppInstance(aragonCommentsId, latestVersionAppBase(aragonCommentsId)));
        araComments.initialize();

        DriveApp app = DriveApp(dao.newAppInstance(appId, latestVersionAppBase(appId)));

        ObjectACL objectACL = ObjectACL(dao.newAppInstance(objectACLId, latestVersionAppBase(objectACLId)));
        objectACL.initialize();

        app.initialize(objectACL, araComments);


        acl.createPermission(root, app, app.DATASTORE_MANAGER_ROLE(), root);
        acl.createPermission(app, objectACL, objectACL.OBJECTACL_ADMIN_ROLE(), root);
        acl.createPermission(app, araComments, araComments.COMMENT_ROLE(), root);

        
        // Clean up permissions
        acl.grantPermission(root, dao, dao.APP_MANAGER_ROLE());
        acl.revokePermission(this, dao, dao.APP_MANAGER_ROLE());
        acl.setPermissionManager(root, dao, dao.APP_MANAGER_ROLE());

        acl.grantPermission(root, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.revokePermission(this, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.setPermissionManager(root, acl, acl.CREATE_PERMISSIONS_ROLE());

        DeployInstance(dao);
    }
}
