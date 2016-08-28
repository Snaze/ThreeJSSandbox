// contents of main.js:
require.config({
    baseUrl: '/ThreeJSSandbox',
    paths: {
        /** BOWER COMPONENTS **/
        'jquery': 'bower_components/jquery/dist/jquery.min',
        'THREE': 'bower_components/three.js/build/three',
        'OBJLoader': 'bower_components/three.js/examples/js/loaders/OBJLoader',
        'DDSLoader': 'bower_components/three.js/examples/js/loaders/DDSLoader',
        'MTLLoader': 'bower_components/three.js/examples/js/loaders/MTLLoader',
        "WaterShader": "bower_components/three.js/examples/js/WaterShader",
        "UVsDebug": "bower_components/three.js/examples/js/utils/UVsDebug",
        "OrbitControls": "bower_components/three.js/examples/js/controls/OrbitControls",

        "hull": "bower_components/hull-js/dist/hull",
        "Mirror": "bower_components/three.js/examples/js/Mirror",
        'gaussian': 'bower_components/gaussian/lib/gaussian',
        'seedrandom': 'bower_components/seedrandom/seedrandom',
        'xor4096': 'bower_components/seedrandom/lib/xor4096',
        'noisejs': 'bower_components/noisejs/index',
        "QUnit": "bower_components/qunit/qunit/qunit",
        "PointerLockControls": "bower_components/three.js/examples/js/controls/PointerLockControls",
        "cannon": "bower_components/cannon.js/build/cannon",
        "CannonDebugRenderer" : "bower_components/cannon.js/tools/threejs/CannonDebugRenderer",
        "jquery-ui" : "bower_components/jquery-ui/jquery-ui.min",
        "text" : "bower_components/text/text",
        "css" : "bower_components/require-css/css",

        /** JS **/
        'Tester': 'src/js/Tester',
        'ObjLoaderHelper': 'src/js/ObjLoaderHelper',
        'Level': 'src/js/GameObjects/Level',

        /** JS / GAMEOBJECTS **/
        'GameObjectBase': 'src/js/GameObjects/GameObjectBase',
        'Axes': 'src/js/GameObjects/Axes',
        'GridLevelArea': 'src/js/GameObjects/GridLevelArea',
        'GridLevelLayer': 'src/js/GameObjects/GridLevelLayer',
        'GridLevelSection': 'src/js/GameObjects/GridLevelSection',
        'GridLevelOctogon': 'src/js/GameObjects/GridLevelOctogon',
        'GridLevelSquare': 'src/js/GameObjects/GridLevelSquare',
        'TerrainBox': 'src/js/GameObjects/TerrainBox',
        'AugmentedExtrudedEllipse': 'src/js/GameObjects/AugmentedExtrudedEllipse',
        'SingleMeshNoiseLayer': 'src/js/GameObjects/SingleMeshNoiseLayer',
        'WaterBox': 'src/js/GameObjects/WaterBox',
        'SkyBox': 'src/js/GameObjects/SkyBox',
        'GameObjects': 'src/js/GameObjects',

        /** JS / UTILITY **/
        "TerrainGenerator": 'src/js/Utility/TerrainGenerator',
        "util": 'src/js/Utility',

        /** WEB **/
        "web": 'src/js/Web',

        /** LIB **/
        "morph": "lib/morph/morph",
        "Immutable": "lib/Immutable/Immutable.min",

        "UnitTests": "src/js/UnitTests"
    },
    shim: {
        'THREE': {
            exports: 'THREE'
        },
        'OBJLoader': {
            deps: ['THREE'],
            exports: 'THREE.OBJLoader'
        },
        'DDSLoader': {
            deps: ['THREE'],
            exports: 'THREE.DDSLoader'
        },
        'MTLLoader': {
            deps: ['THREE'],
            exports: 'THREE.MTLLoader'
        },
        'OrbitControls': {
            deps: ['THREE'],
            exports: 'THREE.OrbitControls'
        },
        'Mirror': {
            deps: ['THREE'],
            exports: 'THREE.Mirror'
        },
        'PointerLockControls': {
            deps: ['THREE'],
            exports: 'THREE.PointerLockControls'
        },
        'WaterShader': {
            deps: ['THREE', 'Mirror'],
            exports: 'THREE.Water'
        },
        'UVsDebug': {
            deps: ['THREE'],
            exports: 'THREE.UVsDebug'
        },
        "noisejs": {
            exports: "Noise"
        },
        "cannon": {
            deps: ['THREE'],
            exports: "CANNON"
        },
        "CannonDebugRenderer": {
            deps: ['THREE', 'cannon'],
            exports: "THREE.CannonDebugRenderer"
        },
        "morph": {
            exports: "Morph"
        },
        'QUnit': {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
    // map: {
    //     '*': {
    //         'css': 'bower_components/require-css/css' // or whatever the path to require-css is
    //     }
    // }
});