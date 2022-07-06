import AsbtractSpawningObjectManager from '../spawning.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

class CraftSpeederB extends AsbtractSpawningObjectManager {
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

    spawnParameters() {
        let tmp1 = new THREE.Object3D();
        tmp1.position.set(90 * Math.random() - 45, 0, -80);         // position
        tmp1.lookAt(GAME.player.obj3d.position);                    // rotation
        UTILS.tmpV1.set(0, 0, 10).applyQuaternion(tmp1.quaternion); // linear velocity
        UTILS.tmpV2.set(0, 0, 0);                                   // angular velocity

        tmp1.quaternion.multiply(UTILS.quatDegrees180); // turning 180 degrees so the models face towards the player
        return [tmp1.position, tmp1.quaternion, UTILS.tmpV1.clone(), UTILS.tmpV2.clone()];
    }
}

const craft_speederB = new CraftSpeederB("craft_speederB.glb");

GAME.managers.push(craft_speederB);

export default craft_speederB;