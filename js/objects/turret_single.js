import AsbtractGameObjectManager from '../object.js'

import * as GAME from '../game.js'

class TurretSingle extends AsbtractGameObjectManager {
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

const turret_single = new TurretSingle("turret_single.glb");

GAME.managers.turret_single = turret_single;

export default turret_single;