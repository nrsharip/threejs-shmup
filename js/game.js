import * as THREE from 'three';
import * as MESH from './mesh.js'

const graphics = {
    renderer: undefined,
    camera: undefined,
    scene: undefined,
    clock: undefined,
    orbitControls: undefined,
}

const PHASES = {
    INIT: 1,
    LOAD_STARTED: 2,
    LOAD_COMPLETED: 3,
    GAME_STARTED: 4,
    GAME_PAUSED: 5,
    GAME_RESUMED: 6,

    getKey(value) { return Object.keys(this).find(key => this[key] === value) }
}

const state = { 
    _phase: undefined,

    set phase(p) {
        if (Object.values(PHASES).includes(p)) {
            console.log("Game phase: " + PHASES.getKey(p));
            this._phase = p;
            this?.onPhaseChange?.(p);
        } else {
            throw new Error("Unknown game phase: " + p + ", known: " + Object.values(PHASES));
        }
    },

    get phase() { return this._phase; },

    onPhaseChange: undefined,
};

const instances = {
    // https://en.wikipedia.org/wiki/Creational_pattern
    // https://en.wikipedia.org/wiki/Object_pool_pattern

    acquireInstance(filename) {
        if(this[filename].available.length > 0) {
            let obj3d = this[filename].available.pop();
            this[filename].inuse.push(obj3d);
            return obj3d;
        } 
        // else {
        //     models.createInstance(filename);
        //     return this.acquireInstance(filename);
        // }
        return undefined;
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

    getAvailable(filename, index) { return this?.[filename]?.available?.[index]; },
    getInUse(filename, index) { return this?.[filename]?.inuse?.[index]; }
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

// https://threejs.org/docs/#api/en/audio/Audio
// create an AudioListener and add it to the camera
const audioListener = new THREE.AudioListener();
const sounds = {
    play(filename) {
        // see also: https://stackoverflow.com/questions/35323062/detect-sound-is-ended-in-three-positionalaudio
        for (let sound of sounds[filename].array) {
            if (!sound.isPlaying) { 
                sound.play(); 
                break; 
            }
        }
    }
}

const audioBuffers = {
    add(filename, buffer) {
        this[filename] = buffer;
    },

    spread(filename, count) {
        sounds[filename] = { array: [], count: 0 } ;
        
        for (let i = 0; i < count; sounds[filename].array.push(new THREE.PositionalAudio( audioListener )), i++);

        for (let sound of sounds[filename].array) {
            sound.setBuffer( this[filename] );
            sound.setLoop( false );
            sound.setVolume( 0.05 );
        }
    }
}

const managers = {
    releaseAllInstances() {
        for (let manager of Object.values(this)) { 
            if (manager.releaseAllInstances) { 
                manager.releaseAllInstances(); 
            }
        }
    }
};

const view = {
    far: { line: undefined, center: undefined },
    near: { line: undefined, center: undefined },

    init(nz, fz) {
        this.far.line = new THREE.Line3(new THREE.Vector3(-1000, 0, fz), new THREE.Vector3(1000, 0, fz));
        this.far.center = this.far.line.getCenter(new THREE.Vector3());
        this.near.line = new THREE.Line3(new THREE.Vector3(-1000, 0, nz), new THREE.Vector3(1000, 0, nz));
        this.near.center = this.far.line.getCenter(new THREE.Vector3());
    }
}

const player = {};
const time = { delta: 0, elapsed: 0 };

const yuka = {}

export { graphics, PHASES, state, models, instances, audioListener, audioBuffers, sounds, managers, view, player, time, yuka }