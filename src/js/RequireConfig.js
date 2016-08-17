// contents of main.js:
require.config({
    baseUrl: '/ThreeJSSandbox',
    paths: {
        /** BOWER COMPONENTS **/
        'jquery': 'bower_components/jquery/dist/jquery',
        'THREE': 'bower_components/three.js/build/three',
        'OBJLoader': 'bower_components/three.js/examples/js/loaders/OBJLoader',
        'DDSLoader': 'bower_components/three.js/examples/js/loaders/DDSLoader',
        'MTLLoader': 'bower_components/three.js/examples/js/loaders/MTLLoader',
        "WaterShader": "bower_components/three.js/examples/js/WaterShader",
        "Mirror": "bower_components/three.js/examples/js/Mirror",
        'gaussian': 'bower_components/gaussian/lib/gaussian',
        'seedrandom': 'bower_components/seedrandom/seedrandom',
        'xor4096': 'bower_components/seedrandom/lib/xor4096',
        'noisejs': 'bower_components/noisejs/index',
        "QUnit": "bower_components/qunit/qunit/qunit",

        /** JS **/
        'Tester': 'src/js/Tester',
        'ObjLoaderHelper': 'src/js/ObjLoaderHelper',
        'Level': 'src/js/GameObjects/Level',

        /** JS / GAMEOBJECTS **/
        'GameObjectBase': 'src/js/GameObjects/GameObjectBase',
        'Axes': 'src/js/GameObjects/Axes',
        'BoundingBox': 'src/js/GameObjects/BoundingBox',
        'GridLevelArea': 'src/js/GameObjects/GridLevelArea',
        'GridLevelLayer': 'src/js/GameObjects/GridLevelLayer',
        'GridLevelSection': 'src/js/GameObjects/GridLevelSection',
        'GridLevelOctogon': 'src/js/GameObjects/GridLevelOctogon',
        'GridLevelSquare': 'src/js/GameObjects/GridLevelSquare',
        'TerrainBox': 'src/js/GameObjects/TerrainBox',
        'AugmentedExtrudedEllipse': 'src/js/GameObjects/AugmentedExtrudedEllipse',
        'SingleMeshNoiseLayer': 'src/js/GameObjects/SingleMeshNoiseLayer',
        'WaterBox': 'src/js/GameObjects/WaterBox',

        /** JS / UTILITY **/
        "TerrainGenerator": 'src/js/Utility/TerrainGenerator',
        "util": 'src/js/Utility/',

        /** LIB **/
        "morph": "lib/morph/morph",
        "Immutable": "lib/Immutable/Immutable.min",

        "UnitTests": "src/js/UnitTests/"
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
        'Mirror': {
            deps: ['THREE'],
            exports: 'THREE.Mirror'
        },
        'WaterShader': {
            deps: ['THREE', 'Mirror'],
            exports: 'THREE.Water'
        },
        "noisejs": {
            exports: "Noise"
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
        // 'gaussian': {
        //     exports: 'gaussian'
        // }
    }
});