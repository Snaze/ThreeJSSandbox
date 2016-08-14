define(["THREE", "GameObjectBase", "xor4096"],
    function (THREE, GameObjectBase, xor4096) {
        'use strict';

        var objClassToRet = function (numSplits, radius, displacementScale, seed, extrudeHeight) {
            GameObjectBase.call(this);

            this.ud.numSplits = numSplits || 10.0;
            this.ud.displacementScale = displacementScale || 10.0;
            this.ud.seed = seed || 7.0;
            this.ud.radius = radius || 10.0;
            this.ud.extrudeHeight = extrudeHeight || 20.0;
            this.xorRandom = null;
        };

        objClassToRet.shapeMaterial = new THREE.MeshLambertMaterial({color: 0x008800 });

        objClassToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
            _createObject: function () {
                var toRet = new THREE.Object3D();

                var theShape = this._createImperfectCircle(this.ud.numSplits, this.ud.displacementScale, this.ud.radius);

                var extruded = theShape.extrude({amount: this.ud.extrudeHeight, bevelEnabled: false});

                var mesh = new THREE.Mesh(extruded, objClassToRet.shapeMaterial);

                toRet.add(mesh);

                mesh.rotation.x -= 90.0 * Math.PI / 180.0;
                mesh.position.y -= this.ud.extrudeHeight / 2.0;

                return toRet;
            },
            _getXorRandom: function () {
                if (null === this.xorRandom) {
                    this.xorRandom = new xor4096(this.ud.seed);
                }

                return this.xorRandom;
            },
            _subInit: function () {
            },
            _createImperfectCircle: function (numSteps, variation, theRadius) {
                var theShape = new THREE.Shape();

                theShape.moveTo(0, 0);
                theShape.closed = true;

                // theShape.quadraticCurveTo(cpx, cpy, x, y);

                var step = 360.0 / numSteps;  // amount to add to theta each time (degrees)
                var firstPoint = null;

                for (var theta = 0.0; theta < 360.0; theta += step) {
                    var radTheta = theta * Math.PI / 180.0
                    var x = this._getXorRandom()() * variation + theRadius * Math.cos(radTheta);
                    var y = this._getXorRandom()() * variation + theRadius * Math.sin(radTheta);
                    var currentPoint = new THREE.Vector2(x, y);

                    if (null === firstPoint) {
                        firstPoint = currentPoint;
                    }

                    theShape.lineTo(currentPoint.x, currentPoint.y);
                }
                theShape.lineTo(firstPoint.x, firstPoint.y);

                return theShape;
            },
            _createOneSideOfPath: function (point1, point2, splitNum) {
                if (splitNum === undefined) {
                    splitNum = 0;
                }

                if (splitNum === this.ud.numSplits) {
                    return [point1, point2];
                }

                var nextX = (point1.x + point2.x) / 2.0;
                var randomValue = this._getXorRandom()();
                var displacement = (randomValue * this.ud.displacementScale);
                var nextY = ((point1.y + point2.y) / 2.0) + displacement;

                var toRet = [];
                var nextMidPoint = new THREE.Vector2(nextX, nextY);

                toRet = toRet.concat(this._createOneSideOfPath(point1, nextMidPoint, splitNum + 1));
                toRet.push(this._createOneSideOfPath(nextMidPoint, point2, splitNum + 1)[1]);

                return toRet;
            }
        });

        return objClassToRet;
    });