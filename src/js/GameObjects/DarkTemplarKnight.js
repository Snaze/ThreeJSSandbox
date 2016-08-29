"use strict";

define(["THREE",
        "GameObjectBase",
        "util/ArrayUtils",
        "cannon",
        "util/Console",
        "util/PathHelper"],
    function (THREE,
              GameObjectBase,
              ArrayUtils,
              CANNON,
              console,
              PathHelper) {

        var DarkTemplarKnight = function () {
            GameObjectBase.call(this);

        };

        DarkTemplarKnight.prototype = Object.assign(Object.create(GameObjectBase.prototype), {


            _subInit: function () {
            },

            _createObject: function () {

                var object3D = new THREE.Object3D();

                var loader = new THREE.JSONLoader();
                var dataPath = PathHelper.absolutePath("assets/dark_templar_knight/dark_templar_knight.json");
                // var texturePath = PathHelper.absolutePath("assets/dark_templar_knight/");
                loader.load( dataPath, function (geometry, materials) {

                    var material = new THREE.MultiMaterial( materials );

                    var object = new THREE.Mesh( geometry, material );
                    // geometry.scale.set(0.25, 0.25, 0.25);
                    object.scale.set(0.15, 0.15, 0.15);
                    object3D.add(object);
                });

                return object3D;
            },

            update: function (deltaTime, actualTime) {
                // GameObjectBase.prototype.update.call(this, deltaTime, actualTime);

                if (!this._innerObject3D) {
                    return;
                }

                var physicsBody = this._getPhysicsBody();
                if (physicsBody) {
                    // this._setHorizontalRotation();
                    // this._setVerticalRotation();
                    // this._setDisplacementVector();
                    //
                    // this.verticalObject3D.quaternion.copy(this.verticalQuaternion);

                    // physicsBody.velocity.x = this.displacementVector.x;
                    // physicsBody.velocity.z = this.displacementVector.z;
                    // physicsBody.velocity.y += this.displacementVector.y;

                    /** THIS IS UPDATE CODE THAT TIES THE PHYSICS BODY TO THE THREEJS MODEL **/
                    if (this.physicsBodyPositionOffset) {
                        this.position.set(physicsBody.position.x - this.physicsBodyPositionOffset.x,
                            physicsBody.position.y - this.physicsBodyPositionOffset.y,
                            physicsBody.position.z - this.physicsBodyPositionOffset.z);
                    } else {
                        this.position.copy(physicsBody.position);
                    }

                    // this.quaternion.copy(this.horizontalQuaternion);

                }


            },

            _isPhysicsObject: function () {
                return true;
            },
            _getPhysicsBody: function () {
                if (null === this.physicsBody) {
                    var self = this;
                    var shape = new CANNON.Sphere(1);
                    var hfBody = new CANNON.Body({
                        mass: 81
                        // type: CANNON.DYNAMIC,
                        // angularDamping: 1.0,
                        // linearDamping: 0.9
                    });
                    hfBody.addShape(shape);

                    this.physicsBody = hfBody;
                    this.physicsBodyPositionOffset.set(0, 1, 0);
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

        return DarkTemplarKnight;
    });