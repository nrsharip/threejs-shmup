import AsbtractGameObjectManager from '../object.js'

import * as GAME from '../game.js'

class TurretDouble extends AsbtractGameObjectManager {
    constructor(filename) { 
        super(filename); 
    }

    update(delta, elapsed) {
    }
    
    onCollision(other) {
    }

    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);
    }

    onKeyboardKeyDown(event) {
    }

    onMouseDown(event) {
    }

    resetGamePlayParams(params) {
        if (!params) { throw new Error("params must be an object") }

        return params;
    }
}

const turret_double = new TurretDouble("turret_double.glb");

GAME.managers.turret_double = turret_double;

export default turret_double;