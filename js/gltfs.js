import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.142.0/examples/jsm/loaders/GLTFLoader.js';

const loaded = {}
const loader = new GLTFLoader(); // see https://threejs.org/docs/index.html#manual/en/introduction/Loading-3D-models

function queueFileNames(groups, onFileload) {
    console.log("queueFileNames");
    for (let group of groups) {
        for (let filename of group.filenames) {
            console.log("queued: ", filename);
            loader.load( `${group.prefix}${filename}`, onGLTFLoad(filename, group, onFileload), undefined, function ( error ) {
                throw new Error("Error while loading the file: " + filename + ", error: " + error);
            });
        }
    }
}

function onGLTFLoad(filename, group, onFileload) {
    return function ( gltf ) {
        loaded[filename] = gltf;

        console.log(filename, gltf);

        if (gltf && gltf.scene && gltf.scene instanceof THREE.Object3D) {
            gltf.scene["userData"].filename = filename;
            gltf.scene.traverse(function(object) {
                if (object.isMesh) {
                    // see https://threejs.org/manual/#en/shadows
                    object.castShadow = true;
                    object.receiveShadow = true;
    
                    // see https://threejs.org/manual/#en/materials
                    //     table with roughness from 0 to 1 across and metalness from 0 to 1 down.
                    object.material.roughness = 0.57; // the value is out of Chrome Console debug
                    object.material.metalness = 0; // the value is out of Chrome Console debug
                }
            })
        }
        
        group?.onFileload?.(filename, gltf);
        onFileload(filename, gltf);
    }
}

export { queueFileNames, loaded }