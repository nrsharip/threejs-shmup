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

import * as ammo_machinegun from './objects/ammo_machinegun.js';
import * as craft_speederD from './objects/craft_speederD.js';

// see https://threejs.org/docs/index.html#manual/en/introduction/WebGL-compatibility-check
if ( !WebGLCheck.isWebGLAvailable() ) {
    const warning = WebGLCheck.getWebGLErrorMessage();
    document.body.appendChild( warning );
    throw new Error(warning.textContent);
}

window.GAME = GAME;
GAME.state.phase = GAME.PHASES.INIT;

const clock = new THREE.Clock();

// GRAPHICS INIT
const renderer = GRAPHICS.setupRenderer('#mainCanvas');
const camera = GRAPHICS.setupPerspectiveCamera('#mainCanvas', new Vector3(0, 30, 20), new Vector3(0, 0, 0));
const scene = GRAPHICS.setupScene('#96b0bc'); // https://encycolorpedia.com/96b0bc
//const orbitControls = GRAPHICS.setupOrbitControls(camera, renderer);

Ammo().then(function ( AmmoLib ) {
    Ammo = AmmoLib;

    PHYSICS.init();
    PHYSICS.dynamicsWorld.setGravity( new Ammo.btVector3( 0, 0, 0 ) );

    // SCENE OBJECTS
    const dirLight = GRAPHICS.setupDirLight();
    scene.add(dirLight);
    
    // GROUND
    let w = 60, h = 0.1, d = 15;
    const ground = PRIMITIVES.makeGround(w, h, d);
    ground["userData"].filename = "ground";
    PHYSICS.initObject(ground, 0, UTILS.tmpV1.set(w, h, d), 0.05);
    PHYSICS.addRigidBody(ground);
    scene.add(ground);

    // Loading GLTFs
    const gridCell = new Vector2(0, 0);
    GLTFS.queueFileNames([ FILES.craft, FILES.ammo ], (function() {
        let loaded = 0;
        let total = FILES.craft.filenames.length + FILES.ammo.filenames.length;
        return function(filename, gltf) {
            // console.log(`GLTF ${filename}: `);
            // console.log(gltf);
            GAME.models.add(filename, gltf.scene);

            // All files loaded?
            if (++loaded == total) {
                ammo_machinegun.createInstances(1, 1000);
                craft_speederD.createInstances(200, 1);

                let obj3d = craft_speederD.getInstanceAvailable(0);
                UTILS.tmpV1.set(gridCell.x * 3, obj3d.userData.center.y + 0.05 + 0.1, gridCell.y * 3);
                obj3d = craft_speederD.addInstanceTo(scene, UTILS.tmpV1);
    
                UTILS.spiralGetNext(gridCell);
            }
        }
    })());

    SOUNDS.queueFileNames([ FILES.sounds ], function(filename, buffer) {
        GAME.audioBuffers.add(filename, buffer);

        if (filename == "122103__greatmganga__dshk-01.wav") { GAME.audioBuffers.spread(filename, 200); }
    });

    requestAnimationFrame( render );
})

function render(timeElapsed) {
    requestAnimationFrame( render );

    const timeDelta = clock.getDelta();

    RAYCASTER.getIntersects(scene.children, RAYCASTER.pointer, camera).forEach((intersect, index, array) => {
        // [ { distance, point, face, faceIndex, object }, ... ]
        let name = intersect.object?.userData?.filename;
        if (name && name == "ground") { 
            let obj3d = GAME.instances?.["craft_speederD.glb"]?.inuse?.[0];
            PHYSICS.makeTranslation(obj3d, intersect.point);
        }
    });

    let available = GAME.instances["ammo_machinegun.glb"]?.available.length;
    let inuse = GAME.instances["ammo_machinegun.glb"]?.inuse.length;
    MENU.get("info").textContent = `inuse: ${inuse} available: ${available}`;

    switch (GAME.state.phase) {
        case GAME.PHASES.INIT:
        case GAME.PHASES.PAUSED:
            // for (let gltf of Object.values(GLTFS.loaded)) {
            //     gltf.scene.rotation.y += timeDelta * (Math.PI / 2);
            // }
            break;
        case GAME.PHASES.STARTED:
            PHYSICS.update(timeDelta);

            // for (let gltf of Object.values(GLTFS.loaded)) {
            //     if (gltf.scene.position.y < -3) {
            //         PHYSICS.setLinearAndAngularVelocity(gltf.scene, UTILS.tmpV1.set(0,0,0), UTILS.tmpV2.set(0,0,0));
            //         PHYSICS.makeTranslationAndRotation(gltf.scene, UTILS.tmpV1.set(0,3,0), UTILS.tmpQuat1.identity());
            //     }
            // }

            for (let obj3d of GAME.instances["ammo_machinegun.glb"]?.inuse) {
                if (obj3d.position.z < -20) { 
                    PHYSICS.removeRigidBody(obj3d);
                    GAME.instances.releaseInstance(obj3d); 
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

    GAME.state.phase = GAME.PHASES.STARTED;
});

MENU.addEventListener("menuMobile", "click", function() {
    processPause();
});

KEYBOARD.addEventListener("keydown", function(e) {
    //console.log(e);
    switch (e.code) {
        case 'Escape':
            processPause();
            break;
    }
})

function processPause() {
    switch (GAME.state.phase) {
        case GAME.PHASES.INIT:
            break;
        case GAME.PHASES.STARTED:
            MENU.get("startButton").textContent = "Resume";
            document.getElementById("mainMenu").style.display = "block";

            GAME.state.phase = GAME.PHASES.PAUSED;
            break;
        case GAME.PHASES.PAUSED:
            document.getElementById("mainMenu").style.display = "none";

            GAME.state.phase = GAME.PHASES.STARTED;
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
var mousedownID = -1;  //Global ID of mouse down interval
function mousedown(event) {
    if(mousedownID == -1)  { //Prevent multimple loops!
        mousedownID = setInterval(whilemousedown, 50 /*execute every 100ms*/, event);
    }
}
function mouseup(event) {
    if(mousedownID!=-1) {  //Only stop if exists
        clearInterval(mousedownID);
        mousedownID=-1;
    }
}

function whilemousedown(event) {
    switch (GAME.state.phase) {
        case GAME.PHASES.INIT:
            break;
        case GAME.PHASES.STARTED:
            switch(event.button) {
                case 0:
                    let speeder = GAME.instances?.["craft_speederD.glb"].inuse?.[0];

                    GAME.sounds.play("122103__greatmganga__dshk-01.wav");

                    UTILS.tmpV1.set(speeder.position.x, speeder.position.y, speeder.position.z - speeder.userData.center.z - 0.1)
                    let obj3d = ammo_machinegun.addInstanceTo(scene, UTILS.tmpV1);
        
                    PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(0, 0, -1500));                    
                    break;
                case 1:
                    console.log("MIDDLE MOUSE BUTTON");
                    break;
                case 2:
                    console.log("RIGHT MOUSE BUTTON");
                    break;
            }
            break;
        case GAME.PHASES.PAUSED:

            break;
    }
}
//Assign events
document.addEventListener("mousedown", mousedown);
document.addEventListener("mouseup", mouseup);
//Also clear the interval when user leaves the window with mouse
document.addEventListener("mouseout", mouseup);

// // HELPERS
// // see https://threejs.org/manual/#en/lights
// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
// scene.add(dirLightHelper);
// // see https://threejs.org/manual/#en/shadows
// const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// scene.add(cameraHelper);