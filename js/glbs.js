
// dir /W > ../../../../../list.txt
// Visual Studio Code "Find/Replace"
// 1. Switch to Regular Expression
// 2. Find: ([a-z0-9_]*)\".glb",
// 3. Replace: "$"1.glb",",
// (see also https://stackoverflow.com/questions/43577528/visual-studio-code-search-and-replace-with-regular-expressions)

export const glbs = [ //"../../../"cube.glb","
    "craft_cargoA.glb",     
    "craft_cargoB.glb",     
    "craft_miner.glb",
    "craft_racer.glb",      
    "craft_speederA.glb",   
    "craft_speederB.glb",
    "craft_speederC.glb",   
    "craft_speederD.glb",   
]