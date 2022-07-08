import AbstractAmmo from './ammo.js'

import * as YUKA from '../lib/yuka/f7503a588747128eaa180fa9379b59419129164c/yuka.module.js';

import * as GAME from '../game.js'

class AmmoRocket extends AbstractAmmo {
    constructor(filename) { 
        super(filename); 
    
        this.damage = 400;
        this.radius = 5;
    }
    
    addInstanceTo(to, position, rotation, linVelocity, angVelocity) {
        let obj3d = super.addInstanceTo(to, position, rotation, linVelocity, angVelocity);

        GAME.yuka.entityManager.add( obj3d.userData.yuka.vehicle );
        //console.log("added: ", this.glbFilename, obj3d.userData.yuka.vehicle.uuid);

        return obj3d;
    }

    releaseInstance() {
        super.releaseInstance();

        this.userData.yuka.vehicle.steering.clear();
        GAME.yuka.entityManager.remove(this.userData.yuka.vehicle);
        //console.log("removed: ", this.userData.filename, this.userData.yuka.vehicle.uuid);
    }

    update(delta, elapsed) { 
        super.update(delta, elapsed);
    }

    onCollision(other) {
        if (other.userData.filename.startsWith("craft_")) {
            let radius2 = this.userData.gameplay.radius ** 2;
            // looking for the enemies in radius of explosion
            let enemies = [
                ...GAME.instances["craft_miner.glb"].inuse,
                ...GAME.instances["craft_speederA.glb"].inuse,
                ...GAME.instances["craft_speederB.glb"].inuse,
                ...GAME.instances["craft_speederC.glb"].inuse
            ]
            let hits = enemies.filter((enemy) => { 
                return this.position.distanceToSquared(enemy.position) < radius2; 
            });

            let damage = this.userData.gameplay.damage;
            for (let hit of hits) {
                // avoiding self-inflicted damage
                if (hit !== this.userData.gameplay.releasedBy) {
                    hit.userData.gameplay.health -= damage;
                    this.userData.gameplay.releasedBy.userData.gameplay.score += damage;
                }
            }

            this.userData.releaseInstance();
        }
    }

    onUpdate(delta, elapsed) { 
        super.onUpdate(delta, elapsed);

        let intermediate = this.userData.gameplay.intermediate;
        let proximity2 = 9;
        if (intermediate && (this.position.distanceToSquared(intermediate) < proximity2) ) {
            this.userData.gameplay.intermediate = undefined;
            GAME.sounds.play("580751__marklaukkanen__fireworks-whistle-whine.wav");
            
            this.userData.yuka.vehicle.steering.clear();
            
            // looking for the closest enemy to target
            let enemies = [
                ...GAME.instances["craft_miner.glb"].inuse,
                ...GAME.instances["craft_speederA.glb"].inuse,
                ...GAME.instances["craft_speederB.glb"].inuse,
                ...GAME.instances["craft_speederC.glb"].inuse
            ]
            enemies.sort((a, b) => { 
                return this.position.distanceToSquared(a.position) - this.position.distanceToSquared(b.position);
            });

            const seekBehavior = new YUKA.SeekBehavior( enemies[0].position );
            this.userData.yuka.vehicle.steering.add( seekBehavior );
        }

        // if a rocket exists more than 20 sec - remove it
        if (this.userData.timeElapsed > 20000) {
            this.userData.releaseInstance();
        }
    }

    onKeyboardKeyDown(event) {  }

    onMouseDown(event) {  }

    resetGamePlayParams(params) {
        super.resetGamePlayParams(params);

        params.radius = this.radius

        return params;
    }

    setRadius(radius) { this.radius = radius; }
    getRadius() { return this.radius; }
} 

const ammo_rocket = new AmmoRocket("ammo_rocket.glb");

GAME.managers.ammo_rocket = ammo_rocket;

export default ammo_rocket;