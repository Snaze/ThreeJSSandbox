// contents of main.js:
require.config({
    baseUrl: '/ThreeJSSandbox',
    paths: {
        'jquery': 'bower_components/jquery/dist/jquery',
        'THREE': 'bower_components/three.js/build/three',
        'OBJLoader': 'bower_components/three.js/examples/js/loaders/OBJLoader',
        'DDSLoader': 'bower_components/three.js/examples/js/loaders/DDSLoader',
        'MTLLoader': 'bower_components/three.js/examples/js/loaders/MTLLoader',
        'Tester': 'src/js/Tester',
        'ObjLoaderHelper': 'src/js/ObjLoaderHelper',
        'Level': 'src/js/GameObjects/Level',
        'GameObjectBase': 'src/js/GameObjects/GameObjectBase',
        'Axes': 'src/js/GameObjects/Axes',
        'BoundingBox': 'src/js/GameObjects/BoundingBox',
        'GridLevelArea': 'src/js/GameObjects/GridLevelArea',
        'GridLevelSection': 'src/js/GameObjects/GridLevelSection',
        'GridLevelOctogon': 'src/js/GameObjects/GridLevelOctogon',
        'GridLevelSquare': 'src/js/GameObjects/GridLevelSquare',
        'gaussian': 'bower_components/gaussian/lib/gaussian'
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
        // 'gaussian': {
        //     exports: 'gaussian'
        // }
    }
});