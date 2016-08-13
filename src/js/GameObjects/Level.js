"use strict";

define(["THREE", "GameObjectBase"], function (THREE, GameObjectBase) {
    var toRet = function (radius, edgeVariation, numNurbPoints, extrudeHeight) {
        GameObjectBase.call(this);

        this.radius = radius;
        this.extrudeHeight = extrudeHeight || radius / 5.0;
        this.edgeVariation = edgeVariation;
        this.numNurbPoints = numNurbPoints;
    };

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        createImperfectCircle: function (numSteps, variation, theRadius) {
            var theShape = new THREE.Shape();

            theShape.moveTo(0, 0);
            theShape.closed = true;

            // theShape.quadraticCurveTo(cpx, cpy, x, y);

            var step = 360.0 / numSteps;  // amount to add to theta each time (degrees)
            var firstX = null;
            var firstY = null;

            for (var theta = 0.0; theta < 360.0; theta += step) {
                var radTheta = theta * Math.PI / 180.0
                var x = Math.random() * variation + theRadius * Math.cos(radTheta);
                var y = Math.random() * variation + theRadius * Math.sin(radTheta);
                if (null === firstX) {
                    firstX = x;
                }

                if (null === firstY) {
                    firstY = y;
                }

                theShape.lineTo(x, y);
            }
            theShape.lineTo(firstX, firstY);

            return theShape;
        },
        _createObject: function() {

            var theShape = this.createImperfectCircle(this.numNurbPoints, this.edgeVariation, this.radius);
            // var hole = this.createImperfectCircle(8.0, 2.0, 20);
            // theShape.holes.push(hole);

            // var path = new THREE.Path();
            // path.moveTo(0, 0);
            var extruded = theShape.extrude({amount: this.extrudeHeight});
            // var extruded = toRet;

            var material = new THREE.MeshLambertMaterial({color: 0x7A5230});
            var mesh = new THREE.Mesh(extruded, material);

            this.add(mesh);
            // mesh.position.x -= this.radius;
            // mesh.position.y -= this.radius;
            // mesh.position.z -= (this.extrudeHeight / 2.0);

            this.rotation.x -= 90.0 * Math.PI / 180.0;
        }
    });

    return toRet;
});