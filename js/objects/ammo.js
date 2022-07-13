import AsbtractGameObjectManager from '../object.js'


export default class AbstractAmmo extends AsbtractGameObjectManager {
    constructor(filename) { 
        super(filename); 
    
        this.damage = 20;
        this.releasedBy = undefined;
    }

    update(delta, elapsed) {
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

    resetGamePlayParams(params) {
        if (!params) { throw new Error("params must be an object") }

        params.damage = this.damage;
        params.releasedBy = this.releasedBy;

        if (params.targetsHit && params.targetsHit instanceof Array) {
            params.targetsHit.length = 0;
        } else {
            params.targetsHit = [];
        }

        return params;
    }

    setDamage(damage) { this.damage = damage; }
    getDamage() { return this.damage; }

    setReleasedBy(releasedBy) { this.releasedBy = releasedBy; }
    getReleasedBy() { return this.releasedBy; }
}