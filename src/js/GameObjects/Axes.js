"use strict";

define(["THREE"], function (THREE) {
    var toRet = function (size) {
        THREE.Object3D.call(this);

        this.size = size;
    };

    toRet.xMaterial = new THREE.LineBasicMaterial({
        color: 0xFF0000 // R
    });

    toRet.yMaterial = new THREE.LineBasicMaterial({
        color: 0x00FF00 // G
    });

    toRet.zMaterial = new THREE.LineBasicMaterial({
        color: 0x0000FF // B
    });

    toRet.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        init: function () {
            this._createAxes();
            return this;
        },

        _createAxes: function () {

            var xGeom = new THREE.Geometry();
            xGeom.vertices.push(new THREE.Vector3(0, 0, 0));
            xGeom.vertices.push(new THREE.Vector3(this.size, 0, 0));

            var yGeom = new THREE.Geometry();
            yGeom.vertices.push(new THREE.Vector3(0, 0, 0));
            yGeom.vertices.push(new THREE.Vector3(0, this.size, 0));

            var zGeom = new THREE.Geometry();
            zGeom.vertices.push(new THREE.Vector3(0, 0, 0));
            zGeom.vertices.push(new THREE.Vector3(0, 0, this.size));

            var xLine = new THREE.Line(xGeom, toRet.xMaterial);
            var yLine = new THREE.Line(yGeom, toRet.yMaterial);
            var zLine = new THREE.Line(zGeom, toRet.zMaterial);

            this.add(xLine);
            this.add(yLine);
            this.add(zLine);
        }

    });

    return toRet;
});