
// dir /W > ../../../../../list.txt
// Visual Studio Code "Find/Replace"
// 1. Switch to Regular Expression
// 2. Find: ([a-z0-9_]*)\".glb",
// 3. Replace: "$"1.glb",",
// (see also https://stackoverflow.com/questions/43577528/visual-studio-code-search-and-replace-with-regular-expressions)

export const craft = {
    prefix: "assets/3d/spacekit_2/Models/GLTF format/",
    filenames: [ //"../../../"cube.glb","
        // "craft_cargoA.glb",     
        // "craft_cargoB.glb",     
        "craft_miner.glb",
        // "craft_racer.glb",      
        "craft_speederA.glb",   
        "craft_speederB.glb",
        "craft_speederC.glb",   
        "craft_speederD.glb",   
    ],

    onFileload(filename, gltf) {
        // https://threejs.org/docs/#api/en/math/Color.setRGB
        if (filename == "craft_miner.glb") { gltf.scene.children[0].children[3].material.color.setRGB(1, 0, 0); }
        if (filename == "craft_speederA.glb") { gltf.scene.children[0].children[1].material.color.setRGB(1, 0, 0); }
        if (filename == "craft_speederB.glb") { gltf.scene.children[0].children[1].material.color.setRGB(1, 0, 0); }
        if (filename == "craft_speederC.glb") { 
            gltf.scene.children[0].children[0].material.color.setRGB(1, 0, 0); 
            gltf.scene.children[0].children[1].material.color.setRGB(1, 0, 0); 
        }
        if (filename == "craft_speederD.glb") { gltf.scene.children[0].children[3].material.color.setRGB(1, 1, 1); }
    }
}

export const ammo = {
    prefix: "assets/3d/weaponpack_assets/Models/",
    filenames: [
        "ammo_machinegun.glb",
        "ammo_machinegunLauncher.glb",
        "ammo_pistol.glb",
        "ammo_rocket.glb",
        "ammo_rocketModern.glb",
        "ammo_shotgun.glb",
        "ammo_sniper.glb",
        "ammo_uzi.glb",
    ]
}

export const sounds = {
    prefix: "assets/audio/",
    filenames: [
        "122103__greatmganga__dshk-01.wav", // https://freesound.org/people/greatmganga/sounds/122103/
    ]
}