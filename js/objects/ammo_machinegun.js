import * as GAME from '../game.js'
import * as PHYSICS from '../physics.js'
import * as UTILS from '../utils.js'

const glbFilename = "ammo_machinegun.glb";

function createInstances(mass, count) {
    GAME.models.createInstances(glbFilename, count);
    for (let obj3d of GAME.instances[glbFilename].available) {
        obj3d.userData.boundingBox.getSize(UTILS.tmpV1);
        obj3d.userData.onCollision = function(other) {
            // if (other && other.userData) {
            //     if (other.userData?.name == "ground") {
            //         PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(0, 200, 0));
            //     }
            // }
        }
        PHYSICS.initObject(obj3d, mass, UTILS.tmpV1, 0.05);
    }
}

function addInstanceTo(to, position, rotation, linVelocity, angVelocity) {
    let obj3d = GAME.instances.acquireInstance(glbFilename);
    
    PHYSICS.clearForces(obj3d);
    PHYSICS.addRigidBody(obj3d);
    
    if (position) { UTILS.tmpV1.set(position.x, position.y, position.z); } else { UTILS.tmpV1.set(0, 0, 0); }
    if (rotation) { UTILS.tmpQuat1.set(rotation.x, rotation.y, rotation.z, rotation.w); } else { UTILS.tmpQuat1.identity(); }
    if (linVelocity) { UTILS.tmpV2.set(linVelocity.x, linVelocity.y, linVelocity.z); } else { UTILS.tmpV2.set(0, 0, 0); }
    if (angVelocity) { UTILS.tmpV3.set(angVelocity.x, angVelocity.y, angVelocity.z); } else { UTILS.tmpV3.set(0, 0, 0); }

    // In case dynamics world is OFF
    obj3d.position.x = position.x;
    obj3d.position.y = position.y;
    obj3d.position.z = position.z;

    // In case dynamics world is ON
    PHYSICS.makeTranslationAndRotation(obj3d, UTILS.tmpV1, UTILS.tmpQuat1);
    PHYSICS.setLinearAndAngularVelocity(obj3d, UTILS.tmpV2, UTILS.tmpV3);

    to.add( obj3d );
    return obj3d;
}

function getInstanceAvailable(index) { return GAME.instances.getAvailable(glbFilename, index); }
function getInstanceInUse(index) { return GAME.instances.getInUse(glbFilename, index); }

export { 
    createInstances, 
    addInstanceTo,

    getInstanceAvailable,
    getInstanceInUse,
}