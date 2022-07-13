import AsbtractSpawningObjectManager from '../spawning.js'

import * as THREE from 'three';
import * as GAME from '../game.js'
import * as PHYSICS from '../physics.js'
import * as RAYCASTER from '../raycaster.js';
import * as UTILS from '../utils.js'

const impacts_tin = [
    "impactTin_medium_000.wav",
    "impactTin_medium_001.wav",
    "impactTin_medium_002.wav",
    "impactTin_medium_003.wav",
    "impactTin_medium_004.wav",
]

const explosions = [
    "587186__derplayer__explosion-00.wav", // https://freesound.org/people/derplayer/sounds/587186/
    "587185__derplayer__explosion-01.wav", // https://freesound.org/people/derplayer/sounds/587185/
    "587184__derplayer__explosion-02.wav", // https://freesound.org/people/derplayer/sounds/587184/
    "587183__derplayer__explosion-03.wav", // https://freesound.org/people/derplayer/sounds/587183/
    "587190__derplayer__explosion-04.wav", // https://freesound.org/people/derplayer/sounds/587190/
    "587189__derplayer__explosion-05.wav", // https://freesound.org/people/derplayer/sounds/587190/
]

const tmpV3$1 = new THREE.Vector3();
const tmpV3$2 = new THREE.Vector3();
const tmpV3$3 = new THREE.Vector3();
const tmpV3$4 = new THREE.Vector3();

