// contents of main.js:
require.config({
    paths: {
        'jquery': '../../bower_components/jquery/dist/jquery',
        'THREE': '../../bower_components/three.js/build/three',
        'OBJLoader': '../../bower_components/three.js/examples/js/loaders/OBJLoader',
        'DDSLoader': '../../bower_components/three.js/examples/js/loaders/DDSLoader',
        'MTLLoader': '../../bower_components/three.js/examples/js/loaders/MTLLoader',
        'Tester': '../js/Tester',
        'ObjLoaderHelper': '../js/ObjLoaderHelper',
        'Level': '../js/Level',
        'Axes': '../js/Axes',
        'gaussian': '../../bower_components/gaussian/lib/gaussian'
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