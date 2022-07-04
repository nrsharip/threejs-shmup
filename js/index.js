"use strict"

import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

import * as GLBS from './glbs.js';
import * as GAME from './game.js'
import * as MESH from './mesh.js'
import * as PHYSICS from './physics.js'
import * as KEYBOARD from './keyboard.js'
import * as MENU from './menu.js'
import * as GLTFS from './gltfs.js'
import * as GRAPHICS from './graphics.js'
import * as PRIMITIVES from './primitives.js'
import * as UTILS from './utils.js'
import WebGLCheck from './lib/WebGL.js';

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
const camera = GRAPHICS.setupPerspectiveCamera('#mainCanvas', new Vector3(0, 30, 0), new Vector3(0, 0, 0));
const scene = GRAPHICS.setupScene('#96b0bc'); // https://encycolorpedia.com/96b0bc
const orbitControls = GRAPHICS.setupOrbitControls(camera, renderer);

// Controls
const raycaster = new THREE.Raycaster();
const intersects = [];
const pointer = new THREE.Vector2();

Ammo().then(function ( AmmoLib ) {
    Ammo = AmmoLib;

    PHYSICS.init();
    PHYSICS.dynamicsWorld.setGravity( new Ammo.btVector3( 0, 0, 0 ) );

    // SCENE OBJECTS
    const dirLight = GRAPHICS.setupDirLight();
    scene.add(dirLight);
    
    // GROUND
    let w = 15, h = 0.1, d = 15;
    const ground = PRIMITIVES.makeGround(w, h, d);
    ground["userData"].name = "ground";

    PHYSICS.addObject(ground, 0, UTILS.tmpV1.set(w, h, d), 0.05);
    scene.add(ground);

    // Loading GLTFs
    const gridCell = new Vector2(0, 0);
    GLTFS.queueFileNames([ GLBS.craft, GLBS.ammo ], function(filename, gltf) {
        // console.log(`GLTF ${filename}: `);
        // console.log(gltf);

        GAME.models.add(filename, gltf.scene);

        for (let i = 0; i < 5; i++) {
            let obj3d = GAME.models.getInstanceOf(filename);
            obj3d.position.x = gridCell.x * 3;
            obj3d.position.y = obj3d.userData.center.y + 0.05 + 0.1;
            obj3d.position.z = gridCell.y * 3;
            obj3d.userData.boundingBox.getSize(UTILS.tmpV1);
            obj3d.userData.onCollision = function(other) {
                // if (other && other.userData) {
                //     if (other.userData?.name == "ground") {
                //         PHYSICS.applyCentralForce(obj3d, UTILS.tmpV1.set(0, 200, 0));
                //     }
                // }
            }
            PHYSICS.addObject(obj3d, 10, UTILS.tmpV1, 0.05);
            scene.add( obj3d );
            UTILS.spiralGetNext(gridCell);
        }
    });

    requestAnimationFrame( render );
})

function render(timeElapsed) {
    requestAnimationFrame( render );

    const timeDelta = clock.getDelta();

    // https://threejs.org/docs/#api/en/core/Raycaster
    intersects.length = 0; // clearing the array
    raycaster.setFromCamera( pointer, camera );
	raycaster.intersectObjects( scene.children, false, intersects);
    for (let intersect of intersects) {
        // [ { distance, point, face, faceIndex, object }, ... ]
        let name = intersect.object?.userData?.name;
        if (name && name == "ground") { 
            console.log(intersect.point); 
        
            let obj3d = GAME.isntances["craft_speederD.glb"][0];
            PHYSICS.makeTranslation(obj3d, intersect.point);
        }
    }

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
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// // HELPERS
// // see https://threejs.org/manual/#en/lights
// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
// scene.add(dirLightHelper);
// // see https://threejs.org/manual/#en/shadows
// const cameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// scene.add(cameraHelper);