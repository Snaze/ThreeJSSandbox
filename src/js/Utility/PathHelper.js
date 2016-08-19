
define([], function () {
    "use strict";

    var pathHelper = function () {
    };

    pathHelper.PROJECT_NAME = "ThreeJSSandbox";

    pathHelper.absolutePath = function (semiAbsolutePath) {
        if (semiAbsolutePath[0] === "/") {
            semiAbsolutePath = semiAbsolutePath.substring(1);
        }

        return window.location.origin + "/" + pathHelper.PROJECT_NAME + "/" + semiAbsolutePath;
    };

    return pathHelper;
});
