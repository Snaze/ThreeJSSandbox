

define(["THREE", "cannon"], function (THREE, CANNON) {
    "use strict";

    var toRet = function () {
        THREE.Mesh.call(this);


    };

    toRet.prototype = Object.assign(Object.create(THREE.Mesh.prototype), {

    });

    return toRet;
});