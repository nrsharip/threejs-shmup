import AsbtractGameObjectManager from '../object.js'
import * as PHYSICS from '../physics.js'
import * as GAME from '../game.js'

class AmmoMachinegun extends AsbtractGameObjectManager {
    onCollision(other) {
        // console.log(other);
        // if (other && other.userData) {
        //     if (other.userData?.name == "ground") {
        //         PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(0, 200, 0));
        //     }
        // }
    }

    update(delta, elapsed) { 
        if (this.position.z < -80) { 
            PHYSICS.removeRigidBody(this);
            GAME.instances.releaseInstance(this); 
        }
    }

    onKeyboardKeyDown(event) {  }

    onMouseDown(event) {  }
} 

const ammo_machinegun = new AmmoMachinegun("ammo_machinegun.glb");

export default ammo_machinegun;