import AsbtractGameObjectManager from '../object.js'
import * as PHYSICS from '../physics.js'
import * as GAME from '../game.js'

class AmmoMachinegun extends AsbtractGameObjectManager {
    update(delta, elapsed) {}

    onCollision(other) {
        // console.log(other);
        // if (other && other.userData) {
        //     if (other.userData?.name == "ground") {
        //         PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(0, 200, 0));
        //     }
        // }
    }

    onUpdate(delta, elapsed) { 
        if (this.position.z < -80) { 
            PHYSICS.removeRigidBody(this);
            GAME.instances.releaseInstance(this); 
        }
    }

    onKeyboardKeyDown(event) {  }

    onMouseDown(event) {  }
} 

const ammo_machinegun = new AmmoMachinegun("ammo_machinegun.glb");

GAME.managers.push(ammo_machinegun);

export default ammo_machinegun;