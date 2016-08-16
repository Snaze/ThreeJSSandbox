
define(["QUnit", "util/MorphUtils", "util/ArrayUtils"], function (QUnit, MorphUtils, ArrayUtils) {
    "use strict";

    var classToRet = function () {

    };

    classToRet.run = function () {
        QUnit.test("hello test", function (assert) {
            assert.ok(1 == "1", "Passed!");
        });


    };

    return classToRet;
});

