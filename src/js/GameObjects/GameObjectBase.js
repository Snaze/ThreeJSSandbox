"use strict";

define(["THREE", "Axes", "BoundingBox"], function (THREE, Axes, BoundingBox) {
    var toRet = function () {
        THREE.Object3D.call(this);

        this._innerObject3D = null;
        this._boundingBox = null;
        this._boundingBox3 = null;
        this._boundingBoxDimensions = null;
        this._axes = null;
        this.ud = this.userData;

    };

    toRet.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        init: function () {
            this._subInit();

            this._innerObject3D = this._createObject();
            this.add(this._innerObject3D);

            // I want to create the bounding box buffer adding the axes because
            // the axes make the bounding box too big.
            var dims = this.getDims();

            this._boundingBox = this._createBoundingBox(dims.x, dims.y, dims.z);
            this._boundingBox.visible = false;
            this.add(this._boundingBox);

            return this;
        },

        getBoundingBox3: function () {
            if (null === this._boundingBox3) {
                this._boundingBox3 = new THREE.Box3();
                this._boundingBox3.setFromObject(this);
            }

            return this._boundingBox3;
        },
        getDims: function () {
            if (null === this._boundingBoxDimensions) {
                var box = this.getBoundingBox3();

                var width = Math.abs(box.max.x - box.min.x);
                var height = Math.abs(box.max.y - box.min.y);
                var depth = Math.abs(box.max.z - box.min.z);

                this._boundingBoxDimensions = new THREE.Vector3(width, height, depth);
            }

            return this._boundingBoxDimensions;
        },
        setBoundingBoxVisible: function (visible, recursive) {
            this._boundingBox.visible = visible;

            if (recursive) {
                this.traverse(function (child) {
                    if (child instanceof toRet) {
                        child.setBoundingBoxVisible(visible, false);
                    }
                });
            }
        },
        setAxesVisible: function (visible, recursive) {
            if (this._axes === null) {
                var dims = this.getDims();

                this._axes = this._createAxes(dims.x, dims.y, dims.z);
                this._axes.visible = false;
                this.add(this._axes);
            }

            this._axes.visible = visible;

            if (recursive) {
                this.traverse(function (child) {
                    if (child instanceof toRet) {
                        child.setAxesVisible(visible, false);
                    }
                });
            }
        },

        /**
         * This method should be used to create the main object
         * @private
         */
        _createObject: function () {
            throw new Error("This method is not implemented");
        },
        _subInit: function () {
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