import AbstractCraft from './craft.js'

import * as GAME from '../game.js'

class CraftSpeederB extends AbstractCraft {
    constructor(filename) { 
        super(filename); 
    
        this.health = 120;
        this.damage = 20;

        this.weapons = {
            machinegun: { released: 0, delta: 250 },
            rocket: { released: 0, delta: 1000 },
        }
    }

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

        return params;
    }
}

const craft_speederB = new CraftSpeederB("craft_speederB.glb");

GAME.managers.craft_speederB = craft_speederB;

export default craft_speederB;