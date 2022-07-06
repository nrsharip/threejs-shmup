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
    
    setSpawnEnabled(enabled) { this.spawn.enabled = enabled; }
    setSpawnDelta(delta) { this.spawn.deltaMillis = delta; }

    update(delta, elapsed) {
        if (this.spawn.enabled && (elapsed - this.spawn.lastTime > this.spawn.deltaMillis) ) {
            this.spawn.lastTime = elapsed;

            let position, rotation, linear, angular;
            
            [position, rotation, linear, angular] = this.spawnParameters();
            this.addInstanceTo(GAME.graphics.scene, position, rotation, linear, angular);
        }
    }

    spawnParameters() { throw new Error("Abstract Method"); }
}