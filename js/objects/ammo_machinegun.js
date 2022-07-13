import AbstractAmmo from './ammo.js'
import * as GAME from '../game.js'

class AmmoMachinegun extends AbstractAmmo {
    constructor(filename) { 
        super(filename); 
    
        this.damage = 10;
    }

    update(delta, elapsed) { 
        super.update(delta, elapsed);
    }

    onCollision(other) {
        super.onCollision(other);
    }

    onUpdate(delta, elapsed) { 
        super.onUpdate(delta, elapsed);
        // if bullet exists more than 2 sec - remove it
        if (this.userData.timeElapsed > 2000) {
            this.userData.releaseInstance();
        }
    }

    onKeyboardKeyDown(event) {  }

    onMouseDown(event) {  }

    resetGamePlayParams(params) {
        super.resetGamePlayParams(params);

        return params;
    }
} 

const ammo_machinegun = new AmmoMachinegun("ammo_machinegun.glb");

GAME.managers.ammo_machinegun = ammo_machinegun;

export default ammo_machinegun;