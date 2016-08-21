define(["THREE"], function (THREE) {

    return {
            width: 128,
            depth: 128, // This is really height for SingleMeshNoiseLayer
            seed: 13.0,
            continuity: 32.0,
            numLevels: 5,
            faceWidth: 1.0,
            faceHeight: 10.0,
            faceDepth: 1.0,
            skyBoxTextureFile: "/assets/textures/LostAtSeaSkybox",
            skyBoxTextureExtension: "jpg",
            sunDirection: new THREE.Vector3(128, 128, 128).normalize(),
            gravity: -9.8
        };
});