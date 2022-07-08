
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
        "turret_double.glb",
        "turret_single.glb",
    ],

    onFileload(filename, gltf) {
        // https://threejs.org/docs/#api/en/math/Color.setRGB
        if (filename == "craft_miner.glb") { gltf.scene.children[0].children[3].material.color.setRGB(1, 0, 0); }
        if (filename == "craft_speederA.glb") { gltf.scene.children[0].children[1].material.color.setRGB(0, 1, 0); }
        if (filename == "craft_speederB.glb") { gltf.scene.children[0].children[1].material.color.setRGB(0, 0, 1); }
        if (filename == "craft_speederC.glb") { 
            gltf.scene.children[0].children[0].material.color.setRGB(1, 1, 0); 
            gltf.scene.children[0].children[1].material.color.setRGB(1, 1, 0); 
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

export const explosion = {
    prefix: "assets/audio/explosion/",
    filenames: [
        "587186__derplayer__explosion-00.wav", // https://freesound.org/people/derplayer/sounds/587186/
        "587185__derplayer__explosion-01.wav", // https://freesound.org/people/derplayer/sounds/587185/
        "587184__derplayer__explosion-02.wav", // https://freesound.org/people/derplayer/sounds/587184/
        "587183__derplayer__explosion-03.wav", // https://freesound.org/people/derplayer/sounds/587183/
        "587190__derplayer__explosion-04.wav", // https://freesound.org/people/derplayer/sounds/587190/
        "587189__derplayer__explosion-05.wav", // https://freesound.org/people/derplayer/sounds/587190/
    ]
}

export const rocket = {
    prefix: "assets/audio/rocket/",
    filenames: [
        "755__elmomo__missile01.mp3", // https://freesound.org/people/elmomo/sounds/755/
        "756__elmomo__missile02.mp3", // https://freesound.org/people/elmomo/sounds/756/
        "51468__smcameron__missile-launch-2.wav", // https://freesound.org/people/smcameron/sounds/51468/
        "186931__readeonly__rocket-whistle2.wav", // https://freesound.org/people/ReadeOnly/sounds/186931/
        "51469__smcameron__rocket-exhaust-1.wav", // https://freesound.org/people/smcameron/sounds/51469/
        "273332__robinhood76__05780-space-missile.wav", // https://freesound.org/people/Robinhood76/sounds/273332/
        "334269__projectsu012__launching-2.wav", // https://freesound.org/people/ProjectsU012/sounds/334269/
        "580751__marklaukkanen__fireworks-whistle-whine.wav", // https://freesound.org/people/marklaukkanen/sounds/580751/
    ]
}

export const impact = {
    prefix: "assets/audio/kenney_impactsounds/Audio/",
    filenames: [
        "impactMetal_light_000.ogg", // https://kenney.nl/assets/impact-sounds
        "impactMetal_light_001.ogg",
        "impactMetal_light_002.ogg",
        "impactMetal_light_003.ogg",
        "impactMetal_light_004.ogg",
        "impactTin_medium_000.ogg",
        "impactTin_medium_001.ogg",
        "impactTin_medium_002.ogg",
        "impactTin_medium_003.ogg",
        "impactTin_medium_004.ogg",
    ]
}

export const digital = {
    prefix: "assets/audio/kenney_digitalaudio/Audio/",
    filenames: [
        "powerUp1.ogg", // https://kenney.nl/assets/digital-audio
    ]
}