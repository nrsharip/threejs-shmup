import AbstractCraft from './craft.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

class CraftSpeederB extends AbstractCraft {
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

        params.health = 120;

        params.damage = 20;

        return params;
    }
}

const craft_speederB = new CraftSpeederB("craft_speederB.glb");

GAME.managers.craft_speederB = craft_speederB;

export default craft_speederB;