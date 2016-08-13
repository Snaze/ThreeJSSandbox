"use strict";

define(["THREE", "GridLevelOctogon", "GridLevelSquare", "GameObjectBase"],
    function (THREE, GridLevelOctogon, GridLevelSquare, GameObjectBase) {

    var toRet = function (width, height, cellRadius, cellHeight) {
        GameObjectBase.call(this);

        this.width = width;
        this.height = height;
        this.cellRadius = cellRadius || 10;
        this.cellHeight = cellHeight || 25;
        this._grid = [];
        this._gridSquares = [];
        this._object3D = null;
        this._separationDistance = null;
    };

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        getObject3D: function () {
            if (null === this._object3D) {
                this._object3D = this._createObject3D();
            }

            return this._object3D;
        },
        getSeparationDistance: function () {
            if (null === this._separationDistance) {
                var axis = new THREE.Vector3(0, 1, 0);

                var xVector = new THREE.Vector3(this.cellRadius, 0, 0);
                var angle = (45.0 + 22.5) * Math.PI / 180.0;
                xVector.applyAxisAngle(axis, angle);

                // var yVector = new THREE.Vector3(this.cellRadius, 0, 0);
                // angle = (22.5) * Math.PI / 180.0;
                // yVector.applyAxisAngle(axis, angle);

                this._separationDistance = xVector.y;
            }

            // return this._separationDistance;
            return 0;
        },
        _createObject3D: function() {

            var toRet = new THREE.Object3D();
            var currentOctogon = null;
            var currentSquare = null;
            var currentZPosition;

            for (var z = 0; z < this.height; z++) {

                this._grid[z] = [];
                this._gridSquares[z] = [];

                currentZPosition = z * 2 * this.cellRadius;

                for (var x = 0; x < this.width; x++) {

                    currentOctogon = new GridLevelOctogon(this.cellRadius, this.cellHeight);

                    this._grid[z][x] = currentOctogon;
                    toRet.add(currentOctogon.getObject3D());
                    if (z % 2 == 1) {
                        currentOctogon.getObject3D().position.x = this.cellRadius + x * 2 * this.cellRadius;
                    } else  {
                        currentOctogon.getObject3D().position.x = x * 2 * this.cellRadius;
                    }
                    currentOctogon.getObject3D().position.z = currentZPosition;

                    // if ((z !== this.height - 1) && (x !== this.width - 1)) {
                    //     currentSquare = new GridLevelOctogon(this.cellRadius, this.cellHeight);
                    //     this._gridSquares[z][x] = currentSquare;
                    //     toRet.add(currentSquare.getObject3D());
                    //     // currentSquare.getObject3D().rotation.y = 45.0 * Math.PI / 180.0;
                    //     currentSquare.getObject3D().position.x = (x * 2 * this.cellRadius) + this.cellRadius;
                    //     currentSquare.getObject3D().position.z = currentZPosition + this.cellRadius;
                    // }
                }
            }

            return toRet;

        }
    });

    return toRet;
});