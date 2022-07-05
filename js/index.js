"use strict"

import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

import * as RAYCASTER from './raycaster.js';
import * as FILES from './files.js';
import * as GAME from './game.js'
import * as MESH from './mesh.js'
import * as PHYSICS from './physics.js'
import * as KEYBOARD from './keyboard.js'
import * as MENU from './menu.js'
import * as GLTFS from './gltfs.js'
import * as SOUNDS from './sounds.js'
import * as GRAPHICS from './graphics.js'
import * as PRIMITIVES from './primitives.js'
import * as UTILS from './utils.js'
import WebGLCheck from './lib/WebGL.js';

import ammo_machinegun from './objects/ammo_machinegun.js';
import craft_speederD from './objects/craft_speederD.js';

// see https://threejs.org/docs/index.html#manual/en/introduction/WebGL-compatibility-check
if ( !WebGLCheck.isWebGLAvailable() ) {
    const warning = WebGLCheck.getWebGLErrorMessage();
    document.body.appendChild( warning );
    throw new Error(warning.textContent);
}

GAME.state.phase = GAME.PHASES.INIT;

// GRAPHICS INIT
const renderer = GAME.graphics.renderer = GRAPHICS.setupRenderer('#mainCanvas');
const camera = GAME.graphics.camera = GRAPHICS.setupPerspectiveCamera('#mainCanvas', UTILS.tmpV1.set(0, 30, 20), UTILS.tmpV2.set(0, -15, -40));
const scene = GAME.graphics.scene = GRAPHICS.setupScene('#96b0bc'); // https://encycolorpedia.com/96b0bc
const clock = GAME.graphics.clock = new THREE.Clock();
//const orbitControls = GAME.graphics.orbitControls = GRAPHICS.setupOrbitControls(camera, renderer);

window.GAME = GAME;

Ammo().then(function ( AmmoLib ) {
    Ammo = AmmoLib;

    PHYSICS.init();
    PHYSICS.dynamicsWorld.setGravity( new Ammo.btVector3( 0, 0, 0 ) );

    // SCENE OBJECTS
    const dirLight = GRAPHICS.setupDirLight();
    scene.add(dirLight);
    
    // GROUND
    let w = 100, h = 0.1, d = 30;
    const ground = PRIMITIVES.makeGround(w, h, d);
    ground["userData"].filename = "ground";
    ground.position.y -= 0.05;
    // PHYSICS.initObject(ground, 0, UTILS.tmpV1.set(w, h, d), 0.05);
    // PHYSICS.addRigidBody(ground);
    scene.add(ground);

    GAME.state.phase = GAME.PHASES.LOAD_STARTED;
})

GAME.state.onPhaseChange = function(phase) {
    switch (phase) {
        case GAME.PHASES.INIT:
            break;
        case GAME.PHASES.LOAD_STARTED:
            loadAssets();
            requestAnimationFrame( render );
            break;
        case GAME.PHASES.LOAD_COMPLETED:
            loadCompleted();
            break;
        case GAME.PHASES.GAME_STARTED:
            break;
        case GAME.PHASES.GAME_PAUSED:
            break;
    }
}

function loadAssets() {
    let processes = 2;
    // Loading GLTFs
    GLTFS.queueFileNames([ FILES.craft, FILES.ammo ], (function() {
        let loaded = 0;
        let total = FILES.craft.filenames.length + FILES.ammo.filenames.length;
        return function(filename, gltf) {
            GAME.models.add(filename, gltf.scene);
            // All files loaded?
            if (++loaded == total) { if (!--processes) { GAME.state.phase = GAME.PHASES.LOAD_COMPLETED; }; }
        }
    })());
    // Loading Sounds
    SOUNDS.queueFileNames([ FILES.sounds ], (function() {
        let loaded = 0;
        let total = FILES.sounds.filenames.length;
        return function(filename, buffer) {
            GAME.audioBuffers.add(filename, buffer);
            // All files loaded?
            if (++loaded == total) { if (!--processes) { GAME.state.phase = GAME.PHASES.LOAD_COMPLETED; }; }
        }
    })());
}

function loadCompleted() {
    ammo_machinegun.createInstances(1, 1000);
    craft_speederD.createInstances(200, 1);

    const gridCell = new Vector2(0, 0);
    [ammo_machinegun, craft_speederD].forEach((obj) => {
        let obj3d = obj.getInstanceAvailable(0);
        UTILS.tmpV1.set(gridCell.x * 3, obj3d.userData.center.y + 0.05 + 0.1, gridCell.y * 3);
        obj3d = obj.addInstanceTo(scene, UTILS.tmpV1);
        UTILS.spiralGetNext(gridCell);
    });

    GAME.audioBuffers.spread("122103__greatmganga__dshk-01.wav", 200);
}

