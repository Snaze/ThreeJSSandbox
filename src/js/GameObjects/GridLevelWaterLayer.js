"use strict";

define(["THREE", "GridLevelSection", "noisejs", "GameObjectBase", "morph"],
    function (THREE, GridLevelSection, Noise, GameObjectBase, Morph) {

        var classToRet = function (width, height, cellRadius, cellHeight, seed, continuity, numLevels) {
            GameObjectBase.call(this);

            this.ud.width = width;
            this.ud.height = height;
            this.ud.cellRadius = cellRadius || 10;
            this.ud.cellHeight = cellHeight || 25;
            this.ud.seed = seed || 0;
            this.ud.continuity = continuity || 8.0;
            this.ud.numLevels = numLevels || 6;

            console.assert(width > 0);
            console.assert(height > 0);

        };

        classToRet.SPACE = -1;
        classToRet.MIN_VALUE = 0.0;
        classToRet.MAX_VALUE = 2.0;

        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
            _subInit: function () {

            },

            _createObject: function () {

                var object3D = new THREE.Object3D();
                var currentSection;
                var increment = null;
                var toSubtractX = null;
                var toSubtractZ = null;
                var noise = new Noise(this.ud.seed);

                for (var z = 0; z < this.ud.height; z++) {

                    for (var x = 0; x < this.ud.width; x++) {

                        var simplexValue = noise.simplex2(x / this.ud.continuity, z / this.ud.continuity);
                        var discreteSimplexValue = this.ud.numLevels; //Math.floor(simplexValue * this.ud.numLevels);;

                        if (simplexValue <= 0.0) {
                            // discreteSimplexValue = this.ud.numLevels + Math.floor(simplexValue * this.ud.numLevels);
                            // discreteSimplexValue = Math.max(discreteSimplexValue, this.ud.numLevels - 2);
                            continue;
                        }

                        // console.assert (discreteSimplexValue >= 0 && discreteSimplexValue <= this.ud.numLevels);
                        var levelHeight = this.ud.cellHeight * (discreteSimplexValue + 1);

                        currentSection = new GridLevelSection(this.ud.cellRadius, levelHeight).init();
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

        return classToRet;
    });