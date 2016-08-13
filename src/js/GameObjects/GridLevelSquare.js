"use strict";

define(["THREE", "GameObjectBase"], function (THREE, GameObjectBase) {

    var toRet = function (width, height) {
        GameObjectBase.call(this);

        this.ud.width = width;
        this.ud.height = height;
    };

    toRet.geometry = null;
    toRet.material = null;

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        getGeometry: function () {
            if (null === toRet.geometry) {
                toRet.geometry = this._createGeometry();
            }

            return toRet.geometry;
        },
        getMaterial: function () {
            if (null === toRet.material) {
                toRet.material = this._createMaterial();
            }

            return toRet.material;
        },
        _createObject: function () {
            return new THREE.Mesh(this.getGeometry(), this.getMaterial());
        },
        _createGeometry: function () {
            return new THREE.BoxGeometry(this.ud.width, this.ud.height, this.ud.width, 1, 1, 1);
        },
        _createMaterial: function () {
            var textureLoader = new THREE.TextureLoader();
            var dirtTexture = textureLoader.load('../../assets/textures/dirt1.jpg');
            var grassTexture = textureLoader.load('../../assets/textures/grass1.jpg');

            var dirtMaterial = new THREE.MeshLambertMaterial({map: dirtTexture});
            var grassMaterial = new THREE.MeshLambertMaterial({map: grassTexture});

            var geo = this.getGeometry();
            console.assert(geo.faces.length === 12, "geo.faces.length = " + geo.faces.length);

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
    });

    return toRet;
});