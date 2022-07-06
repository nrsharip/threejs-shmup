import Craft from './craft.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

class CraftMiner extends Craft {
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

const craft_miner = new CraftMiner("craft_miner.glb");

GAME.managers.push(craft_miner);

export default craft_miner;