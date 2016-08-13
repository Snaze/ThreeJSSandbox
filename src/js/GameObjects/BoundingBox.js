"use strict";

define(["THREE"], function (THREE) {
    var toRet = function (width, height, depth) {
        THREE.Object3D.call(this);

        this.width = width;
        this.height = height;
        this.depth = depth;
    };

    toRet.wireFrameMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });

    toRet.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        init: function () {
            this._createBoundingBox();
            return this;
        },

        _createBoundingBox: function () {

            var geometry = new THREE.BoxGeometry(this.width, this.height, this.depth, 1, 1, 1);

            this.add(new THREE.Mesh(geometry, toRet.wireFrameMaterial));
        }

    });

    return toRet;
});