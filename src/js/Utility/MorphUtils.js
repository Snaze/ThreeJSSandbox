/*
 * @author Sann-Remy Chea / http://srchea.com/
 * Generate a random terrain using the diamond-square algorithm
 */

define(["morph"], function (Morph) {
    "use strict";

    var morphUtils = function () {
    };

    morphUtils.labelComponents = function (array2d) {
        var height = array_2d.length;
        var width = array2d[0].length;

        var morph = new Morph(5, 5, [0, 0, 1, 1, 1,
            0, 0, 1, 1, 1,
            1, 0, 0, 0, 0,
            1, 1, 1, 0, 0,
            1, 1, 1, 1, 1]);
    };

    return morphUtils;
});
