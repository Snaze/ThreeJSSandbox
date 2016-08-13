"use strict";

define(["THREE", "Axes", "BoundingBox"], function (THREE, Axes, BoundingBox) {
    var toRet = function () {
        THREE.Object3D.call(this);

        this._innerObject3D = null;
        this._boundingBox = null;
        this._axes = null;

    };

    toRet.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        init: function () {
            this._innerObject3D = this._createObject();
            this.add(this._innerObject3D);

            var box = new THREE.Box3();
            box.setFromObject(this);

            var width = Math.abs(box.max.x - box.min.x);
            var height = Math.abs(box.max.y - box.min.y);
            var depth = Math.abs(box.max.z - box.min.z);

            this._boundingBox = this._createBoundingBox(width, height, depth);
            this._boundingBox.visible = false;
            this.add(this._boundingBox);

            this._axes = this._createAxes(width, height, depth);
            this._axes.visible = false;
            this.add(this._axes);

            return this;
        },
        setBoundingBoxVisible: function (visible) {
            this._boundingBox.visible = visible;
        },
        setAxesVisible: function (visible) {
            this._axes.visible = visible;
        },

        /**
         * This method should be used to create the main object
         * @private
         */
        _createObject: function () {
            throw new Error("This method is not implemented");
        },
        _createBoundingBox: function (width, height, depth) {
            return new BoundingBox(width, height, depth).init();
        },
        _createAxes: function (width, height, depth) {
            var size = Math.max(width, height, depth);

            return new Axes(size + 16).init();
        }
    });

    return toRet;
});