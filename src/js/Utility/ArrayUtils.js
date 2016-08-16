/*
 * @author Sann-Remy Chea / http://srchea.com/
 * Generate a random terrain using the diamond-square algorithm
 */

define([], function () {
    "use strict";

    var arrayUtils = function () {
    };

    arrayUtils.flatten = function (array2d) {
        return [].concat.apply([], array2d);
    };

    arrayUtils.equals = function (array1, array2) {
        return array1.length == array2.length &&
            array1.every(function (this_i, i) {
                return this_i === array2[i]
            });
    };

    return arrayUtils;
});
