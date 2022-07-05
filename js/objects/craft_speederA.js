import AsbtractGameObjectManager from '../object.js'

import * as THREE from 'three';
import * as PHYSICS from '../physics.js'
import * as RAYCASTER from '../raycaster.js';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'
import * as MENU from '../menu.js'

import ammo_machinegun from './ammo_machinegun.js';

class CraftSpeederA extends AsbtractGameObjectManager {
    constructor(filename) {
        super(filename);

        this.spawn = { lastTime: 0, deltaMillis: 600 }
    }

    update(delta, elapsed) {
        //console.log(this.spawn);
        if (elapsed - this.spawn.lastTime > this.spawn.deltaMillis ) {
            this.spawn.lastTime = elapsed;

            // tmp2.quaternion rotates by 180 degrees
            let PIradians = new THREE.Object3D();
            PIradians.position.set(0,0,0);
            PIradians.lookAt(0,0,-10); 

            let tmp1 = new THREE.Object3D();
            tmp1.position.set(90 * Math.random() - 45, 0, -80);         // position
            tmp1.lookAt(GAME.player.obj3d.position);                    // rotation
            UTILS.tmpV1.set(0, 0, 10).applyQuaternion(tmp1.quaternion); // linear velocity
            UTILS.tmpV2.set(0, 0, 0);                                   // angular velocity

            tmp1.quaternion.multiply(PIradians.quaternion); // turning 180 degrees so the models face towards the player
            this.addInstanceTo(GAME.graphics.scene, tmp1.position, tmp1.quaternion, UTILS.tmpV1.clone(), UTILS.tmpV2.clone());
        }
    }

    onCollision(other) {
    }

    onUpdate(delta, elapsed) {

    }

    onKeyboardKeyDown(event) {
    }

    onMouseDown(event) {
    }
}

const craft_speederA = new CraftSpeederA("craft_speederA.glb");

GAME.managers.push(craft_speederA);

export default craft_speederA;