function render(timeElapsed) {
    requestAnimationFrame( render );

    const timeDelta = clock.getDelta();

    RAYCASTER.getIntersects(scene.children, RAYCASTER.pointer, camera);

    // let available = GAME.instances["ammo_machinegun.glb"]?.available.length;
    // let inuse = GAME.instances["ammo_machinegun.glb"]?.inuse.length;
    // MENU.get("info").textContent = `inuse: ${inuse} available: ${available}`;

    switch (GAME.state.phase) {
        case GAME.PHASES.INIT:
        case GAME.PHASES.LOAD_STARTED:
        case GAME.PHASES.LOAD_COMPLETED:
        case GAME.PHASES.GAME_PAUSED:
            // for (let gltf of Object.values(GLTFS.loaded)) {
            //     gltf.scene.rotation.y += timeDelta * (Math.PI / 2);
            // }
            break;
        case GAME.PHASES.GAME_STARTED:
            PHYSICS.update(timeDelta);

            for (let value of Object.values(GAME.instances)) {
                if (value.inuse) {
                    for (let obj3d of value.inuse) {
                        obj3d.userData.update(timeDelta, timeElapsed);
                    }
                }
            }

            break;
    }

    // see https://threejs.org/manual/#en/responsive
    if (UTILS.resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render( scene, camera );
};

MENU.addEventListener("startButton", "click", function() {
    document.getElementById("mainMenu").style.display = "none";

    GAME.state.phase = GAME.PHASES.GAME_STARTED;
});

MENU.addEventListener("menuMobile", "click", function() {
    processPause();
});

KEYBOARD.addEventListener("keydown", function(event) {
    //console.log(event);
    switch (event.code) {
        case 'Escape':
            processPause();
            break;
    }

    switch (GAME.state.phase) {
        case GAME.PHASES.INIT:
            break;
        case GAME.PHASES.LOAD_STARTED:
            break;
        case GAME.PHASES.LOAD_COMPLETED:
            break;
        case GAME.PHASES.GAME_STARTED:
            for (let value of Object.values(GAME.instances)) {
                if (value.inuse) {
                    for (let obj3d of value.inuse) {
                        obj3d.userData.onKeyboardKeyDown(event);
                    }
                }
            }
            break;
        case GAME.PHASES.GAME_PAUSED:
            break;
    }
})

function processPause() {
    switch (GAME.state.phase) {
        case GAME.PHASES.INIT:
            break;
        case GAME.PHASES.LOAD_STARTED:
            break;
        case GAME.PHASES.LOAD_COMPLETED:
            break;
        case GAME.PHASES.GAME_STARTED:
            MENU.get("startButton").textContent = "Resume";
            document.getElementById("mainMenu").style.display = "block";

            GAME.state.phase = GAME.PHASES.GAME_PAUSED;
            break;
        case GAME.PHASES.GAME_PAUSED:
            document.getElementById("mainMenu").style.display = "none";

            GAME.state.phase = GAME.PHASES.GAME_STARTED;
            break;
    }
}

// https://threejs.org/docs/#api/en/core/Raycaster
window.addEventListener( 'pointermove', onPointerMove );
function onPointerMove( event ) {
    // calculate pointer position in normalized device coordinates (-1 to +1) for both components
    RAYCASTER.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    RAYCASTER.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// https://stackoverflow.com/questions/15505272/javascript-while-mousedown
// Assign events
document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
// Also clear the interval when user leaves the window with mouse
document.addEventListener("mouseout", mouseup);

var mouseDownID = -1;  //Global ID of mouse down interval
function mousedown(event) {
    if(mouseDownID == -1)  { //Prevent multimple loops!
        mouseDownID = setInterval(whileMouseDown, 50 /*execute every 100ms*/, event);
    }
}

function mouseup(event) {
    if(mouseDownID!=-1) {  //Only stop if exists
        clearInterval(mouseDownID);
        mouseDownID=-1;
    }
}

function whileMouseDown(event) {
    switch (GAME.state.phase) {
        case GAME.PHASES.INIT:
            break;
        case GAME.PHASES.LOAD_STARTED:
            break;
        case GAME.PHASES.LOAD_COMPLETED:
            break;
        case GAME.PHASES.GAME_STARTED:
            for (let value of Object.values(GAME.instances)) {
                if (value.inuse) {
                    for (let obj3d of value.inuse) {
                        obj3d.userData.onMouseDown(event);
                    }
                }
            }
            break;
        case GAME.PHASES.GAME_PAUSED:
            break;
    }
}

// // HELPERS
// // see https://threejs.org/manual/#en/lights
// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
// scene.add(dirLightHelper);
// // see https://threejs.org/manual/#en/shadows
// const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// scene.add(cameraHelper);