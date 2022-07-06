import AbstractAmmo from './ammo.js'
import * as PHYSICS from '../physics.js'
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

class AmmoMachinegun extends AbstractAmmo {
    constructor(filename) { super(filename); }

    update(delta, elapsed) { 
        super.update(delta, elapsed);
    }

    onCollision(other) {
        // console.log(other);
        // if (other && other.userData) {
        //     if (other.userData?.name == "ground") {
        //         PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(0, 200, 0));
        //     }
        // }
    }

    onUpdate(delta, elapsed) { 
        super.onUpdate(delta, elapsed);
        // if bullet exists more than 5 sec - remove it
        if (this.userData.timeElapsed > 5000) {
            PHYSICS.makeTranslation(this, UTILS.tmpV3.set(0,0,100));
            PHYSICS.removeRigidBody(this);
            GAME.instances.releaseInstance(this); 
        }
    }

    onKeyboardKeyDown(event) {  }

    onMouseDown(event) {  }

    getGamePlayParams() {
        let params = super.getGamePlayParams();

        params.damage = 10;

        return params;
    }
} 

const ammo_machinegun = new AmmoMachinegun("ammo_machinegun.glb");

GAME.managers.push(ammo_machinegun);

export default ammo_machinegun;