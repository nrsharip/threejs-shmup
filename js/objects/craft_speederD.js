import AbstractCraft from './craft.js'

import * as THREE from 'three';

import * as YUKA from '../lib/yuka/f7503a588747128eaa180fa9379b59419129164c/yuka.module.js';

import * as PHYSICS from '../physics.js'
import * as RAYCASTER from '../raycaster.js';
import * as GAME from '../game.js'
import * as UTILS from '../utils.js'

const impacts_metal = [
    "impactMetal_light_000.wav",
    "impactMetal_light_001.wav",
    "impactMetal_light_002.wav",
    "impactMetal_light_003.wav",
    "impactMetal_light_004.wav",
]

const spawnAndHealth = function() {
    GAME.managers.craft_miner.setSpawnDelta(GAME.managers.craft_miner.getSpawnDelta() / 1.5);
    GAME.managers.craft_speederA.setSpawnDelta(GAME.managers.craft_speederA.getSpawnDelta() / 1.5);
    GAME.managers.craft_speederB.setSpawnDelta(GAME.managers.craft_speederB.getSpawnDelta() / 1.5);
    GAME.managers.craft_speederC.setSpawnDelta(GAME.managers.craft_speederC.getSpawnDelta() / 1.5);

    GAME.managers.craft_miner.setHealth(GAME.managers.craft_miner.getHealth() * 1.5);
    GAME.managers.craft_speederA.setHealth(GAME.managers.craft_speederA.getHealth() * 1.5);
    GAME.managers.craft_speederB.setHealth(GAME.managers.craft_speederB.getHealth() * 1.5);
    GAME.managers.craft_speederC.setHealth(GAME.managers.craft_speederC.getHealth() * 1.5);
}

class CraftSpeederD extends AbstractCraft {
    constructor(filename) { 
        super(filename); 
    
        this.health = 1000;
        this.damage = 40;

        this.score = 0;
        this.experience = 0;

        this.weapons = {
            machinegun: { released: 0, delta: 101 },
            rocket: { released: 0, delta: 1000 },
        }
    }

    update(delta, elapsed) {
        super.update(delta, elapsed);

        document.getElementById("sc").textContent = `SCORE: ${GAME.player.obj3d.userData.gameplay.score}`;
        document.getElementById("hp").textContent = `HEALTH: ${GAME.player.obj3d.userData.gameplay.health}`;
        document.getElementById("xp").textContent = `EXPERIENCE: ${GAME.player.obj3d.userData.gameplay.experience}`;
        if (GAME.player.obj3d.userData.gameplay.destroyed) {
            document.getElementById("hp").style.color = "red";
            document.getElementById("hp").textContent = "GAME OVER";
        } else {
            document.getElementById("hp").style.color = "white";
        }
    }
    
    onCollision(other) {
        super.onCollision(other);

        // speederD with another craft
        if (other.userData.filename.startsWith("craft_")) {
            GAME.sounds.play(impacts_metal[Math.floor(Math.random() * impacts_metal.length)]);

            let damageThis = this.userData.gameplay.damage;
            let damageOther = other.userData.gameplay.damage;

            this.userData.gameplay.health -= damageOther;
            other.userData.gameplay.health -= damageThis;
        }
    }

