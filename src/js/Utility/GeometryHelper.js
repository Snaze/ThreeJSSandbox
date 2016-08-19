define(["THREE", "util/Console"],
    function (THREE, console) {
        "use strict";

        var geometryHelper = {};

        geometryHelper.averageVectors = function (vector1, vector2) {
            return new THREE.Vector3().addVectors(vector1, vector2).multiplyScalar(0.5);
        };

        geometryHelper.addFaceToGeometry = function (geometry, vertexA, vertexB, vertexC) {
            // console.assert(typeof(vertexA) === THREE.Vector3);
            // console.assert(typeof(vertexB) === THREE.Vector3);
            // console.assert(typeof(vertexC) === THREE.Vector3);
            geometry.vertices.push(vertexA.clone());
            var vertexAIndex = geometry.vertices.length - 1;

            geometry.vertices.push(vertexB.clone());
            var vertexBIndex = geometry.vertices.length - 1;

            geometry.vertices.push(vertexC.clone());
            var vertexCIndex = geometry.vertices.length - 1;

            geometry.faces.push(new THREE.Face3(vertexAIndex, vertexBIndex, vertexCIndex));

        };

        geometryHelper._singleSubdivideFaces = function (geometry) {
            var toRet = new THREE.Geometry();

            geometry.faces.forEach(function (face, index) {

                var origVertA = geometry.vertices[face.a];
                var origVertB = geometry.vertices[face.b];
                var origVertC = geometry.vertices[face.c];

                var avgA = geometryHelper.averageVectors(origVertA, origVertB);
                var avgB = geometryHelper.averageVectors(origVertB, origVertC);
                var avgC = geometryHelper.averageVectors(origVertC, origVertA);

                geometryHelper.addFaceToGeometry(toRet, origVertA, avgA, avgC);
                geometryHelper.addFaceToGeometry(toRet, avgA, origVertB, avgB);
                geometryHelper.addFaceToGeometry(toRet, avgB, origVertC, avgC);
                geometryHelper.addFaceToGeometry(toRet, avgA, avgB, avgC);
            });

            return toRet;
        };

        geometryHelper.subdivideFaces = function (geometry, numSplits) {
            if (!numSplits) {
                numSplits = 0;
            }

            var toRet = geometry;

            for (var i = 0; i < numSplits; i++) {
                toRet = geometryHelper._singleSubdivideFaces(toRet);
            }

            toRet.mergeVertices();

            return toRet;
        };

        return geometryHelper;
    });
