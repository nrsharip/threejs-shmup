import AbstractCraft from './craft.js'

import * as PHYSICS from '../physics.js'
import * as RAYCASTER from '../raycaster.js';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'
import * as MENU from '../menu.js'

import ammo_machinegun from './ammo_machinegun.js';

class CraftSpeederD extends AbstractCraft {
    constructor(filename) { super(filename); }

    update(delta, elapsed) {
        super.update(delta, elapsed);
    }
    
    onCollision(other) {
        super.onCollision(other);
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

        let sc = this.userData.gameplay.score;
        let xp = this.userData.gameplay.experience;

        // level up?
        if (Math.floor(sc / 100) > xp) {
            this.userData.gameplay.experience = xp = Math.floor(sc / 100);
            // reducing the delta for bullet release (up to 1 millisecond - that's maximum)
            if (this.userData.gameplay.deltaMillis > 1) { this.userData.gameplay.deltaMillis -= 0.5; }

            if (xp == 50) {
                GAME.managers.craft_speederB.setSpawnEnabled(true);
                GAME.managers.craft_speederC.setSpawnDelta(GAME.managers.craft_speederC.getSpawnDelta() / 1.5);
            } else if (xp == 100) {
                GAME.managers.craft_speederA.setSpawnEnabled(true);
                GAME.managers.craft_speederB.setSpawnDelta(GAME.managers.craft_speederB.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederC.setSpawnDelta(GAME.managers.craft_speederC.getSpawnDelta() / 1.5);
            } else if (xp == 150) {
                GAME.managers.craft_miner.setSpawnEnabled(true);
                GAME.managers.craft_speederA.setSpawnDelta(GAME.managers.craft_speederA.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederB.setSpawnDelta(GAME.managers.craft_speederB.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederC.setSpawnDelta(GAME.managers.craft_speederC.getSpawnDelta() / 1.5);
            } else if (xp == 200) {
                GAME.managers.craft_miner.setSpawnDelta(GAME.managers.craft_miner.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederA.setSpawnDelta(GAME.managers.craft_speederA.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederB.setSpawnDelta(GAME.managers.craft_speederB.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederC.setSpawnDelta(GAME.managers.craft_speederC.getSpawnDelta() / 1.5);
            } else if (xp == 300) {
                GAME.managers.craft_miner.setSpawnDelta(GAME.managers.craft_miner.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederA.setSpawnDelta(GAME.managers.craft_speederA.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederB.setSpawnDelta(GAME.managers.craft_speederB.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederC.setSpawnDelta(GAME.managers.craft_speederC.getSpawnDelta() / 1.5);
            }
        }

        //MENU.get("info").textContent = `x: ${this.position.x} y: ${this.position.y} z:${this.position.z}`;
        MENU.get("sc").textContent = `SCORE: ${this.userData.gameplay.score}`;
        MENU.get("hp").textContent = `HEALTH: ${this.userData.gameplay.health}`;
        MENU.get("xp").textContent = `EXPERIENCE: ${this.userData.gameplay.experience}`;
    }

    onKeyboardKeyDown(event) {  }

    onMouseDown(event) {
        switch(event.button) {
            case 0:
                if (GAME.time.elapsed - this.userData.gameplay.lastReleased > this.userData.gameplay.deltaMillis) {
                    GAME.sounds.play("122103__greatmganga__dshk-01.wav");

                    this.userData.boundingBox.getSize(UTILS.tmpV3);

                    let x = this.position.x;
                    let y = this.position.y;
                    let z = this.position.z - UTILS.tmpV3.z/2 - 1;

                    function makeBullet(x, y, z, x1, y1, z1, obj) {
                        UTILS.tmpV2.set(x, y, z);
                        let obj3d = ammo_machinegun.addInstanceTo(GAME.graphics.scene, UTILS.tmpV2);
                        obj3d.userData.gameplay.releasedBy = obj;
                        PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(x1, y1, z1));                         
                    }

                    if (this.userData.gameplay.experience > 100) {
                        makeBullet(x - 1, y, z, -200, 0, -1500, this);
                        makeBullet(x, y, z, 0, 0, -1500, this);
                        makeBullet(x + 1, y, z, 200, 0, -1500, this);
                    } else if (this.userData.gameplay.experience > 50) {
                        makeBullet(x - 1, y, z, 0, 0, -1500, this);
                        makeBullet(x + 1, y, z, 0, 0, -1500, this);
                    } else {
                        makeBullet(x, y, z, 0, 0, -1500, this);
                    }

                    this.userData.gameplay.lastReleased = GAME.time.elapsed;
                }
                break;
            case 1:
                console.log("MIDDLE MOUSE BUTTON");
                break;
            case 2:
                console.log("RIGHT MOUSE BUTTON");
                break;
        }
    }

    resetGamePlayParams(params) {
        super.resetGamePlayParams(params);

        params.health = 1000;
        params.score = 0;
        params.experience = 0;

        // bullet releases
        params.lastReleased = 0;
        params.deltaMillis = 101;

        return params;
    }
}

const craft_speederD = new CraftSpeederD("craft_speederD.glb");

GAME.managers.craft_speederD = craft_speederD;

export default craft_speederD;