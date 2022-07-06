import Craft from './craft.js'

import * as PHYSICS from '../physics.js'
import * as RAYCASTER from '../raycaster.js';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'
import * as MENU from '../menu.js'

import ammo_machinegun from './ammo_machinegun.js';

class CraftSpeederD extends Craft {
    constructor(filename) { super(filename); }

    update(delta, elapsed) {
        super.update(delta, elapsed);
    }
    
    onCollision(other) {
        // console.log(other);
        // if (other && other.userData) {
        //     if (other.userData?.name == "ground") {
        //         PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(0, 200, 0));
        //     }
        // }
    }

    onUpdate(delta, elapsed) { 
        super.onUpdate(delta, elapsed);
        RAYCASTER.intersects?.forEach((intersect, index, array) => {
            // [ { distance, point, face, faceIndex, object }, ... ]
            let name = intersect.object?.userData?.filename;
            if (name && name == "ground") {
                PHYSICS.makeTranslation(this, intersect.point);
            }
        })

        //MENU.get("info").textContent = `x: ${this.position.x} y: ${this.position.y} z:${this.position.z}`;
    }

    onKeyboardKeyDown(event) {  }

    onMouseDown(event) {
        switch(event.button) {
            case 0:
                GAME.sounds.play("122103__greatmganga__dshk-01.wav");

                this.userData.boundingBox.getSize(UTILS.tmpV1);
                UTILS.tmpV2.set(this.position.x, this.position.y, this.position.z - UTILS.tmpV1.z/2);
                let obj3d = ammo_machinegun.addInstanceTo(GAME.graphics.scene, UTILS.tmpV2);

                PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(0, 0, -1500)); 
                break;
            case 1:
                console.log("MIDDLE MOUSE BUTTON");
                break;
            case 2:
                console.log("RIGHT MOUSE BUTTON");
                break;
        }
    }
}

const craft_speederD = new CraftSpeederD("craft_speederD.glb");

GAME.managers.push(craft_speederD);

export default craft_speederD;