export default class AbstractCraft extends AsbtractSpawningObjectManager {
    constructor(filename) { 
        super(filename); 
    
        this.health = 100;
        this.destroyed = false;
        this.damage = 10;

        this.weapons = {
            machinegun: { released: 0, delta: 1000 },
            rocket: { released: 0, delta: 1000 },
        }
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
                    if (other.userData.gameplay.releasedBy === GAME.player.obj3d) {
                        other.userData.gameplay.releasedBy.userData.gameplay.score += damage;
                    }
                }
            }
        }
    }

    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);

        if (this.userData.gameplay.destroyed) { return; }

        // if health drops down lower than 0 - release to pool
        if (this.userData.gameplay.health <= 0) {
            GAME.sounds.play(explosions[Math.floor(Math.random() * explosions.length)]);

            this.userData.gameplay.destroyed = true;
            this.userData.releaseInstance();
            return;
        }

        // if a craft flies further than z = 50 - release to pool
        if (this.position.z > 50) {
            this.userData.releaseInstance();
            return;
        }

        const weapons = this.userData.gameplay.weapons;
        if (!GAME.player.obj3d.userData.gameplay.destroyed 
            && (this !== GAME.player.obj3d) 
            && (GAME.time.elapsed - weapons.machinegun.released > weapons.machinegun.delta)) {

            PHYSICS.getLinearVelocity(this, tmpV3$3);
            tmpV3$3.normalize();            // direction the craft is moving in
            tmpV3$4.copy(tmpV3$3).negate(); // direction opposite to the craft is moving in to

            RAYCASTER.raycaster2.near = 0.01
            RAYCASTER.raycaster2.far = 1000

            let crafts = [
                ...GAME.instances["craft_miner.glb"].inuse,
                ...GAME.instances["craft_speederA.glb"].inuse,
                ...GAME.instances["craft_speederB.glb"].inuse,
                ...GAME.instances["craft_speederC.glb"].inuse,
                ...GAME.instances["craft_speederD.glb"].inuse
            ]

            let friendlyFire = false;
            for (let craft of crafts) {
                if (craft !== this && craft !== GAME.player.obj3d) {
                    RAYCASTER.raycaster2.set(craft.position, tmpV3$4);
                    RAYCASTER.intersects2.length = 0;
                    RAYCASTER.raycaster2.intersectObject(this, true, RAYCASTER.intersects2);
                    if (RAYCASTER.intersects2.length > 0) {
                        friendlyFire = true;
                        break;
                    }
                }
            }

            let x = this.position.x;
            let y = this.position.y;
            let z = this.position.z;
            tmpV3$2.set(x, y, z).add(tmpV3$3.clone().multiplyScalar(5));

            // UNCOMMENT FOR A RAYCAST DEBUG LINE: creates a blue LineBasicMaterial
            // const points = [];
            // points.push( tmpV3$2.clone() );
            // points.push( tmpV3$2.clone().add(tmpV3$3.clone().multiplyScalar(100)) );
            // const geometry = new THREE.BufferGeometry().setFromPoints( points );
            // const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
            // if (this.debugLine) { 
            //     GAME.graphics.scene.remove(this.debugLine);
            // }
            // this.debugLine = new THREE.Line( geometry, material );
            // GAME.graphics.scene.add( this.debugLine );

            RAYCASTER.raycaster2.set(tmpV3$2, tmpV3$3);
            RAYCASTER.intersects2.length = 0;
            RAYCASTER.raycaster2.intersectObject(GAME.player.obj3d, true, RAYCASTER.intersects2)

            // THIS GIVES A SIGNIFICANT PERFOMANCE OVERHEAD
            // RAYCASTER.raycaster2.intersectObjects(crafts, true, RAYCASTER.intersects2)
            // UNCOMMENT FOR A RAYCAST INTERSECTIONS:
            // RAYCASTER.intersects2?.forEach((intersect, index, array) => {
            //     // [ { distance, point, face, faceIndex, object }, ... ]
            //     let name = intersect.object?.name;
            //     console.log(index, name, intersect);
            // })
            // if (RAYCASTER.intersects2?.[0]?.object?.name.startsWith("Mesh_craft_speederD")) { ... }

            if (!friendlyFire && RAYCASTER.intersects2.length > 0) {
                GAME.sounds.play("122103__greatmganga__dshk-01.wav");

                let obj3d = GAME.managers.ammo_machinegun.addInstanceTo(GAME.graphics.scene, tmpV3$2, this.quaternion);
                obj3d.userData.gameplay.releasedBy = this;
    
                // central force
                PHYSICS.applyCentralForce(obj3d, tmpV3$3.multiplyScalar(1500));

                weapons.machinegun.released = GAME.time.elapsed;
            }
        }
    }

    onKeyboardKeyDown(event) {
    }

    onMouseDown(event) {
    }

    spawnParameters() {
        let frustum = GAME.graphics.camera.frustum;
        frustum.planes[0].intersectLine(GAME.view.far.line, tmpV3$1); // left side
        frustum.planes[1].intersectLine(GAME.view.far.line, tmpV3$2); // right side

        let tmp1 = new THREE.Object3D();
        // position
        tmp1.position.set(2 * tmpV3$2.x * Math.random() - tmpV3$2.x, 0, GAME.view.far.center.z);
        // rotation
        tmp1.lookAt(GAME.player.obj3d.position);
        // linear velocity
        tmpV3$1.set(0, 0, 10).applyQuaternion(tmp1.quaternion);
        // angular velocity
        tmpV3$2.set(0, 0, 0);

        tmp1.quaternion.multiply(UTILS.quatDegrees180); // turning 180 degrees so the models face towards the player
        return [tmp1.position, tmp1.quaternion, tmpV3$1.clone(), tmpV3$2.clone()];
    }

    resetGamePlayParams(params) {
        if (!params) { throw new Error("params must be an object") }
        
        params.health = this.health;
        params.destroyed = this.destroyed;
        params.damage = this.damage;

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

    setHealth(health) { this.health = health; }
    getHealth() { return this.health; }

    setDestroyed(destroyed) { this.destroyed = destroyed; }
    getDestroyed() { return this.destroyed; }

    setDamage(damage) { this.damage = damage; }
    getDamage() { return this.damage; }

    getWeapons() { return this.weapons; }
}