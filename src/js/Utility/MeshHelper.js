define(["THREE", "util/Console", "util/GeometryHelper"],
    function (THREE, console, GeometryHelper) {
        "use strict";

        var meshHelper = {};

        meshHelper.mergeMeshes = function (meshes) {
            var combined = new THREE.Geometry();

            for (var i = 0; i < meshes.length; i++) {
                meshes[i].updateMatrix();
                combined.merge(meshes[i].geometry, meshes[i].matrix);
            }

            return combined;
        };

        meshHelper.subdivideFaces = function (mesh) {
            return GeometryHelper.subdivideFaces(mesh.geometry);
        };

        return meshHelper;
    });
