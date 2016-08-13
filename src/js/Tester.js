"use strict";

define( ['THREE',
        'ObjLoaderHelper',
        'gaussian',
        'Level',
        'Axes',
        'GridLevelOctogon',
        'GridLevelSquare',
        "GridLevelArea"],
function (THREE,
          ObjLoaderHelper,
          gaussian,
          Level,
          Axes,
          GridLevelOctogon,
          GridLevelSquare,
          GridLevelArea) {

    var objLoaderHelper = new ObjLoaderHelper('../../assets/');
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var ambient = new THREE.AmbientLight( 0xFFFFFF );
    scene.add( ambient );

    // var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
    // directionalLight.intensity = 3.0;
    // directionalLight.position.set( 0, 50, -50 );
    // directionalLight.lookAt(new THREE.Vector3(0, 0, 0));
    // scene.add( directionalLight );

    // directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
    // directionalLight.intensity = 0.9;
    // directionalLight.position.set( -50, 50, -50 );
    // scene.add( directionalLight );

    // var level = new Level(200.0, 40.0, 40.0);
    // level.getObject3D().position.z = 100;
    // scene.add(level.getObject3D());

    // var octo = new GridLevelOctogon(10, 50);
    // scene.add(octo.getObject3D());

    // var octo = new GridLevelSquare(20, 50);
    // scene.add(octo.getObject3D());

    var octo = new GridLevelArea(10, 10, 20, 20).init();
    octo.setBoundingBoxVisible(true);
    scene.add(octo);

    var axes = new Axes(500).init();
    scene.add(axes);

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

    // camera.position.x = -50;
    // camera.position.y = 50;
    // camera.position.z = -50;
    // camera.up = new THREE.Vector3(0, 1, 0);
    // camera.rotation.y = (-135.0) * Math.PI / 180.0;


    camera.position.x = 500;
    camera.position.y = 100;
    camera.position.z = 500;

    // camera.position.x = 0;
    // camera.position.y = 500;
    // camera.position.z = 0;
    // camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // camera.rotation.y = (-135.0) * Math.PI / 180.0;



    // camera.up
    // directionalLight.position.set(camera.position);


    var clock = new THREE.Clock();

    function render() {
        requestAnimationFrame( render );
        var delta = clock.getDelta();

        // level.rotation.x += 50 * delta * Math.PI / 180.0;
        octo.rotation.y += 50 * delta * Math.PI / 180.0;
        // level.rotation.z += 50 * delta * Math.PI / 180.0;

        // octo.rotation.z += 50.0 * delta * Math.PI / 180.0;
        renderer.render( scene, camera );
    }

    render();

});