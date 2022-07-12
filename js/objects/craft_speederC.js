import AbstractCraft from './craft.js'

import * as GAME from '../game.js'

class CraftSpeederC extends AbstractCraft {
    constructor(filename) { 
        super(filename); 
    
        this.health = 80;
        this.damage = 15;

        this.weapons = {
            machinegun: { released: 0, delta: 300 },
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

const craft_speederC = new CraftSpeederC("craft_speederC.glb");

GAME.managers.craft_speederC = craft_speederC;

export default craft_speederC;