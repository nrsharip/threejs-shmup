import AsbtractSpawningObjectManager from '../spawning.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

const impacts = [
    "impactTin_medium_000.ogg",
    "impactTin_medium_001.ogg",
    "impactTin_medium_002.ogg",
    "impactTin_medium_003.ogg",
    "impactTin_medium_004.ogg",
]

export default class AbstractCraft extends AsbtractSpawningObjectManager {
    constructor(filename) { super(filename); }

    update(delta, elapsed) {
        super.update(delta, elapsed);
    }
    
    onCollision(other) {
        super.onCollision(other);
        
        if (!other || !other.userData) { console.log("ERROR: the object is unrecognizable: " + other); return; }

        if (other.userData.filename.startsWith("ammo_")) {
            if (!other.userData.gameplay.targetsHit.includes(this)) {
                other.userData.gameplay.targetsHit.push(this);

                GAME.sounds.play(impacts[Math.floor(Math.random() * impacts.length)]);

                this.userData.gameplay.health -= other.userData.gameplay.damage;
                if (this.userData.gameplay.health <= 0) {
                    this.userData.gameplay.destroyed = true;
                    this.userData.releaseInstance();
                }
            }
        }
    }

    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);
    }

    onKeyboardKeyDown(event) {
    }

    onMouseDown(event) {
    }

    spawnParameters() {
        let tmp1 = new THREE.Object3D();
        tmp1.position.set(90 * Math.random() - 45, 0, -80);         // position
        tmp1.lookAt(GAME.player.obj3d.position);                    // rotation
        UTILS.tmpV1.set(0, 0, 10).applyQuaternion(tmp1.quaternion); // linear velocity
        UTILS.tmpV2.set(0, 0, 0);                                   // angular velocity

        tmp1.quaternion.multiply(UTILS.quatDegrees180); // turning 180 degrees so the models face towards the player
        return [tmp1.position, tmp1.quaternion, UTILS.tmpV1.clone(), UTILS.tmpV2.clone()];
    }

    resetGamePlayParams(params) {
        if (!params) { throw new Error("params must be an object") }
        
        params.health = 100;
        params.destroyed = false;

        return params;
    }
}