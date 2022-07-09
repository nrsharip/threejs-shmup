import * as THREE from 'three';
import { Vector2 } from 'three';

const tmpM1 = new THREE.Matrix4();
const tmpM2 = new THREE.Matrix4();
const tmpM3 = new THREE.Matrix4();

const tmpEuler1 = new THREE.Euler();
const tmpEuler2 = new THREE.Euler();
const tmpEuler3 = new THREE.Euler();

const tmpQuat1 = new THREE.Quaternion();
const tmpQuat2 = new THREE.Quaternion();
const tmpQuat3 = new THREE.Quaternion();

const tmpV1 = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();
const tmpV3 = new THREE.Vector3();

// see https://threejs.org/manual/#en/responsive
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    // ATTENTION: do not confuse canvas.width and canvas.clientWidth
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    
    if (needResize) { renderer.setSize(width, height, false); }
    
    return needResize;
}

function getCameraFrustum(camera, frustum) {
    // https://stackoverflow.com/questions/10858599/how-to-determine-if-plane-is-in-three-js-camera-frustum
    camera.updateMatrix(); // make sure camera's local matrix is updated
    camera.updateMatrixWorld(); // make sure camera's world matrix is updated
    camera.updateProjectionMatrix();

    // see also: https://threejs.org/docs/#api/en/math/Matrix4
    // Every Object3D has three associated Matrix4s:
    // * Object3D.matrix: This stores the local transform of the object. This is the object's transformation relative to its parent.
    // * Object3D.matrixWorld: The global or world transform of the object. If the object has no parent, then this is identical to the local transform stored in matrix.
    // * Object3D.modelViewMatrix: This represents the object's transformation relative to the camera's coordinate system. An object's modelViewMatrix is the object's matrixWorld pre-multiplied by the camera's matrixWorldInverse.
    // Cameras have three additional Matrix4s:
    // * Camera.matrixWorldInverse: The view matrix - the inverse of the Camera's matrixWorld.
    // * Camera.projectionMatrix: Represents the information how to project the scene to clip space.
    // * Camera.projectionMatrixInverse: The inverse of projectionMatrix.

    if (!frustum) { frustum = new THREE.Frustum(); }
    frustum.setFromProjectionMatrix( 
        new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) 
    );

    // frustum.planes[0] - left side
    // frustum.planes[1] - right side
    // frustum.planes[2] - top side
    // frustum.planes[3] - bottom side
    // frustum.planes[4] - far side
    // frustum.planes[5] - near side

    return frustum;
}

// Ported from:
// https://github.com/nrsharip/hammergenics/blob/ecf9b7bb1c7037e3705000a586dca0559928e512/core/src/com/hammergenics/HGUtils.java#L1004
function spiralGetNext(inOut) {
    let tmp = new Vector2(0, 0);
    let i = 0, j;

    while (i < 50) { // to avoid any unnecessary infinite looping
        i++;
        for (j = 0; j < i; j++) { if (tmp.equals(inOut)) { return inOut.sub(new Vector2(0, 1)); } else { tmp.y--; } }
        for (j = 0; j < i; j++) { if (tmp.equals(inOut)) { return inOut.sub(new Vector2(1, 0)); } else { tmp.x--; } }
        i++;
        for (j = 0; j < i; j++) { if (tmp.equals(inOut)) { return inOut.add(new Vector2(0, 1)); } else { tmp.y++; } }
        for (j = 0; j < i; j++) { if (tmp.equals(inOut)) { return inOut.add(new Vector2(1, 0)); } else { tmp.x++; } }
    }
}

// tmp2.quaternion rotates by 180 degrees
let tmp2 = new THREE.Object3D();
tmp2.position.set(0,0,0);
tmp2.lookAt(0,0,-10); 

const quatDegrees180 = tmp2.quaternion;

export { 
    resizeRendererToDisplaySize,
    getCameraFrustum,
    spiralGetNext, 
    tmpM1, tmpM2, tmpM3,
    tmpEuler1, tmpEuler2, tmpEuler3,
    tmpQuat1, tmpQuat2, tmpQuat3,
    tmpV1, tmpV2, tmpV3,

    quatDegrees180
}