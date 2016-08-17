"use strict";

define(["THREE"], function (THREE) {

    var classToRet = function () {
        THREE.LoadingManager.call(this);

    };


    classToRet.prototype = Object.assign(Object.create(THREE.LoadingManager.prototype), {
        onProgress: function ( item, loaded, total ) {

            console.log( item, loaded, total );
        },

        onError: function ( xhr ) {
            console.log( "onError: " + xhr );
        }
    });

    return classToRet;
});