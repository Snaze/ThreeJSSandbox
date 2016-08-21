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

        var classToRet = function (speed, mouseSensitivity, jumpVelocity, faceDimension) {
            GameObjectBase.call(this);

            this.camera = new THREE.PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 3000000);
            this.camera.up.set(0, 1, 0);
            this.verticalObject3D = null;
            this.controlHelper = new ControlHelper();

            this.displacementVector = new THREE.Vector3(0, 0, 0);
            this.horizontalQuaternion = new THREE.Quaternion();
            this.horizontalEuler = new THREE.Euler();

            this.verticalQuaternion = new THREE.Quaternion();
            this.verticalEuler = new THREE.Euler();
            this.faceDimension = faceDimension || 1;

            this.speed = (speed || 8) * this.faceDimension;
            this.modalDialog = null;
            this.clock = new THREE.Clock();
            this.jumpFrequency = 1;
            this.lastJumpTime = this.clock.getElapsedTime();
            this.mouseSensitivity = mouseSensitivity || 0.22;
            this.jumpVelocity = (jumpVelocity || 4.0) * this.faceDimension;
            this.canJump = false;
            this.contactNormal = new CANNON.Vec3();
            this.upAxis = new CANNON.Vec3(0,1,0);

            this.boxWidth = null;
            this.boxHeight = null;
            this.boxDepth = null;
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

                this.boxWidth = 0.25 * this.faceDimension;
                this.boxHeight = 1 * this.faceDimension;
                this.boxDepth = 0.25 * this.faceDimension;
                var cameraPosition = this.boxHeight - (this.boxHeight / 4);

                var shape = new THREE.BoxGeometry(this.boxWidth,
                    this.boxHeight,
                    this.boxDepth,
                    1, 1, 1);
                var material = new THREE.MeshLambertMaterial({color: 0x00FF0F});
                var mesh = new THREE.Mesh(shape, material);
                shape.center();

                if (this.camera) {
                    this.verticalObject3D = new THREE.Object3D();
                    this.verticalObject3D.position.set(0, cameraPosition, 0);
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

                this.displacementVector.normalize();
                this.displacementVector.multiplyScalar(this.speed);
                this.displacementVector.applyQuaternion(this.horizontalQuaternion);

                var elapsedTime = this.clock.getElapsedTime();
                if (this.controlHelper.state.jump && this.canJump &&
                    (elapsedTime - this.lastJumpTime) > this.jumpFrequency) {
                    this.displacementVector.y += this.jumpVelocity;
                    this.lastJumpTime = elapsedTime;
                    this.canJump = false;
                }
            },
            _setHorizontalRotation: function () {

                // This is a bad name "mouseDeltaX".  I don't think it's really a delta
                var toSet = (-1 * this.controlHelper.state.mouseDeltaX * this.mouseSensitivity % 360) *
                    Math.PI / 180.0;
                this.horizontalEuler.set(0, toSet, 0);
                this.horizontalQuaternion.setFromEuler(this.horizontalEuler);
            },
            _setVerticalRotation: function () {

                var toSet = (-1 * (this.controlHelper.state.mouseDeltaY + 90.0) *
                    this.mouseSensitivity % 180) * Math.PI / 180.0;

                this.verticalEuler.set(toSet, 0, 0);
                this.verticalQuaternion.setFromEuler(this.verticalEuler);

            },
            update: function (deltaTime, actualTime) {
                // GameObjectBase.prototype.update.call(this, deltaTime, actualTime);

                if (!this._innerObject3D) {
                    return;
                }

                var physicsBody = this._getPhysicsBody();
                if (physicsBody) {
                    this._setHorizontalRotation();
                    this._setVerticalRotation();
                    this._setDisplacementVector();

                    this.verticalObject3D.quaternion.copy(this.verticalQuaternion);

                    physicsBody.velocity.x = this.displacementVector.x;
                    physicsBody.velocity.z = this.displacementVector.z;
                    physicsBody.velocity.y += this.displacementVector.y;

                    /** THIS IS UPDATE CODE THAT TIES THE PHYSICS BODY TO THE THREEJS MODEL **/
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
                    var shape = new CANNON.Sphere(this.boxHeight);
                    var hfBody = new CANNON.Body({
                        mass: 81
                        // type: CANNON.DYNAMIC,
                        // angularDamping: 1.0,
                        // linearDamping: 0.9
                    });
                    hfBody.addShape(shape);

                    this.physicsBody = hfBody;
                    this.physicsBodyPositionOffset.set(0, 0, 0);
                    this.physicsBodyEulerOffset.set(0, 0, 0);

                    this.physicsBody.addEventListener("collide", $.proxy(this._collide_event, this));
                    this.physicsBody.id = this.id;
                }

                return this.physicsBody;
            },
            _collide_event: function (e) {
                var contact = e.contact;

                // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
                // We do not yet know which one is which! Let's check.
                if(contact.bi.id == this.physicsBody.id)  // bi is the player body, flip the contact normal
                    contact.ni.negate(this.contactNormal);
                else
                    this.contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

                // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
                if(this.contactNormal.dot(this.upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
                    this.canJump = true;
            }
        });

        return classToRet;
    });