"use strict";

define( ['THREE', 'jquery', 'MTLLoader', 'OBJLoader', 'DDSLoader'],
function (THREE,  $,         MTLLoader,   OBJLoader,   DDSLoader) {
    var toRet = function (basePath) {

        this._basePath = basePath;
        THREE.Loader.Handlers.add( /\.dds$/i, new DDSLoader() );
    };

    toRet.prototype = {
        onProgress: function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        },

        onError: function (xhr) {
            console.log('ERROR ' + xhr);
        },

        _loadMaterial: function (mtl_file, callback) {
            var self = this;

            var mtlLoader = new MTLLoader();
            mtlLoader.setPath(this._basePath);
            mtlLoader.load(mtl_file, function (materials) {

                materials.preload();

                callback(materials);

            }, this.onProgress, this.onError);
        },

        _loadObj: function (obj_file, materials, callback) {

            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(this._basePath);
            objLoader.load(obj_file, function (object) {

                callback(object);

            }, this.onProgress, this.onError);
        },

        loadObject: function (mtl_file, obj_file, callback) {

            var self = this;

            self._loadMaterial(mtl_file, function (materials) {

                self._loadObj(obj_file, materials, function (object) {

                    callback(object);

                });

            })

        }
    };

    return toRet;
});
