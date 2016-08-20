"use strict";

define(["THREE", "Axes", "cannon", "util/TrimeshCreator"], function (THREE, Axes, CANNON, TrimeshCreator) {
    var toRet = function () {
        THREE.Object3D.call(this);

        this._innerObject3D = null;
        this._boundingBox = null;
        this._axes = null;
        this.ud = this.userData;

        this.physicsBody = null;
        this.rotationEuler = new THREE.Euler();
        this.physicsBodyPositionOffset = new THREE.Vector3(0, 0, 0);
        this.physicsBodyEulerOffset = new THREE.Euler(0, 0, 0);
        this._physicsBodyQuaternionOffset = new THREE.Quaternion(0, 0, 0, 0);
        this._tempQuaternion = new THREE.Quaternion(0, 0, 0, 0);
    };

    toRet.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
        init: function () {
            this._subInit();

            this._innerObject3D = this._createObject();
            this.add(this._innerObject3D);

            // I want to create the bounding box buffer adding the axes because
            // the axes make the bounding box too big.
            var helper = new THREE.BoundingBoxHelper(this, 0xFF0000);
            helper.update();

            this._boundingBox = helper;
            this._boundingBox.visible = false;
            this.add(this._boundingBox);

            return this;
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

        update: function (deltaTime, actualTime) {

            if (!this._innerObject3D) {
                return;
            }

            var physicsBody = this._getPhysicsBody();
            if (physicsBody) {
                // Rotate
                if (this._physicsBodyQuaternionOffset) {
                    this._physicsBodyQuaternionOffset.setFromEuler(this.physicsBodyEulerOffset);
                    this._tempQuaternion.copy(physicsBody.quaternion);
                    this._tempQuaternion.multiply(this._physicsBodyQuaternionOffset.inverse());

                    this.quaternion.copy(this._tempQuaternion);
                } else {
                    this.quaternion.copy(physicsBody.quaternion);
                }

                // Transform
                if (this.physicsBodyPositionOffset) {
                    this.position.set(physicsBody.position.x - this.physicsBodyPositionOffset.x,
                        physicsBody.position.y - this.physicsBodyPositionOffset.y,
                        physicsBody.position.z - this.physicsBodyPositionOffset.z);
                } else {
                    this.position.copy(physicsBody.position);
                }
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
        _getPhysicsBody: function () {
            if (this._isPhysicsObject()) {
                throw new Error("You need to implement this in your subclass");
            }

            return null;
        },
        _createAxes: function (width, height, depth) {
            var size = Math.max(width, height, depth);

            return new Axes(size + 16).init();
        },
        addPhysicsBodyToWorld: function (world) {
            var physicsBody = this._getPhysicsBody();
            if (physicsBody) {
                world.add(physicsBody);
            }
        },
        _isPhysicsObject: function () {
            return false;
        },
        _getPhysicsXDiff: function () {
            return 0;
        },
        _getPhysicsYDiff: function () {
            return 0;
        },
        _getPhysicsZDiff: function () {
            return 0;
        },
        _getNumPhysicsMeshSubDivisions: function () {
            return 0;
        },
        _getMass: function () {
            return 0;
        },
        getPosition: function () {
            if (this._isPhysicsObject()) {
                return this._getPhysicsBody().position;
            }

            return this.position;
        },
        setPosition: function (x, y, z) {

            if (this._isPhysicsObject()) {
                var body = this._getPhysicsBody();
                body.position.set(x, y, z);
            } else {
                this.position.set(x, y, z);
            }
        },
        setRotation: function (x, y, z, order) {
            this.rotationEuler.set(x, y, z, order);

            if (this._isPhysicsObject()) {
                this._getPhysicsBody().quaternion.setFromEuler(x, y, z, order);
            } else {
                this.quaternion.setFromEuler(x, y, z, order);
            }
        },
        getRotation: function () {
            if (this._isPhysicsObject()) {
                var physicsBody = this._getPhysicsBody();
                this.rotationEuler.setFromQuaternion(physicsBody.quaternion);
            } else {
                this.rotationEuler.setFromQuaternion(this.quaternion);
            }

            return this.rotationEuler;
        },
        incrementPosition: function (deltaX, deltaY, deltaZ) {
            if (this._isPhysicsObject()) {
                var currentPosition = this.getPosition();
                this.setPosition(currentPosition.x + deltaX,
                    currentPosition.y + deltaY, currentPosition.z + deltaZ);
            } else {
                this.position.set(this.position.x + deltaX,
                    this.position.y + deltaY, this.position.z + deltaZ);
            }
        }
    });

    return toRet;
});