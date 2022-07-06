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

    resetGamePlayParams(params) {
        if (!params) { throw new Error("params must be an object") }

        params.damage = 20;
        params.releasedBy = undefined;

        if (params.targetsHit && params.targetsHit instanceof Array) {
            params.targetsHit.length = 0;
        } else {
            params.targetsHit = [];
        }

        return params;
    }
}