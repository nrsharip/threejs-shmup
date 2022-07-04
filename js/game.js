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

const isntances = {
    add(filename, instance) {
        if (!this[filename]) { this[filename] = []; }
        this[filename].push(instance);
        return instance;
    },
}

const models = {
    add(filename, model) {
        this[filename] = model;
    },

    // https://threejs.org/docs/#api/en/core/Object3D
    getInstanceOf(filename) { 
        let model = this[filename];
        if (model && (model instanceof THREE.Object3D)) {
            let obj3d = model.clone(true);
            return MESH.centerObject3D(isntances.add(filename, obj3d));
        } 
    }
}

export { PHASES, state, models, isntances }