"use strict";

define(["THREE", "GameObjectBase"], function (THREE, GameObjectBase) {
    var geometry = null;
    var material = null;

    var toRet = function (radius, height) {
        GameObjectBase.call(this);

        this.radius = radius;
        this.height = height;

        this._object3D = null;
    };

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
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
            if (material === null) {
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

                material = new THREE.MeshFaceMaterial(mats);
            }

            return material;
        },
        _createObject3D: function () {

            var cylinderMesh = new THREE.Mesh(this.getGeometry(), this.getMaterial());
            var toRet = new THREE.Object3D();
            toRet.add(cylinderMesh);
            cylinderMesh.rotation.y = (45.0 / 2.0) * Math.PI / 180.0;
            return toRet;
        },
        _createGeometry: function () {
            return new THREE.CylinderGeometry(this.radius, this.radius, this.height, 8, 1, false);
        }
    });

    return toRet;
});