import AsbtractGameObjectManager from './object.js'
import * as GAME from './game.js'

export default class AsbtractSpawningObjectManager extends AsbtractGameObjectManager {
    constructor(filename) {
        super(filename);

        this.spawn = { 
            enabled: false, 
            lastTime: 0, 
            deltaMillis: 600 
        }
    }

    update(delta, elapsed) {
        if (this.spawn.enabled && (elapsed - this.spawn.lastTime > this.spawn.deltaMillis) ) {
            this.spawn.lastTime = elapsed;

            let position, rotation, linear, angular;
            
            [position, rotation, linear, angular] = this.spawnParameters();
            this.addInstanceTo(GAME.graphics.scene, position, rotation, linear, angular);
        }
    }

    onCollision(other) {
        if (!other || !other.userData) { console.log("ERROR: the object is unrecognizable: " + other); return; }
    }

    onUpdate(delta, elapsed) {
        super.onUpdate(delta, elapsed);
    }

    onKeyboardKeyDown(event) {
    }

    onMouseDown(event) {
    }

    setSpawnEnabled(enabled) { this.spawn.enabled = enabled; }

    setSpawnDelta(delta) { this.spawn.deltaMillis = delta; }

    getSpawnDelta() { return this.spawn.deltaMillis; }

    spawnParameters() { throw new Error("Abstract Method"); }
}