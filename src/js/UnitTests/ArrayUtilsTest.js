
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
    };

    return classToRet;
});