    onUpdate(delta, elapsed) { 
        super.onUpdate(delta, elapsed);

        if (this.userData.gameplay.destroyed) { return; }

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
            if (this.userData.gameplay.weapons.machinegun.delta > 1) { 
                this.userData.gameplay.weapons.machinegun.delta -= 0.5; 
            } else if (this.userData.gameplay.weapons.rocket.delta > 301) { 
                this.userData.gameplay.weapons.rocket.delta -= 2; 
            }

            if (xp == 50) {
                GAME.sounds.play("powerUp1.wav");
                GAME.managers.craft_speederB.setSpawnEnabled(true);
                GAME.managers.craft_speederC.setSpawnDelta(GAME.managers.craft_speederC.getSpawnDelta() / 1.5);

                GAME.managers.craft_speederC.setHealth(GAME.managers.craft_speederC.getHealth() * 1.1);
            } else if (xp == 100) {
                GAME.sounds.play("powerUp1.wav");
                GAME.managers.craft_speederA.setSpawnEnabled(true);
                GAME.managers.craft_speederB.setSpawnDelta(GAME.managers.craft_speederB.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederC.setSpawnDelta(GAME.managers.craft_speederC.getSpawnDelta() / 1.5);

                GAME.managers.craft_speederB.setHealth(GAME.managers.craft_speederB.getHealth() * 1.1);
                GAME.managers.craft_speederC.setHealth(GAME.managers.craft_speederC.getHealth() * 1.1);
            } else if (xp == 150) {
                GAME.sounds.play("powerUp1.wav");
                GAME.managers.craft_miner.setSpawnEnabled(true);
                GAME.managers.craft_speederA.setSpawnDelta(GAME.managers.craft_speederA.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederB.setSpawnDelta(GAME.managers.craft_speederB.getSpawnDelta() / 1.5);
                GAME.managers.craft_speederC.setSpawnDelta(GAME.managers.craft_speederC.getSpawnDelta() / 1.5);

                GAME.managers.craft_speederA.setHealth(GAME.managers.craft_speederA.getHealth() * 1.1);
                GAME.managers.craft_speederB.setHealth(GAME.managers.craft_speederB.getHealth() * 1.1);
                GAME.managers.craft_speederC.setHealth(GAME.managers.craft_speederC.getHealth() * 1.1);
            } else if (xp == 200) {
                // adding single turret
                this.userData.turretSingle = GAME.managers.turret_single.acquireInstance();
                this.userData.turretSingle.position.x = 0;        // measured in Blender
                this.userData.turretSingle.position.y = 0.686095; // measured in Blender
                this.userData.turretSingle.position.z = 0.411829; // measured in Blender
                this.add(this.userData.turretSingle);

                GAME.sounds.play("powerUp1.wav");
                spawnAndHealth();
            } else if (xp == 300) {
                // removing single turret
                this.remove(this.userData.turretSingle);
                // adding double turret
                this.userData.turretDouble = GAME.managers.turret_double.acquireInstance();
                this.userData.turretDouble.position.x = 0;        // measured in Blender
                this.userData.turretDouble.position.y = 0.686095; // measured in Blender
                this.userData.turretDouble.position.z = 0.411829; // measured in Blender
                this.add(this.userData.turretDouble);

                GAME.sounds.play("powerUp1.wav");
                spawnAndHealth();
            }
        }

        //document.getElementById("info").textContent = `x: ${this.position.x} y: ${this.position.y} z:${this.position.z}`;
    }

    onKeyboardKeyDown(event) {  }

    onMouseDown(event) {
        let shoot = () => {
            let weapons = this.userData.gameplay.weapons;
            
            this.userData.boundingBox.getSize(UTILS.tmpV3);
            let x = this.position.x;
            let y = this.position.y;
            let z = this.position.z;
            let dz = UTILS.tmpV3.z/2 + 1;

            if (GAME.time.elapsed - weapons.machinegun.released > weapons.machinegun.delta) {
                GAME.sounds.play("122103__greatmganga__dshk-01.wav");

                let makeBullet = (px, py, pz, fx, fy, fz) => {
                    UTILS.tmpV2.set(px, py, pz);
                    let obj3d = GAME.managers.ammo_machinegun.addInstanceTo(GAME.graphics.scene, UTILS.tmpV2);
                    obj3d.userData.gameplay.releasedBy = this;
                    PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(fx, fy, fz));
                }

                if (this.userData.gameplay.experience >= 150) {
                    makeBullet(x - 1.5, y, z - dz, -200, 0, -1500);
                    makeBullet(x - 0.75, y, z - dz, -50, 0, -1500);
                    makeBullet(x + 0.75, y, z - dz, 50, 0, -1500);
                    makeBullet(x + 1.5, y, z - dz, 200, 0, -1500);
                } else if (this.userData.gameplay.experience >= 100) {
                    makeBullet(x - 1, y, z - dz, -200, 0, -1500);
                    makeBullet(x, y, z - dz, 0, 0, -1500);
                    makeBullet(x + 1, y, z - dz, 200, 0, -1500);
                } else if (this.userData.gameplay.experience >= 50) {
                    makeBullet(x - 1, y, z - dz, 0, 0, -1500);
                    makeBullet(x + 1, y, z - dz, 0, 0, -1500);
                } else {
                    makeBullet(x, y, z - dz, 0, 0, -1500);
                }

                this.userData.gameplay.weapons.machinegun.released = GAME.time.elapsed;
            }

            if (GAME.time.elapsed - weapons.rocket.released > weapons.rocket.delta) {
                let makeRocket = (px, py, pz, vx, vy, vz) => {
                    GAME.sounds.play("334269__projectsu012__launching-2.wav");

                    let obj3d = GAME.managers.ammo_rocket.addInstanceTo(GAME.graphics.scene);
                    obj3d.userData.gameplay.releasedBy = this;

                    // view-source:https://mugen87.github.io/yuka/examples/steering/seek/
                    let vehicle = obj3d.userData.yuka.vehicle;

                    // *** Vehicle ***
                    // vehicle.mass = 1;
                    // vehicle.maxForce = 100;
                    // *** MovingEntity ***
                    vehicle.velocity.set(vx, vy, vz);
                    vehicle.maxSpeed = 100;
                    // vehicle.updateOrientation = true;
                    // *** GameEntity ***
                    // vehicle.active = true;
                    // vehicle.neighbors;
                    // vehicle.neighborhoodRadius = 1;
                    // vehicle.updateNeighborhood = false;
                    vehicle.position.set(px, py, pz);
                    // vehicle.rotation;
                    // vehicle.scale;
                    vehicle.forward.set(0,0,-1);
                    // vehicle.up;
                    // vehicle.boundingRadius = 0;
                    vehicle.maxTurnRate = Math.PI / 8;
                    // vehicle.canActivateTrigger = true;
                    // vehicle.manager;

                    let frustum = GAME.graphics.camera.frustum;
                    frustum.planes[1].intersectLine(GAME.view.near.line, UTILS.tmpV2); // near line X right side

                    let ranx = 2 * UTILS.tmpV2.x * Math.random() - UTILS.tmpV2.x;
                    let ranz = GAME.view.far.center.z - GAME.view.near.center.z;
                    ranz = ranz * Math.random() + GAME.view.near.center.z;
                    
                    let v = new THREE.Vector3( ranx, 15, ranz * 0.75 );

                    obj3d.userData.gameplay.intermediate = v;

                    const seekBehavior = new YUKA.SeekBehavior( v );
                    vehicle.steering.add( seekBehavior );
                }

                if (this.userData.gameplay.experience >= 300) {
                    makeRocket(x - 0.5, y + 0.8, z + 0.411829 - 1, 0, 0, -40);
                    makeRocket(x + 0.5, y + 0.8, z + 0.411829 - 1, 0, 0, -40);
                } else if (this.userData.gameplay.experience >= 200) {
                    makeRocket(x, y + 0.8, z + 0.411829 - 1, 0, 0, -40);
                }

                this.userData.gameplay.weapons.rocket.released = GAME.time.elapsed;
            }
        }

        switch(event.button) {
            case 0:
                shoot();
                break;
            case 1:
                console.log("MIDDLE MOUSE BUTTON");
                break;
            case 2:
                console.log("RIGHT MOUSE BUTTON");
                break;
            default:
                shoot();
                break;
        }
    }

    resetGamePlayParams(params) {
        super.resetGamePlayParams(params);

        params.score = this.score;
        params.experience = this.experience;

        if (params.weapons) {
            params.weapons.machinegun.released = this.weapons.machinegun.released;
            params.weapons.machinegun.delta = this.weapons.machinegun.delta;

            params.weapons.rocket.released = this.weapons.rocket.released;
            params.weapons.rocket.delta = this.weapons.rocket.delta;
        } else {
            // https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
            // deep copy
            params.weapons = JSON.parse(JSON.stringify(this.weapons));
        }

        return params;
    }

    setScore(score) { this.score = score; }
    getScore() { return this.score; }

    setExperience(experience) { this.experience = experience; }
    getExperience() { return this.experience; }

    getWeapons() { return this.weapons; }
}

const craft_speederD = new CraftSpeederD("craft_speederD.glb");

GAME.managers.craft_speederD = craft_speederD;

export default craft_speederD;