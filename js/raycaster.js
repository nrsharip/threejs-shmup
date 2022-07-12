import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const raycaster2 = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const intersects = [];
const intersects2 = [];

function getIntersects(obj3d, pointer, camera) {
    // https://threejs.org/docs/#api/en/core/Raycaster        
    intersects.length = 0; // clearing the array
    raycaster.setFromCamera( pointer, camera );
    raycaster.intersectObjects( obj3d, false, intersects);
    return intersects;
}

export { raycaster2, pointer, intersects, intersects2, getIntersects }