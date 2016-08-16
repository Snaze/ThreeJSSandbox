/*
 * @author Sann-Remy Chea / http://srchea.com/
 * Generate a random terrain using the diamond-square algorithm
 */

define(["morph", "util/ArrayUtils", "Immutable"], function (Morph, ArrayUtils, Immutable) {
    "use strict";

    var imageBuffer = function (array2D) {
        this.imageData = array2D;
        this.height = array2D.length;
        this.width = array2D[0].length;
    };

    imageBuffer.PASSED_INDEXES = [2, 3, 4, 5];

    imageBuffer.FUTURE_INDEXES = [6, 7, 8, 1];

    imageBuffer.ALL_BUT_MIDDLE = [1, 2, 3, 4, 5, 6, 7, 8];

    imageBuffer.prototype = {
        getValueWithCheck: function (x, y) {
            if (x < 0 || y < 0) {
                return 0;
            }

            if (this.imageData.length <= y) {
                return 0;
            }

            if (this.imageData[y].length <= x) {
                return 0;
            }

            return this.imageData[y][x];
        },
        getValue: function (x, y) {
            return this.getP0(x, y);
        },
        getP0: function (x, y) {
            return this.getValueWithCheck(x, y);
        },
        getP1: function (x, y) {
            return this.getValueWithCheck(x + 1, y);
        },
        getP2: function (x, y) {
            return this.getValueWithCheck(x + 1, y - 1);
        },
        getP3: function (x, y) {
            return this.getValueWithCheck(x, y - 1);
        },
        getP4: function (x, y) {
            return this.getValueWithCheck(x - 1, y - 1);
        },
        getP5: function (x, y) {
            return this.getValueWithCheck(x - 1, y);
        },
        getP6: function (x, y) {
            return this.getValueWithCheck(x - 1, y + 1);
        },
        getP7: function (x, y) {
            return this.getValueWithCheck(x, y + 1);
        },
        getP8: function (x, y) {
            return this.getValueWithCheck(x + 1, y + 1);
        },
        getP: function (x, y, pValue) {
            console.assert(pValue >= 0 && pValue <= 8);

            switch (pValue) {
                case 0:
                    return this.getP0(x, y);
                case 1:
                    return this.getP1(x, y);
                case 2:
                    return this.getP2(x, y);
                case 3:
                    return this.getP3(x, y);
                case 4:
                    return this.getP4(x, y);
                case 5:
                    return this.getP5(x, y);
                case 6:
                    return this.getP6(x, y);
                case 7:
                    return this.getP7(x, y);
                case 8:
                    return this.getP8(x, y);
                default:
                    throw new Error("You should never get here");
            }

            return 0;
        },
        allEqual: function (x, y, indices, value) {
            var current;
            var self = this;
            var toRet = true;

            indices.forEach(function (index) {
                current = self.getP(x, y, index);

                if (current != value) {
                    toRet = false;
                }
            });

            return toRet;
        },
        setValue: function (x, y, value) {
            this.setP0(x, y, value);
        },
        setP0: function (x, y, value) {
            console.assert(x >= 0 && y >= 0);

            this.imageData[y][x] = value;
        },
        getPMin: function (x, y, indices, above) {
            console.assert (indices.length > 0);

            var min = 100000000;
            var current;
            var self = this;

            indices.forEach(function (index) {
                current = self.getP(x, y, index);

                if (min > current && current > above) {
                    min = current;
                }
            });

            return min;
        },
        getNeighborLabels: function (x, y, indices, above) {
            var toRet = [];
            var currentValue;
            var self = this;

            indices.forEach(function (index) {
                currentValue = self.getP(x, y, index);

                if (currentValue > above) {
                    toRet.push(currentValue);
                }
            });

            return new Immutable.OrderedSet(toRet);
        }
    };

    return imageBuffer;
});
