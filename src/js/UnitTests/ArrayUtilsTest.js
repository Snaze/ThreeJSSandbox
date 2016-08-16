
define(["QUnit", "util/ArrayUtils"], function (QUnit, ArrayUtils) {
    "use strict";

    var classToRet = function () {

    };

    classToRet.run = function () {

        QUnit.test("equals", function (assert) {
            // SETUP
            var array1 = [1, 2, 3, 4, 5];
            var array2 = [1, 2, 3, 4, 5];
            var array3 = [1, 2, 3, 4, 6];
            var array4 = [1, 2, 3];

            // CALL
            var shouldEqual = ArrayUtils.equals(array1, array2);
            var shouldNotEqual = ArrayUtils.equals(array1, array3);
            var shouldNotEqual2 = ArrayUtils.equals(array1, array4);

            // ASSERT
            assert.ok(shouldEqual, "Passed!");
            assert.ok(!shouldNotEqual, "Passed!");
            assert.ok(!shouldNotEqual2, "Passed!");
        });

        QUnit.test("flatten", function (assert) {
            // SETUP
            var toFlatten = [[1, 2], [3, 4], [5]];
            var toFlatten2 = [[1, 2, 3], [4], [5]];

            // CALL
            var flatArray = ArrayUtils.flatten(toFlatten);
            var flatArray2 = ArrayUtils.flatten(toFlatten2);

            // ASSERT
            assert.ok(ArrayUtils.equals(flatArray, [1, 2, 3, 4, 5]), "Passed!");
            assert.ok(ArrayUtils.equals(flatArray2, [1, 2, 3, 4, 5]), "Passed!");
        });

        QUnit.test("reshape", function (assert) {
            // SETUP
            var toReshape = [1, 2, 3, 4];

            // CALL
            var reshaped = ArrayUtils.reshape(toReshape, 2, 2);

            // ASSERT
            assert.ok(ArrayUtils.equals(reshaped[0], [1, 2]), "Passed!");
            assert.ok(ArrayUtils.equals(reshaped[1], [3, 4]), "Passed!");
        });

        QUnit.test("addBorders", function (assert) {
            // SETUP
            var toReshape = [[1, 2, 3, 4], [5, 6, 7, 8]];

            // CALL
            var reshaped = ArrayUtils.addBorders(toReshape, 2);

            // ASSERT
            assert.ok(ArrayUtils.equals(reshaped[0], [0, 0, 0, 0, 0, 0, 0, 0]), "Passed!");
            assert.ok(ArrayUtils.equals(reshaped[1], [0, 0, 0, 0, 0, 0, 0, 0]), "Passed!");
            assert.ok(ArrayUtils.equals(reshaped[2], [0, 0, 1, 2, 3, 4, 0, 0]), "Passed!");
            assert.ok(ArrayUtils.equals(reshaped[3], [0, 0, 5, 6, 7, 8, 0, 0]), "Passed!");
            assert.ok(ArrayUtils.equals(reshaped[4], [0, 0, 0, 0, 0, 0, 0, 0]), "Passed!");
            assert.ok(ArrayUtils.equals(reshaped[5], [0, 0, 0, 0, 0, 0, 0, 0]), "Passed!");
        });

        QUnit.test("removeBorders", function (assert) {
            // SETUP
            var toReshape = [
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 2, 3, 4, 0, 0],
                    [0, 0, 5, 6, 7, 8, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0]];

            // CALL
            var reshaped = ArrayUtils.removeBorders(toReshape, 2);

            // ASSERT
            assert.ok(ArrayUtils.equals(reshaped[0], [1, 2, 3, 4]), "Passed!");
            assert.ok(ArrayUtils.equals(reshaped[1], [5, 6, 7, 8]), "Passed!");

        });


    };

    return classToRet;
});

