import * as THREE from 'three';

const loaded = {}
// Loading Sounds
// https://threejs.org/docs/#api/en/audio/Audio
// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();

function queueFileNames(groups, onFileload) {
    for (let group of groups) {
        for (let filename of group.filenames) {
            audioLoader.load( `${group.prefix}${filename}`, onSoundLoad(filename, group, onFileload), undefined, function ( error ) {
                throw new Error("Error while loading the file: " + filename + ", error: " + error);
            });
        }
    }
}

function onSoundLoad(filename, group, onFileload) {
    return function ( buffer ) {
        loaded[filename] = buffer;

        if (!buffer["userData"]) { buffer["userData"] = {}; }
        buffer["userData"].filename = filename;
        
        group?.onFileload?.(filename, buffer);
        onFileload(filename, buffer);
    }
}

export { queueFileNames, loaded }