"use strict";

define(["THREE",
        "GameObjectBase",
        "util/ArrayUtils",
        "cannon",
        "util/Console",
        "util/ControlHelper",
        "util/Window",
        "web/ModalDialog"],
    function (THREE,
              GameObjectBase,
              ArrayUtils,
              CANNON,
              console,
              ControlHelper,
              window,
              ModalDialog) {

        var classToRet = function (speed) {
            GameObjectBase.call(this);

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.up.set(0, 1, 0);
            this.verticalObject3D = null;
            this.controlHelper = new ControlHelper();

            this.displacementVector = new THREE.Vector3(0, 0, 0);
            this.horizontalQuaternion = new THREE.Quaternion();
            this.horizontalEuler = new THREE.Euler();
            this.speed = speed || 50;
            this.modalDialog = null;
        };

        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {

            _modalDialogClosed: function (theDialog) {
                this.controlHelper.bindEvents($.proxy(this._unBindControls, this));
            },

            _subInit: function () {
                this.modalDialog = new ModalDialog("Get Ready to Play!",
                                                    "W = Forward<br/>" +
                                                    "S = Back<br/>" +
                                                    "A = Left<br/>" +
                                                    "D = Right<br/>" +
                                                    "SPACE = Jump<br/>" +
                                                    "Right-Click = Use<br/>" +
                                                    "Left-Click = Shoot<br/>" +
                                                    "<br/>" +
                                                    "<br/>" +
                                                    "Click the button below to play!",
                                                    $.proxy(this._modalDialogClosed, this));

                this.modalDialog.open();
            },

            _unBindControls: function () {
                this.controlHelper.unbindEvents();
                this.modalDialog.open();
            },

            _createObject: function () {

                var object3D = new THREE.Object3D();

                var shape = new THREE.BoxGeometry(2, 8, 1, 1, 1, 1);
                var material = new THREE.MeshLambertMaterial({color: 0x00FF0F});
                var mesh = new THREE.Mesh(shape, material);
                shape.center();

                if (this.camera) {
                    this.verticalObject3D = new THREE.Object3D();
                    this.verticalObject3D.position.set(0, 7.5, 0);
                    this.verticalObject3D.add(this.camera);
                    object3D.add(this.verticalObject3D);
                }

                object3D.add(mesh);

                return object3D;
            },
            _setDisplacementVector: function () {

                this.displacementVector.set(0, 0, 0);

                if (this.controlHelper.state.forward) {
                    this.displacementVector.z += -1.0;
                }

                if (this.controlHelper.state.back) {
                    this.displacementVector.z += 1.0;
                }

                if (this.controlHelper.state.left) {
                    this.displacementVector.x += -1.0;
                }

                if (this.controlHelper.state.right) {
                    this.displacementVector.x += 1.0;
                }

                return this.displacementVector.normalize().multiplyScalar(this.speed);
            },
            _setHorizontalRotation: function () {

                // This is a bad name "mouseDeltaX".  I don't think it's really a delta
                var toSet = (this.controlHelper.state.mouseDeltaX % 360) * Math.PI / 180.0;
                this.horizontalEuler.set(0, toSet, 0);
                this.horizontalQuaternion.setFromEuler(this.horizontalEuler);
            },
            _getVerticalRotationAngleRadians: function () {

                return (this.controlHelper.state.mouseDeltaY % 180) * Math.PI / 180.0;

            },
            update: function (deltaTime, actualTime) {
                // GameObjectBase.prototype.update.call(this, deltaTime, actualTime);

                if (!this._innerObject3D) {
                    return;
                }

                var physicsBody = this._getPhysicsBody();
                if (physicsBody) {
                    this._setDisplacementVector();
                    this._setHorizontalRotation();

                    // this.setRotation(0, -1.0 * Math.PI / 180.0, 0);

                    this._getPhysicsBody().velocity.set(this.displacementVector.x * 10,
                        this.displacementVector.y * 10, this.displacementVector.z * 10);

                    if (this.physicsBodyPositionOffset) {
                        this.position.set(physicsBody.position.x - this.physicsBodyPositionOffset.x,
                                            physicsBody.position.y - this.physicsBodyPositionOffset.y,
                                            physicsBody.position.z - this.physicsBodyPositionOffset.z);
                    } else {
                        this.position.copy(physicsBody.position);
                    }

                    this.quaternion.copy(this.horizontalQuaternion);
                }


            },
            _isPhysicsObject: function () {
                return true;
            },
            _getPhysicsBody: function () {
                if (null === this.physicsBody) {
                    var self = this;
                    var shape = new CANNON.Sphere(2);
                    var hfBody = new CANNON.Body({
                        mass: 81,
                        type: CANNON.DYNAMIC,
                        // angularDamping: 1.0,
                        // linearDamping: 0.9
                    });
                    hfBody.addShape(shape);

                    this.physicsBody = hfBody;
                    this.physicsBodyPositionOffset.set(0, -4, 0);
                    this.physicsBodyEulerOffset.set(0, 0, 0);
                }

                return this.physicsBody;
            }
        });

        return classToRet;
    });