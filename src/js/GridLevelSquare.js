"use strict";

define(["THREE"], function (THREE) {
    var geometry = null;
    var material = null;

    var toRet = function (width, height) {
        this.width = width;
        this.height = height;

        this._object3D = null;
    };

    toRet.prototype = {
        getObject3D: function () {
            if (null === this._object3D) {
                this._object3D = this._createObject3D();
            }

            return this._object3D;
        },
        getGeometry: function () {
            if (null === geometry) {
                geometry = this._createGeometry();
            }

            return geometry;
        },
        getMaterial: function () {
            if (null === material) {
                material = this._createMaterial();
            }

            return material;
        },
        _createObject3D: function () {

            return new THREE.Mesh(this.getGeometry(), this.getMaterial());
        },
        _createGeometry: function () {
            return new THREE.BoxGeometry(this.width, this.height, this.width, 1, 1, 1);
        },
        _createMaterial: function () {
            var textureLoader = new THREE.TextureLoader();
            var dirtTexture = textureLoader.load('../../assets/textures/dirt1.jpg');
            var grassTexture = textureLoader.load('../../assets/textures/grass1.jpg');

            var dirtMaterial = new THREE.MeshLambertMaterial({map: dirtTexture});
            var grassMaterial = new THREE.MeshLambertMaterial({map: grassTexture});

            var geo = this.getGeometry();
            console.assert(geo.faces.length === 32);

            var mats = [grassMaterial, dirtMaterial];
            for (var i = 0; i < geo.faces.length; i++) {
                if (i == 4 || i == 5) { // TOP FACES OF CYLINDER
                    geo.faces[i].materialIndex = 0;
                } else {
                    geo.faces[i].materialIndex = 1;
                }
            }

            return new THREE.MeshFaceMaterial(mats);
        }
    };

    return toRet;
});