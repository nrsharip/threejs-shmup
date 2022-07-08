import AsbtractSpawningObjectManager from '../spawning.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

const impacts_tin = [
    "impactTin_medium_000.ogg",
    "impactTin_medium_001.ogg",
    "impactTin_medium_002.ogg",
    "impactTin_medium_003.ogg",
    "impactTin_medium_004.ogg",
]

const explosions = [
    "587186__derplayer__explosion-00.wav", // https://freesound.org/people/derplayer/sounds/587186/
    "587185__derplayer__explosion-01.wav", // https://freesound.org/people/derplayer/sounds/587185/
    "587184__derplayer__explosion-02.wav", // https://freesound.org/people/derplayer/sounds/587184/
    "587183__derplayer__explosion-03.wav", // https://freesound.org/people/derplayer/sounds/587183/
    "587190__derplayer__explosion-04.wav", // https://freesound.org/people/derplayer/sounds/587190/
    "587189__derplayer__explosion-05.wav", // https://freesound.org/people/derplayer/sounds/587190/
]

export default class AbstractCraft extends AsbtractSpawningObjectManager {
    constructor(filename) { 
        super(filename); 
    
        this.health = 100;
        this.destroyed = false;
        this.damage = 10;
    }

    update(delta, elapsed) {
        super.update(delta, elapsed);
    }
    
    onCollision(other) {
        super.onCollision(other);
        
        if (!other || !other.userData) { console.log("ERROR: the object is unrecognizable: " + other); return; }

        // craft with ammo
        if (other.userData.filename.startsWith("ammo_rocket")) {
            // rockets handled separately
        } else if (other.userData.filename.startsWith("ammo_")) {
            if (!other.userData.gameplay.targetsHit.includes(this)) {
                other.userData.gameplay.targetsHit.push(this);

                GAME.sounds.play(impacts_tin[Math.floor(Math.random() * impacts_tin.length)]);

                let damage = other.userData.gameplay.damage;

                // avoiding self-inflicted damage
                if (this !== other.userData.gameplay.releasedBy) {
                    this.userData.gameplay.health -= damage;
                    other.userData.gameplay.releasedBy.userData.gameplay.score += damage;
                }
            }
        }
    }

    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);

        // if a craft flies further than z = 50 - release to pool
        if (this.position.z > 50) {
            this.userData.releaseInstance();
        }

        if (this.userData.gameplay.health <= 0) {
            GAME.sounds.play(explosions[Math.floor(Math.random() * explosions.length)]);

            this.userData.gameplay.destroyed = true;
            this.userData.releaseInstance();
        }
    }

    onKeyboardKeyDown(event) {
    }

    onMouseDown(event) {
    }

    spawnParameters() {
        let tmp1 = new THREE.Object3D();
        tmp1.position.set(200 * Math.random() - 100, 0, -100);      // position
        tmp1.lookAt(GAME.player.obj3d.position);                    // rotation
        UTILS.tmpV1.set(0, 0, 10).applyQuaternion(tmp1.quaternion); // linear velocity
        UTILS.tmpV2.set(0, 0, 0);                                   // angular velocity

        tmp1.quaternion.multiply(UTILS.quatDegrees180); // turning 180 degrees so the models face towards the player
        return [tmp1.position, tmp1.quaternion, UTILS.tmpV1.clone(), UTILS.tmpV2.clone()];
    }

    resetGamePlayParams(params) {
        if (!params) { throw new Error("params must be an object") }
        
        params.health = this.health;
        params.destroyed = this.destroyed;
        params.damage = this.damage;

        return params;
    }

    setHealth(health) { this.health = health; }
    getHealth() { return this.health; }

    setDestroyed(destroyed) { this.destroyed = destroyed; }
    getDestroyed() { return this.destroyed; }

    setDamage(damage) { this.damage = damage; }
    getDamage() { return this.damage; }
}