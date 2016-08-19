
define(["QUnit", "util/TrimeshCreator", "THREE"], function (QUnit, TrimeshCreator, THREE) {
    "use strict";

    var classToRet = function () {

    };

    classToRet.run = function () {

        QUnit.test("subdivideFaces", function (assert) {
            // SETUP
            var triangle = new THREE.Geometry();
            triangle.vertices.push(new THREE.Vector3(0, 0, 0));
            triangle.vertices.push(new THREE.Vector3(2, 0, 2));
            triangle.vertices.push(new THREE.Vector3(4, 0, 0));
            triangle.faces.push(new THREE.Face3(0, 1, 2));

            var trimeshCreator = new TrimeshCreator(triangle, 2);

            // CALL
            var resultTrimesh = trimeshCreator.create();

        });

    };

    return classToRet;
});

