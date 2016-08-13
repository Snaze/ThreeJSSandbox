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
        _createObject: function() {

            var object3D = new THREE.Object3D();
            var sizingOctogon = new GridLevelOctogon(this.ud.cellRadius, this.ud.cellHeight).init();
            var octogonDimensions = sizingOctogon.getDims();

            var halfSquareDim = (octogonDimensions.x / 2.0) * Math.tan(22.5 * Math.PI / 180.0);
            var squareDim = 2.0 * halfSquareDim;

            this.topOctogon = new GridLevelOctogon(this.ud.cellRadius, this.ud.cellHeight).init();
            this.topSquare = new GridLevelSquare(squareDim, this.ud.cellHeight).init();

            this.topSquare.position.x = (octogonDimensions.x / 2.0) + halfSquareDim;

            object3D.add(this.topOctogon);
            object3D.add(this.topSquare);

            this.botOctogon = new GridLevelOctogon(this.ud.cellRadius, this.ud.cellHeight).init();
            this.botOctogon.position.z = (octogonDimensions.x / 2.0) + halfSquareDim;
            this.botOctogon.position.x = (octogonDimensions.x / 2.0) + halfSquareDim;

            this.botSquare = new GridLevelSquare(squareDim, this.ud.cellHeight).init();
            this.botSquare.position.z = (octogonDimensions.x / 2.0) + halfSquareDim;

            object3D.add(this.botSquare);
            object3D.add(this.botOctogon);

            return object3D;
        }
    });

    return toRet;
});