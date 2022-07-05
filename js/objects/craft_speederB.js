import AsbtractGameObjectManager from '../object.js'
import * as PHYSICS from '../physics.js'
import * as RAYCASTER from '../raycaster.js';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'
import * as MENU from '../menu.js'

import ammo_machinegun from './ammo_machinegun.js';

class CraftSpeederB extends AsbtractGameObjectManager {
    update(delta, elapsed) {}
    
    onCollision(other) {
    }

    onUpdate(delta, elapsed) { 
    }

    onKeyboardKeyDown(event) {
    }

    onMouseDown(event) {
    }
}

const craft_speederB = new CraftSpeederB("craft_speederB.glb");

GAME.managers.push(craft_speederB);

export default craft_speederB;