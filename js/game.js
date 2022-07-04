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

const models = {
    add(filename, model) {
        this[filename] = model;
    },

    // https://threejs.org/docs/#api/en/core/Object3D
    getInstanceOf(filename) { 
        let model = this[filename];
        if (model && (model instanceof THREE.Object3D)) {
            return MESH.centerObject3D(model.clone(true));
        } 
    }
}

export { PHASES, state, models }