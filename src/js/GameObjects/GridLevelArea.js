"use strict";

define(["THREE", "GridLevelOctogon", "GridLevelSquare", "GameObjectBase", "GridLevelSection"],
    function (THREE, GridLevelOctogon, GridLevelSquare, GameObjectBase, GridLevelSection) {

    var toRet = function (width, height, cellRadius, cellHeight) {
        GameObjectBase.call(this);

        this.ud.width = width;
        this.ud.height = height;
        this.ud.cellRadius = cellRadius || 10;
        this.ud.cellHeight = cellHeight || 25;
        this.ud._gridSections = [];
    };

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        _createObject: function() {

            var object3D = new THREE.Object3D();
            var currentSection;
            var increment = null;
            var toSubtractX = null;
            var toSubtractZ = null;

            for (var z = 0; z < this.ud.height; z++) {

                this.ud._gridSections[z] = [];

                for (var x = 0; x < this.ud.width; x++) {

                    currentSection = new GridLevelSection(this.ud.cellRadius, this.ud.cellHeight).init();
                    object3D.add(currentSection);
                    if (null === increment) {
                        increment = currentSection.getIncrement();
                        var halfInc = currentSection.getHalfIncrement();
                        toSubtractX = ((increment * this.ud.width - 2 * halfInc) / 2.0);
                        toSubtractZ = ((increment * this.ud.height - 2 * halfInc) / 2.0);
                    }

                    currentSection.position.x = (x * increment) - toSubtractX;
                    currentSection.position.z = (z * increment) - toSubtractZ;

                    this.ud._gridSections[z][x] = currentSection;
                }
            }
            // var box = new THREE.Box3();
            // box.setFromObject(object3D);
            // var width = Math.abs(box.min.x - box.max.x);
            // var depth = Math.abs(box.min.z - box.max.z);

            // object3D.position.x -= width / 2.0;
            // object3D.position.z -= depth / 2.0;

            return object3D;
        }
    });

    return toRet;
});