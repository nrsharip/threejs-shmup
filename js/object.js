import * as GAME from './game.js'
import * as PHYSICS from './physics.js'
import * as UTILS from './utils.js'

export default class AsbtractGameObjectManager {
    constructor(filename) {
        this.glbFilename = filename;
        this.mass = 1;
        this.bufferSize = 10;
    }
    
    createInstances(mass, count) {
        this.mass = mass;
        this.bufferSize = count;
        GAME.models.createInstances(this.glbFilename, count);
        for (let obj3d of GAME.instances[this.glbFilename].available) {
            obj3d.userData.manager = this;

            obj3d.userData.onCollision = this.onCollision.bind(obj3d);
            obj3d.userData.onUpdate = this.onUpdate.bind(obj3d);
            obj3d.userData.onKeyboardKeyDown = this.onKeyboardKeyDown.bind(obj3d);
            obj3d.userData.onMouseDown = this.onMouseDown.bind(obj3d);
            obj3d.userData.releaseInstance = this.releaseInstance.bind(obj3d);
            obj3d.userData.gameplay = {};
            this.resetGamePlayParams(obj3d.userData.gameplay);

            obj3d.userData.boundingBox.getSize(UTILS.tmpV1);
            PHYSICS.initObject(obj3d, mass, UTILS.tmpV1, 0.05);
        }
    }

    acquireInstance() {
        let obj3d = GAME.instances.acquireInstance(this.glbFilename);
        if (!obj3d) {
            // no more objects in the pool, allocating new bulk of objects
            this.createInstances(this.mass, this.bufferSize); 
            obj3d = GAME.instances.acquireInstance(this.glbFilename);
        }
        obj3d.userData.timeAcquired = GAME.time.elapsed;
        obj3d.userData.timeElapsed = 0;
        this.resetGamePlayParams(obj3d.userData.gameplay);
        return obj3d;
    }
    
    addInstanceTo(to, position, rotation, linVelocity, angVelocity) {
        let obj3d = this.acquireInstance();

        PHYSICS.clearForces(obj3d);
        PHYSICS.addRigidBody(obj3d);
        
        if (position) { UTILS.tmpV1.set(position.x, position.y, position.z); } else { UTILS.tmpV1.set(0, 0, 0); }
        if (rotation) { UTILS.tmpQuat1.set(rotation.x, rotation.y, rotation.z, rotation.w); } else { UTILS.tmpQuat1.identity(); }
        if (linVelocity) { UTILS.tmpV2.set(linVelocity.x, linVelocity.y, linVelocity.z); } else { UTILS.tmpV2.set(0, 0, 0); }
        if (angVelocity) { UTILS.tmpV3.set(angVelocity.x, angVelocity.y, angVelocity.z); } else { UTILS.tmpV3.set(0, 0, 0); }
    
        // In case dynamics world is OFF
        obj3d.position.x = position.x;
        obj3d.position.y = position.y;
        obj3d.position.z = position.z;
    
        // In case dynamics world is ON
        PHYSICS.makeTranslationAndRotation(obj3d, UTILS.tmpV1, UTILS.tmpQuat1);
        PHYSICS.setLinearAndAngularVelocity(obj3d, UTILS.tmpV2, UTILS.tmpV3);
    
        to.add( obj3d );
        return obj3d;
    }
    
    getInstanceAvailable(index) { return GAME.instances.getAvailable(this.glbFilename, index); }
    
    getInstanceInUse(index) { return GAME.instances.getInUse(this.glbFilename, index); }

    releaseInstance() {
        this.position.set(0,0,123);
        PHYSICS.makeTranslation(this, UTILS.tmpV3.set(0,0,123));
        PHYSICS.removeRigidBody(this);
        GAME.instances.releaseInstance(this); 
    }

    releaseAllInstances() {
        // https://www.freecodecamp.org/news/how-to-clone-an-array-in-javascript-1d3183468f6a/
        let tmpArray = [...GAME.instances[this.glbFilename].inuse];

        let obj3d = undefined;
        while (obj3d = tmpArray.pop()) { obj3d?.userData?.releaseInstance(); }
    }

    resetGamePlayParams() { throw new Error("Abstract Method"); }

    update(delta, elapsed) { throw new Error("Abstract Method"); }

    onCollision(other) { throw new Error("Abstract Method"); }

    onUpdate(delta, elapsed) { 
        this.userData.timeElapsed = elapsed - this.userData.timeAcquired;
    }

    onKeyboardKeyDown(event) { throw new Error("Abstract Method"); }

    onMouseDown(event) { throw new Error("Abstract Method"); }
}