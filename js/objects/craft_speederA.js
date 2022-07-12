import AbstractCraft from './craft.js'

import * as GAME from '../game.js'

class CraftSpeederA extends AbstractCraft {
    constructor(filename) { 
        super(filename); 
    
        this.health = 160;
        this.damage = 25;

        this.weapons = {
            machinegun: { released: 0, delta: 200 },
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

const craft_speederA = new CraftSpeederA("craft_speederA.glb");

GAME.managers.craft_speederA = craft_speederA;

export default craft_speederA;