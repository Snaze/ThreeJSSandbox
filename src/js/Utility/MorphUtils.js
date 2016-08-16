

define(["morph", "util/ArrayUtils", "Immutable", "util/ImageBuffer"],
    function (Morph, ArrayUtils, Immutable, ImageBuffer) {
    "use strict";

    var morphUtils = function (array2D) {
        this.imageBuffer = new ImageBuffer(array2D);
        this.height = this.imageBuffer.height;
        this.width = this.imageBuffer.width;
    };

    morphUtils.prototype = {
        _findMinLabel: function (linked, currentLabel) {
            var temp = linked[currentLabel].first();

            if (temp === currentLabel) {
                return currentLabel;
            }

            return this._findMinLabel(linked, temp);
        },
        labelComponents: function () {

            // clear label space
            var toRet = new ImageBuffer(ArrayUtils.create2DArray(this.height, this.width));

            // Map<Integer, SortedSet<Integer>>
            var linked = {};

            // start with no objects
            var currentLabel = 0; // N
            var min;
            var currentSet; // SortedSet<Integer>
            var currentNeighborLabels; // SortedSet<Integer>
            var y, x;

            // label objects in a single sequential scan
            for (y = 0; y < this.height; y++) {

                for (x = 0; x < this.width; x++) {

                    try {
                        if (this.imageBuffer.getP(x, y, 0) != 0) {

                            if (toRet.allEqual(x, y, ImageBuffer.PASSED_INDEXES, 0)) {
                                currentLabel++;
                                currentSet = new Immutable.OrderedSet([currentLabel]);

                                linked[currentLabel] = currentSet;
                                toRet.setP0(x, y, currentLabel);
                            } else {
                                min = toRet.getPMin(x, y, ImageBuffer.PASSED_INDEXES, 0);
                                toRet.setP0(x, y, min);

                                currentNeighborLabels = toRet.getNeighborLabels(x, y, ImageBuffer.PASSED_INDEXES, 0);

                                currentNeighborLabels.forEach(function (i) {
                                    var orderedSet = linked[i];
                                    orderedSet = orderedSet.union(currentNeighborLabels);
                                    linked[i] = orderedSet;
                                });
                            }
                        }
                    } catch (ex) {
                        console.log(ex);
                        throw ex;
                    }
                }
            }

            var normalizedLabels = {};
            var nextLabel = 1;

            for (y = 0; y < this.height; y++) {

                for (x = 0; x < this.width; x++) {

                    currentLabel = toRet.getValue(x, y);
                    var p1Value = toRet.getP1(x, y);

                    if ((p1Value != 0) && (currentLabel != 0)) {
                        currentLabel = p1Value;
                        toRet.setValue(x, y, currentLabel);
                    }

                    if (currentLabel != 0) {
                        min = this._findMinLabel(linked, currentLabel);

                        if (min in normalizedLabels) {
                            toRet.setValue(x, y, normalizedLabels[min]);
                        } else {
                            normalizedLabels[min] = nextLabel;
                            toRet.setValue(x, y, nextLabel);
                            nextLabel++;
                        }
                    }
                }
            }

            return toRet.imageData;
        }
    };

    return morphUtils;
});
