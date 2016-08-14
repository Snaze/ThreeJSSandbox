"use strict";

define(["THREE", "GridLevelOctogon", "GridLevelSquare", "GameObjectBase"],
    function (THREE, GridLevelOctogon, GridLevelSquare, GameObjectBase) {

    var toRet = function (cellRadius, cellHeight) {
        GameObjectBase.call(this);

        this.ud.cellRadius = cellRadius || 10;
        this.ud.cellHeight = cellHeight || 25;

        this.topOctogon = null;
        this.topSquare = null;
        this.botOctogon = null;
        this.botSquare = null;

    };

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        _subInit: function () {
        },

        getHalfWidth: function () {
            return this.ud.cellRadius * Math.cos(22.5 * Math.PI / 180.0);
        },
        getHalfSquareDim: function () {
            return this.ud.cellRadius * Math.sin(22.5 * Math.PI / 180.0);
        },
        getIncrement: function () {
            return this.getHalfWidth() * 2.0 + this.getHalfSquareDim() * 2.0;
        },
        getHalfIncrement: function () {
            return this.getHalfWidth() + this.getHalfSquareDim();
        },
        _createObject: function() {

            var object3D = new THREE.Object3D();
            var halfWidth = this.getHalfWidth();
            var halfSquareDim = this.getHalfSquareDim();

            var squareDim = 2.0 * halfSquareDim;
            var halvesIncrement = halfWidth + halfSquareDim;

            this.topOctogon = new GridLevelOctogon(this.ud.cellRadius, this.ud.cellHeight).init();
            this.topSquare = new GridLevelSquare(squareDim, this.ud.cellHeight).init();

            this.topSquare.position.x = halvesIncrement;

            object3D.add(this.topOctogon);
            object3D.add(this.topSquare);

            this.botOctogon = new GridLevelOctogon(this.ud.cellRadius, this.ud.cellHeight).init();
            this.botOctogon.position.z = halvesIncrement;
            this.botOctogon.position.x = halvesIncrement;

            this.botSquare = new GridLevelSquare(squareDim, this.ud.cellHeight).init();
            this.botSquare.position.z = halvesIncrement;

            object3D.add(this.botSquare);
            object3D.add(this.botOctogon);

            var halfHalfInc = halvesIncrement / 2.0;

            this.topOctogon.position.x -= halfHalfInc;
            this.topOctogon.position.z -= halfHalfInc;

            this.topSquare.position.x -= halfHalfInc;
            this.topSquare.position.z -= halfHalfInc;

            this.botOctogon.position.x -= halfHalfInc;
            this.botOctogon.position.z -= halfHalfInc;

            this.botSquare.position.x -= halfHalfInc;
            this.botSquare.position.z -= halfHalfInc;

            // object3D.updateMatrix();
            // object3D.geometry.applyMatrix()
            // object3D.computeBoundingBox()

            return object3D;
        }
    });

    return toRet;
});