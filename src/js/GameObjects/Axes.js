"use strict";

define(["THREE", "GameObjectBase"], function (THREE, GameObjectBase) {
    var toRet = function (size) {
        GameObjectBase.call(this);

        this.size = size;

        this._createAxes();
    };

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        _createAxes: function () {

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

            this.add(xLine);
            this.add(yLine);
            this.add(zLine);
        }

    });

    return toRet;
});