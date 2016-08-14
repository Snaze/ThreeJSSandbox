"use strict";

define(["THREE", "GameObjectBase"], function (THREE, GameObjectBase) {

    var classToRet = function (width, height) {
        GameObjectBase.call(this);

        this.ud.width = width;
        this.ud.height = height;
    };

    classToRet.geometry = {};
    classToRet.material = {};

    classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        _subInit: function () {
        },
        getKey: function () {
            return "height_" + this.ud.height + "_width_" + this.ud.width;
        },
        getGeometry: function () {
            var key = this.getKey();
            if (!(key in classToRet.geometry)) {
                classToRet.geometry[key] = this._createGeometry();
            }

            return classToRet.geometry[key];
        },
        getMaterial: function () {
            var key = this.getKey();

            if (!(key in classToRet.material)) {
                classToRet.material[key] = this._createMaterial();
            }

            return classToRet.material[key];
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

    return classToRet;
});