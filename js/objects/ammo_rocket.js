import AbstractAmmo from './ammo.js'
import * as GAME from '../game.js'

class AmmoRocket extends AbstractAmmo {
    constructor(filename) { 
        super(filename); 
    
        this.damage = 10;
    }
    
    addInstanceTo(to, position, rotation, linVelocity, angVelocity) {
        let obj3d = super.addInstanceTo(to, position, rotation, linVelocity, angVelocity);

        GAME.yuka.entityManager.add( obj3d.userData.yuka.vehicle );
        //console.log("added: ", this.glbFilename, obj3d.userData.yuka.vehicle.uuid);

        return obj3d;
    }

    releaseInstance() {
        super.releaseInstance();

        this.userData.yuka.vehicle.steering.clear();
        GAME.yuka.entityManager.remove(this.userData.yuka.vehicle);
        //console.log("removed: ", this.userData.filename, this.userData.yuka.vehicle.uuid);
    }

    update(delta, elapsed) { 
        super.update(delta, elapsed);
    }

    onCollision(other) {
    }

    onUpdate(delta, elapsed) { 
        super.onUpdate(delta, elapsed);
        // if a rocket exists more than 20 sec - remove it
        if (this.userData.timeElapsed > 20000) {
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

const ammo_rocket = new AmmoRocket("ammo_rocket.glb");

GAME.managers.ammo_rocket = ammo_rocket;

export default ammo_rocket;