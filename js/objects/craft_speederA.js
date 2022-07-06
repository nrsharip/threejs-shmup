import AbstractCraft from './craft.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

class CraftSpeederA extends AbstractCraft {
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

    getGamePlayParams() {
        let params = super.getGamePlayParams();

        params.health = 80;

        return params;
    }
}

const craft_speederA = new CraftSpeederA("craft_speederA.glb");

GAME.managers.push(craft_speederA);

export default craft_speederA;