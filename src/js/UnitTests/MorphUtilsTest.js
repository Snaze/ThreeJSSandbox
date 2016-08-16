
define(["QUnit", "util/MorphUtils", "util/ArrayUtils"], function (QUnit, MorphUtils, ArrayUtils) {
    "use strict";

    var classToRet = function () {

    };

    classToRet.run = function () {
        QUnit.test("hello test", function (assert) {
            assert.ok(1 == "1", "Passed!");
        });

        QUnit.test("labelComponents", function (assert) {
            // SETUP

            var toLabel = [[1, 1, 0, 0],
                           [1, 1, 0, 0],
                           [0, 0, 0, 0],
                           [0, 0, 1, 1]];
            var morph = new MorphUtils(toLabel);

            // CALL
            var labeled = morph.labelComponents(toLabel);

            // ASSERT
            assert.ok(ArrayUtils.equals(labeled[0], [1, 1, 0, 0]));
            assert.ok(ArrayUtils.equals(labeled[1], [1, 1, 0, 0]));
            assert.ok(ArrayUtils.equals(labeled[2], [0, 0, 0, 0]));
            assert.ok(ArrayUtils.equals(labeled[3], [0, 0, 2, 2]));
        });

        QUnit.test("complicatedLabelComponents", function (assert) {
            // SETUP

            var toLabel = [ [1, 1, 0, 0, 1, 1],
                            [1, 1, 0, 0, 1, 1],
                            [0, 0, 0, 0, 1, 1],
                            [1, 0, 1, 1, 1, 1],
                            [0, 0, 0, 0, 0, 0]];
            var morph = new MorphUtils(toLabel);

            // CALL
            var labeled = morph.labelComponents(toLabel);

            // ASSERT
            assert.ok(ArrayUtils.equals(labeled[0], [1, 1, 0, 0, 2, 2]));
            assert.ok(ArrayUtils.equals(labeled[1], [1, 1, 0, 0, 2, 2]));
            assert.ok(ArrayUtils.equals(labeled[2], [0, 0, 0, 0, 2, 2]));
            assert.ok(ArrayUtils.equals(labeled[3], [3, 0, 2, 2, 2, 2]));
        });

        QUnit.test("reallyComplicatedLabelComponents", function (assert) {
            // SETUP
            var toLabel = [
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 1, 0, 0, 1],
                [1, 0, 1, 1, 1, 1, 0, 1],
                [1, 0, 1, 1, 1, 1, 0, 1],
                [1, 0, 0, 1, 1, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]];
            var morph = new MorphUtils(toLabel);

            // CALL
            var labeled = morph.labelComponents(toLabel);

            // ASSERT
            assert.ok(ArrayUtils.equals(labeled[0], [1, 1, 1, 1, 1, 1, 1, 1]));
            assert.ok(ArrayUtils.equals(labeled[1], [1, 0, 0, 0, 0, 0, 0, 1]));
            assert.ok(ArrayUtils.equals(labeled[2], [1, 0, 0, 2, 2, 0, 0, 1]));
            assert.ok(ArrayUtils.equals(labeled[3], [1, 0, 2, 2, 2, 2, 0, 1]));
            assert.ok(ArrayUtils.equals(labeled[4], [1, 0, 2, 2, 2, 2, 0, 1]));
            assert.ok(ArrayUtils.equals(labeled[5], [1, 0, 0, 2, 2, 0, 0, 1]));
            assert.ok(ArrayUtils.equals(labeled[6], [1, 0, 0, 0, 0, 0, 0, 1]));
            assert.ok(ArrayUtils.equals(labeled[7], [1, 1, 1, 1, 1, 1, 1, 1]));
        });
    };

    return classToRet;
});

