import AbstractCraft from './craft.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

class CraftSpeederC extends AbstractCraft {
    constructor(filename) { super(filename); }

    update(delta, elapsed) {
        super.update(delta, elapsed);
    }
    
    onCollision(other) {
        super.onCollision(other);
    }

    onUpdate(delta, elapsed) { 
        super.onUpdate(delta, elapsed);
    }

    onKeyboardKeyDown(event) {
    }

    onMouseDown(event) {
    }

    resetGamePlayParams(params) {
        super.resetGamePlayParams(params);

        params.health = 80;

        params.damage = 15;

        return params;
    }
}

const craft_speederC = new CraftSpeederC("craft_speederC.glb");

GAME.managers.craft_speederC = craft_speederC;

export default craft_speederC;