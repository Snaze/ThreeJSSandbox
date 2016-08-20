"use strict";

define(["THREE",
        "GameObjectBase",
        "util/ArrayUtils",
        "cannon",
        "util/Console",
        "util/ControlHelper"],
    function (THREE,
              GameObjectBase,
              ArrayUtils,
              CANNON,
              console,
              ControlHelper) {

        var classToRet = function (camera) {
            GameObjectBase.call(this);

            this.camera = camera;
            this.verticalObject3D = null;
            this.controlHelper = new ControlHelper();

            this.displacementVector = new THREE.Vector3(0, 0, 0);
            this.horizontalQuaternion = new THREE.Quaternion();
        };

        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {

            _subInit: function () {

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

                return this.displacementVector.normalize();
            },
            _setHorizontalQuaternion: function () {

                // This is a bad name "mouseDeltaX".  I don't think it's really a delta
                var toSet = (this.controlHelper.mouseDeltaX % 360) * Math.PI / 180.0;
                this.horizontalQuaternion.setFromEuler(new THREE.Euler(0, toSet, 0));

            },
            _getVerticalRotationAngleRadians: function () {

                return (this.controlHelper.mouseDeltaY % 180) * Math.PI / 180.0;

            },
            update: function (deltaTime, actualTime) {
                // GameObjectBase.prototype.update.call(this, deltaTime, actualTime);

                if (!this._innerObject3D) {
                    return;
                }

                var physicsBody = this._getPhysicsBody();
                if (physicsBody) {
                    this._setDisplacementVector();
                    this._setHorizontalQuaternion();

                    this.displacementVector.applyQuaternion(this.horizontalQuaternion);
                    physicsBody.velocity.set(this.displacementVector.x,
                        this.displacementVector.y, this.displacementVector.z);

                    this.position.copy(physicsBody.position);
                    // We only want the updated position
                    // this.quaternion.copy(physicsBody.quaternion);
                }


            },
            _isPhysicsObject: function () {
                return true;
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
            _getPhysicsBody: function () {
                if (null === this.physicsBody) {
                    var self = this;
                    var shape = new CANNON.Sphere(2);
                    var hfBody = new CANNON.Body({
                        mass: 81,
                        type: CANNON.DYNAMIC,
                        angularDamping: 1.0,
                        linearDamping: 0.9
                    });
                    hfBody.addShape(shape);

                    this.physicsBody = hfBody;
                }

                return this.physicsBody;
            }
        });

        return classToRet;
    });