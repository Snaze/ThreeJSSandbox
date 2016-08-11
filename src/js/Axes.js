"use strict";

define(["THREE"], function (THREE) {
    var toRet = function (size) {
        this.size = size;
        this._object3D = null;
    };

    toRet.prototype = {
        getObject3D: function () {
            if (null === this._object3D) {
                this._object3D = this._createAxes();
            }

            return this._object3D;
        },
        _createAxes: function () {
            var toRet = new THREE.Object3D();

            var xMaterial = new THREE.LineBasicMaterial({
                color: 0xFF0000 // R
            });

            var yMaterial = new THREE.LineBasicMaterial({
                color: 0x00FF00 // G
            });

            var zMaterial = new THREE.LineBasicMaterial({
                color: 0x0000FF // B
            });

            var xGeom = new THREE.Geometry();
            xGeom.vertices.push(new THREE.Vector3(0, 0, 0));
            xGeom.vertices.push(new THREE.Vector3(this.size, 0, 0));

            var yGeom = new THREE.Geometry();
            yGeom.vertices.push(new THREE.Vector3(0, 0, 0));
            yGeom.vertices.push(new THREE.Vector3(0, this.size, 0));

            var zGeom = new THREE.Geometry();
            zGeom.vertices.push(new THREE.Vector3(0, 0, 0));
            zGeom.vertices.push(new THREE.Vector3(0, 0, this.size));

            var xLine = new THREE.Line(xGeom, xMaterial);
            var yLine = new THREE.Line(yGeom, yMaterial);
            var zLine = new THREE.Line(zGeom, zMaterial);

            toRet.add(xLine);
            toRet.add(yLine);
            toRet.add(zLine);

            return toRet;
        }

    };

    return toRet;
});