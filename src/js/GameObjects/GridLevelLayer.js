"use strict";

define(["THREE", "GridLevelSection", "noisejs", "GameObjectBase"],
    function (THREE, GridLevelSection, Noise, GameObjectBase) {

    var toRet = function (width, height, cellRadius, cellHeight, seed, continuity) {
        GameObjectBase.call(this);

        this.ud.width = width;
        this.ud.height = height;
        this.ud.cellRadius = cellRadius || 10;
        this.ud.cellHeight = cellHeight || 25;
        this.ud.seed = seed || 0;
        this.ud.continuity = continuity || 8.0;
    };

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        _createObject: function() {

            var object3D = new THREE.Object3D();
            var currentSection;
            var increment = null;
            var toSubtractX = null;
            var toSubtractZ = null;
            var noise = new Noise(this.ud.seed);

            for (var z = 0; z < this.ud.height; z++) {

                for (var x = 0; x < this.ud.width; x++) {

                    if (noise.simplex2(x / this.ud.continuity, z / this.ud.continuity) <= 0.0) {
                        continue;
                    }

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
                }
            }

            return object3D;
        }
    });

    return toRet;
});