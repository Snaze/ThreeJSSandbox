"use strict";

define(["THREE", "GameObjectBase"], function (THREE, GameObjectBase) {

    var toRet = function (radius, height) {
        GameObjectBase.call(this);

        this.ud.radius = radius;
        this.ud.height = height;
    };

    toRet.geometry = {};
    toRet.material = {};

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        _subInit: function () {
        },

        getKey: function () {
            return "height_" + this.ud.height + "_radius_" + this.ud.radius;
        },

        getGeometry: function () {
            var key = this.getKey();
            if (!(key in toRet.geometry)) {
                toRet.geometry[key] = this._createGeometry();
            }

            return toRet.geometry[key];
        },
        getMaterial: function () {
            var key = this.getKey();

            if (!(key in toRet.material)) {
                var textureLoader = new THREE.TextureLoader();
                var dirtTexture = textureLoader.load('../../assets/textures/dirt1.jpg');
                var grassTexture = textureLoader.load('../../assets/textures/grass1.jpg');

                var dirtMaterial = new THREE.MeshLambertMaterial({map: dirtTexture});
                var grassMaterial = new THREE.MeshLambertMaterial({map: grassTexture});

                var geo = this.getGeometry();
                console.assert(geo.faces.length === 32);

                var mats = [grassMaterial, dirtMaterial];
                for (var i = 0; i < geo.faces.length; i++) {
                    if (i >= 16 && i < 24) { // TOP FACES OF CYLINDER
                        geo.faces[i].materialIndex = 0;
                    } else {
                        geo.faces[i].materialIndex = 1;
                    }
                }

                toRet.material[key] = new THREE.MeshFaceMaterial(mats);
            }

            return toRet.material[key];
        },
        _createObject: function () {

            var cylinderMesh = new THREE.Mesh(this.getGeometry(), this.getMaterial());
            cylinderMesh.rotation.y = (45.0 / 2.0) * Math.PI / 180.0;
            return cylinderMesh;
        },
        _createGeometry: function () {
            return new THREE.CylinderGeometry(this.ud.radius,
                this.ud.radius, this.ud.height, 8, 1, false);
        }
    });

    return toRet;
});