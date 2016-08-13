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
    };

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        _createObject: function() {

            var object3D = new THREE.Object3D();
            var currentOctogon = null;
            var currentSquare = null;
            var currentZPosition;

            for (var z = 0; z < this.height; z++) {

                this._grid[z] = [];
                this._gridSquares[z] = [];

                currentZPosition = z * 2 * this.cellRadius;

                for (var x = 0; x < this.width; x++) {

                    currentOctogon = new GridLevelOctogon(this.cellRadius, this.cellHeight).init();

                    this._grid[z][x] = currentOctogon;
                    object3D.add(currentOctogon);
                    if (z % 2 == 1) {
                        currentOctogon.position.x = this.cellRadius + x * 2 * this.cellRadius;
                    } else  {
                        currentOctogon.position.x = x * 2 * this.cellRadius;
                    }

                    currentOctogon.position.z = currentZPosition;
                }
            }

            return object3D;
        }
    });

    return toRet;
});