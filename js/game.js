import * as THREE from 'three';
import * as MESH from './mesh.js'

const PHASES = {
    INIT: 1,
    STARTED: 2,
    PAUSED: 3,

    getKey(value) { return Object.keys(this).find(key => this[key] === value) }
}

const state = { 
    _phase: undefined,

    set phase(p) {
        if (Object.values(PHASES).includes(p)) {
            console.log("Game phase: " + PHASES.getKey(p));
            this._phase = p; 
        } else {
            throw new Error("Unknown game phase: " + p + ", known: " + Object.values(PHASES));
        }
    },

    get phase() { return this._phase; }
};

const instances = {
    // https://en.wikipedia.org/wiki/Creational_pattern
    // https://en.wikipedia.org/wiki/Object_pool_pattern

    acquireInstance(filename) {
        if(this[filename].available.length > 0) {
            let obj3d = this[filename].available.pop();
            this[filename].inuse.push(obj3d);
            return obj3d;
        } else {
            models.createInstance(filename);
            return this.acquireInstance(filename);
        }
    },

    releaseInstance(instance) {
        let filename = instance.userData.filename;

        const index = this[filename].inuse.indexOf(instance);
        if (index > -1) { 
            this[filename].inuse.splice(index, 1); 
            this[filename].available.push(instance);
        } else {
            console.log("ERROR: unable to release an instance of: " + filename);
        }
    },

    addInstanceToPool(filename, instance) {
        if (!this[filename]) { this[filename] = { available: [], inuse: [] }; }
        this[filename].available.push(instance);
        return instance;
    },
}

const models = {
    add(filename, model) {
        this[filename] = model;
    },

    // https://threejs.org/docs/#api/en/core/Object3D
    createInstance(filename) { 
        let model = this[filename];
        if (model && (model instanceof THREE.Object3D)) {
            let obj3d = model.clone(true);
            return MESH.centerObject3D(instances.addInstanceToPool(filename, obj3d));
        } 
    },

    createInstances(filename, count) { 
        for (let i = 0; i < count; i++) { this.createInstance(filename); }
    }
}

export { PHASES, state, models, instances }