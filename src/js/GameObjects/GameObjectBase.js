"use strict";

define(["THREE"], function (THREE) {
    var toRet = function () {
        THREE.Object3D.call(this);

    };

    toRet.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {

    });

    return toRet;
});