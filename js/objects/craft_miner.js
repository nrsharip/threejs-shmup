import AbstractCraft from './craft.js'

import * as GAME from '../game.js'

class CraftMiner extends AbstractCraft {
    constructor(filename) { 
        super(filename); 
    
        this.health = 200;
        this.damage = 30;
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

const craft_miner = new CraftMiner("craft_miner.glb");

GAME.managers.craft_miner = craft_miner;

export default craft_miner;