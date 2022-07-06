import Craft from './craft.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

class CraftSpeederC extends Craft {
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

const craft_speederC = new CraftSpeederC("craft_speederC.glb");

GAME.managers.push(craft_speederC);

export default craft_speederC;