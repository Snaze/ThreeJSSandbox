"use strict";

define(["THREE"], function (THREE) {
    var toRet = function (width, height, edgeVariation, numNurbPoints, extrudeHeight) {
        this.width = width;
        this.height = height;
        this.extrudeHeight = extrudeHeight || Math.max(width, height) / 10.0;
        this.edgeVariation = edgeVariation;
        this.numNurbPoints = numNurbPoints;
        this._object3D = null;
    };

    toRet.prototype = {
        getObject3D: function () {
            if (null === this._object3D) {
                this._object3D = this._createLevel();
            }

            return this._object3D;
        },
        _createLevel: function() {

            var theShape = new THREE.Shape();
            theShape.moveTo(0, 0);
            theShape.closed = true;
            var yInc = this.height / this.numNurbPoints;
            var xInc = this.width / this.numNurbPoints;

            // WALK AROUND A SQUARE WITH SOME VARIATION
            var x = 0, y = 0, cpx = 0, cpy = 0, currentY = 0, currentX = 0;
            for (y = yInc; y < this.height; y += yInc) {
                currentY = theShape.currentPoint.y;

                cpx = (Math.random() - 0.5) * this.edgeVariation + x;
                cpy = currentY + (y - currentY) / 2.0;

                // toRet.quadraticCurveTo(cpx, cpy, x, y);
                theShape.lineTo(cpx, y);
            }

            y = this.height;
            for (; x < this.width; x += xInc) {
                currentX = theShape.currentPoint.x;

                cpx = currentX + (x - currentX) / 2.0;
                cpy = (Math.random() - 0.5) * this.edgeVariation + y;

                // toRet.quadraticCurveTo(cpx, cpy, x, y);
                theShape.lineTo(x, cpy);
            }

            x = this.width;
            for (; y >= 0; y -= yInc) {
                currentY = theShape.currentPoint.y;

                cpx = (Math.random() - 0.5) * this.edgeVariation + x;
                cpy = currentY + (y - currentY) / 2.0;

                // toRet.quadraticCurveTo(cpx, cpy, x, y);
                theShape.lineTo(cpx, y);
            }

            y = 0;
            for (; x >= 0; x -= xInc) {
                currentX = theShape.currentPoint.x;

                cpx = currentX + (x - currentX) / 2.0;
                cpy = (Math.random() - 0.5) * this.edgeVariation + y;

                // toRet.quadraticCurveTo(cpx, cpy, x, y);
                theShape.lineTo(x, cpy);
            }

            // var path = new THREE.Path();
            // path.moveTo(0, 0);
            var extruded = theShape.extrude({amount: this.extrudeHeight});
            // var extruded = toRet;

            var material = new THREE.MeshLambertMaterial({color: 0x7A5230});
            var mesh = new THREE.Mesh(extruded, material);

            var toRet = new THREE.Object3D();
            toRet.add(mesh);
            mesh.position.x -= (this.width / 2.0);
            mesh.position.y -= (this.height / 2.0);
            mesh.position.z -= (this.extrudeHeight / 2.0);

            toRet.rotation.x -= 90.0 * Math.PI / 180.0;

            return toRet;

        }
    };

    return toRet;
});