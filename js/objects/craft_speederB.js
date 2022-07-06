import Craft from './craft.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

class CraftSpeederB extends Craft {
    constructor(filename) { super(filename); }

    update(delta, elapsed) {
        super.update(delta, elapsed);
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
}

const craft_speederB = new CraftSpeederB("craft_speederB.glb");

GAME.managers.push(craft_speederB);

export default craft_speederB;