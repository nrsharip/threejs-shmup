import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const intersects = [];

function getIntersects(obj3d, pointer, camera) {
    // https://threejs.org/docs/#api/en/core/Raycaster        
    intersects.length = 0; // clearing the array
    raycaster.setFromCamera( pointer, camera );
    raycaster.intersectObjects( obj3d, false, intersects);
    return intersects;
}

export { pointer, intersects, getIntersects }