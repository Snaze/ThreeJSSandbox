
define(["QUnit", "util/GeometryHelper", "THREE"], function (QUnit, GeometryHelper, THREE) {
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

            // CALL
            var resultGeom = GeometryHelper.subdivideFaces(triangle, 1);


            // ASSERT
            assert.ok(resultGeom.vertices.length === 6, "Passed!");
            assert.ok(resultGeom.faces.length === 4, "Passed!");
        });

        QUnit.test("subdivideFaces2", function (assert) {
            // SETUP
            var triangle = new THREE.Geometry();
            triangle.vertices.push(new THREE.Vector3(0, 0, 0));
            triangle.vertices.push(new THREE.Vector3(2, 0, 2));
            triangle.vertices.push(new THREE.Vector3(4, 0, 0));
            triangle.faces.push(new THREE.Face3(0, 1, 2));

            // CALL
            var resultGeom = GeometryHelper.subdivideFaces(triangle, 2);


            // ASSERT
            assert.ok(resultGeom.vertices.length === 15, "Passed!");
            assert.ok(resultGeom.faces.length === 16, "Passed!");
        });

    };

    return classToRet;
});

