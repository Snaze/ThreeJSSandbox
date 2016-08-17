/*
 * @author Sann-Remy Chea / http://srchea.com/
 * Generate a random terrain using the diamond-square algorithm
 */

define([], function () {
    "use strict";

    var arrayUtils = function () {
    };

    arrayUtils.clone = function (array) {
        return array.slice(0);
    };

    arrayUtils.removeBorders = function (array2D, numCells) {
        var toRet = [];

        for (var i = numCells; i < array2D.length - numCells; i++) {
            toRet.push(array2D[i].slice(numCells, array2D[i].length - numCells));
        }

        return toRet;
    };

    arrayUtils.addBorders = function (array2D, numCells, value) {
        if (value === undefined) {
            value = 0;
        }

        var height = array2D.length;
        var width = array2D[0].length;
        var toRet = [];

        toRet.push(arrayUtils.createArray(numCells * 2 + width, value));
        toRet.push(arrayUtils.createArray(numCells * 2 + width, value));

        for (var i = 0; i < height; i++) {
            var toAdd = arrayUtils.clone(array2D[i]);

            for (var cell = 0; cell < numCells; cell++) {
                arrayUtils.insert(toAdd, 0, value);
                toAdd.push(value);
            }

            toRet.push(toAdd);
        }

        toRet.push(arrayUtils.createArray(numCells * 2 + width, value));
        toRet.push(arrayUtils.createArray(numCells * 2 + width, value));

        return toRet;
    };

    arrayUtils.insert = function (array, index, item) {
        array.splice(index, 0, item);
    };

    arrayUtils.flatten = function (array2d) {
        return [].concat.apply([], array2d);
    };

    arrayUtils.equals = function (array1, array2) {
        return array1.length == array2.length &&
            array1.every(function (this_i, i) {
                return this_i === array2[i];
            });
    };

    arrayUtils.log2D = function (array2D) {

        var theString = arrayUtils.convert2DArrayToString(array2D);
        console.log(theString);

    };

    arrayUtils.convert2DArrayToString = function (array2D) {
        var toRet = [];
        toRet.push("[");

        array2D.forEach(function (array) {
            toRet.push(array.toString());
        });

        toRet.push("]");

        return toRet.join("\n");
    };

    arrayUtils.reshape = function (flatArray, height, width) {
        var toRet = [];
        var index = 0;

        for (var row = 0; row < height; row++) {

            toRet[row] = [];

            for (var col = 0; col < width; col++) {

                toRet[row][col] = flatArray[index];
                index++;
            }
        }

        return toRet;
    };

    arrayUtils.createArray = function (length, initializationValue) {
        if (initializationValue === undefined) {
            initializationValue = 0;
        }

        var toRet = [];

        for (var i = 0; i < length; i++) {
            toRet.push(initializationValue);
        }

        return toRet;
    };

    arrayUtils.create2DArray = function (height, width, initializationValue) {
        if (initializationValue === undefined) {
            initializationValue = 0;
        }

        var toRet = [];

        for (var row = 0; row < height; row++) {

            toRet.push(this.createArray(width, initializationValue));
        }

        return toRet;
    };

    return arrayUtils;
});
