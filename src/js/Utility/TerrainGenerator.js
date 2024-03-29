/*
 * @author Sann-Remy Chea / http://srchea.com/
 * Generate a random terrain using the diamond-square algorithm
 */

define([], function () {
    "use strict";

    var toRetClass = function(width, height, segments, smoothingFactor) {
        this.width = width;
        this.height = height;
        this.segments = segments;
        this.smoothingFactor = smoothingFactor;

        this.terrain = [];
    };

    toRetClass.prototype = {

        // internal functions
        _init: function() {
            this.terrain = [];

            for(var i = 0; i <= this.segments; i++) {
                this.terrain[i] = [];

                for(var j = 0; j <= this.segments; j++) {
                    this.terrain[i][j] = 0;
                }
            }
        },

        diamondSquare: function() {
            this._init();

            var x, y, average;

            var size = this.segments+1;

            for(var length = this.segments; length >= 2; length /= 2) {

                var half = length / 2;
                this.smoothingFactor /= 2;

                // generate the new square values
                for(x = 0; x < this.segments; x += length) {

                    for(y = 0; y < this.segments; y += length) {

                        average = this.terrain[x][y] + // top left
                            this.terrain[x + length][y] + // top right
                            this.terrain[x][y + length] + // lower left
                            this.terrain[x + length][y + length]; // lower right
                        average /= 4;
                        average += 2 * this.smoothingFactor * Math.random() - this.smoothingFactor;

                        this.terrain[x + half][y + half] = average;
                    }
                }

                // generate the diamond values
                for(x = 0; x < this.segments; x += half) {

                    for(y = (x + half) % length; y < this.segments; y += length) {

                        average = this.terrain[(x - half + size) % size][y]+ // middle left
                            this.terrain[(x + half) % size][y]+ // middle right
                            this.terrain[x][(y + half) % size]+ // middle top
                            this.terrain[x][(y - half + size) % size]; // middle bottom
                        average /= 4;
                        average += 2 * this.smoothingFactor * Math.random() - this.smoothingFactor;

                        this.terrain[x][y] = average;

                        // values on the top and right edges
                        if(x === 0) {
                            this.terrain[this.segments][y] = average;
                        }

                        if(y === 0) {
                            this.terrain[x][this.segments] = average;
                        }
                    }
                }
            }

            return this.terrain;
        }
    };

    return toRetClass;
});
