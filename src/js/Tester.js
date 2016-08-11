"use strict";

define( ['THREE', 'ObjLoaderHelper', 'gaussian', 'Level'],
function (THREE,   ObjLoaderHelper,   gaussian, Level) {

    var objLoaderHelper = new ObjLoaderHelper('../../assets/');
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
    directionalLight.intensity = 0.9;
    directionalLight.position.set( 0, 50, -50 );
    scene.add( directionalLight );

    directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
    directionalLight.intensity = 0.9;
    directionalLight.position.set( -50, 50, -50 );
    scene.add( directionalLight );

    var level = new Level(100.0, 100.0, 10.0, 20.0);
    scene.add(level.getObject3D());

    // var leftTree = null;
    // var midTree = null;
    // var rightTree = null;

    var mean = 0;
    var variance = 10000;
    var numTrees = 50;

    var temp = new gaussian(mean, variance);

    // objLoaderHelper.loadObject('lowPolyTree/Lowpoly_tree_sample.mtl',
    //     'lowPolyTree/Lowpoly_tree_sample.obj', function (object) {
    //         for (var i = 0; i < numTrees; i++) {
    //
    //             var sampleX = temp.ppf(Math.random());
    //             var sampleZ = temp.ppf(Math.random());
    //             var currentObject = object.clone();
    //             currentObject.position.x = sampleX;
    //             currentObject.position.z = sampleZ;
    //             scene.add(currentObject);
    //         }
    //
    //     });

    camera.position.x = -100;
    camera.position.y = 200;
    camera.position.z = -200;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    function render() {
        requestAnimationFrame( render );

        // level.getObject3D().rotation.x += 0.01;
        // level.getObject3D().rotation.y += 0.01;
        level.getObject3D().rotation.z += 0.01;

        renderer.render( scene, camera );
    }

    render();

});