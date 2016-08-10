"use strict";

define( ['THREE', 'ObjLoaderHelper', 'gaussian'],
function (THREE,   ObjLoaderHelper,   gaussian) {

    var objLoaderHelper = new ObjLoaderHelper('../../assets/');
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xFFFFFF );
    directionalLight.intensity = 2.0;
    directionalLight.position.set( 0, 100, 0 );

    scene.add( directionalLight );

    // var leftTree = null;
    // var midTree = null;
    // var rightTree = null;

    var mean = 0;
    var variance = 10000;
    var numTrees = 50;

    var temp = new gaussian(mean, variance);

    objLoaderHelper.loadObject('lowPolyTree/Lowpoly_tree_sample.mtl',
        'lowPolyTree/Lowpoly_tree_sample.obj', function (object) {
            for (var i = 0; i < numTrees; i++) {

                var sampleX = temp.ppf(Math.random());
                var sampleZ = temp.ppf(Math.random());
                var currentObject = object.clone();
                currentObject.position.x = sampleX;
                currentObject.position.z = sampleZ;
                scene.add(currentObject);
            }

        });

    camera.position.y = 50;
    camera.position.z = -50;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    function render() {
        requestAnimationFrame( render );

        renderer.render( scene, camera );
    }

    render();

});