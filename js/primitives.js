import * as THREE from 'three';

function makeBox(sx, sy, sz, color) {
    const geometry = new THREE.BoxGeometry(sx, sy, sz);
    // The MeshBasicMaterial is not affected by lights. 
    // Let's change it to a MeshPhongMaterial which is affected by lights.
    const material = new THREE.MeshPhongMaterial({color: color}); // 0x44aa88
    const cube = new THREE.Mesh(geometry, material);

    // see https://threejs.org/manual/#en/shadows
    cube.castShadow = true;
    cube.receiveShadow = true;

    return cube;
}

function makeSphere(radius, widthSegments, heightSegments, color) {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    // The MeshBasicMaterial is not affected by lights. 
    // Let's change it to a MeshPhongMaterial which is affected by lights.
    const material = new THREE.MeshPhongMaterial({color: color}); // 0x44aa88
    const sphere = new THREE.Mesh(geometry, material);

    // see https://threejs.org/manual/#en/shadows
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    return sphere;
}

function makeGround(w, h, d) {
    const geometry = new THREE.BoxGeometry( w, h, d, 1, 1, 1 );
    // https://stackoverflow.com/questions/14856339/how-do-i-change-the-opacity-of-an-stl-object-in-three-js-webgl
    const material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );
    const ground = new THREE.Mesh(geometry, material);
    ground.receiveShadow = true;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load( 'assets/images/grid.png', function ( texture ) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.repeat.set( w, d );

        ground.material.map = texture;
        ground.material.needsUpdate = true;
    });
    ground.material.color.setRGB(1.3, 1.3, 1.3); // see https://threejs.org/manual/#en/shadows

    return ground;
}

export {
    makeBox,
    makeSphere,
    makeGround
}