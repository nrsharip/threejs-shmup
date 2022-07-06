import AsbtractGameObjectManager from '../object.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

export default class AbstractAmmo extends AsbtractGameObjectManager {
    constructor(filename) { super(filename); }

    update(delta, elapsed) {
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
        return Object.create({
            damage: 20
        });
    }
}