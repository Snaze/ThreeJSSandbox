"use strict";

define(["THREE",
        "GameObjectBase",
        "util/ArrayUtils",
        "cannon",
        "util/Console",
        "util/PathHelper",
        "Animation",
        "AnimationHandler",
        "jquery"],
    function (THREE,
              GameObjectBase,
              ArrayUtils,
              CANNON,
              console,
              PathHelper,
              Animation,
              AnimationHandler,
              $) {

        var DarkTemplarKnight = function () {
            GameObjectBase.call(this);

            this.actions = {};
            this.mixer = null;
            this.state = null;

        };

        DarkTemplarKnight.MODE_ATTACK = 0;
        DarkTemplarKnight.MODE_PATROL = 1;
        DarkTemplarKnight.MODE_HURT = 2;
        DarkTemplarKnight.MODE_DEAD = 3;

        DarkTemplarKnight.prototype = Object.assign(Object.create(GameObjectBase.prototype), {


            _subInit: function () {
            },

            _createObject: function () {
                var self = this;

                var object3D = new THREE.Object3D();

                var loader = new THREE.JSONLoader();
                var dataPath = PathHelper.absolutePath("assets/dark_templar_knight/dark_templar_knight.json");

                loader.load( dataPath, function (geometry, materials) {

                    var material = new THREE.MultiMaterial( materials );

                    var object = new THREE.SkinnedMesh( geometry, material );
                    // geometry.scale.set(0.25, 0.25, 0.25);
                    object.scale.set(0.15, 0.15, 0.15);
                    object3D.add(object);

                    for (var k in material.materials) {
                        materials[k].skinning = true;
                    }

                    self.mixer = new THREE.AnimationMixer(object);
                    self.actions.attack = self.mixer.clipAction(geometry.animations[ 0 ]);  // ATTACK
                    self.actions.die = self.mixer.clipAction(geometry.animations[ 1 ]);  // DIE
                    self.actions.hurt = self.mixer.clipAction(geometry.animations[ 2 ]);  // HURT
                    self.actions.idle = self.mixer.clipAction(geometry.animations[ 3 ]);  // IDLE
                    self.actions.run = self.mixer.clipAction(geometry.animations[ 4 ]);  // RUN
                    self.actions.walk = self.mixer.clipAction(geometry.animations[ 5 ]);  // WALK

                    self.actions.attack.setEffectiveWeight( 1 ).stop();
                    self.actions.idle.setEffectiveWeight( 1 ).play();
                    self.actions.die.setEffectiveWeight( 1 ).stop();
                    self.actions.hurt.setEffectiveWeight( 1 ).stop();
                    self.actions.run.setEffectiveWeight( 1 ).stop();
                    self.actions.walk.setEffectiveWeight( 1 ).stop();

                    self.actions.attack.setLoop( THREE.LoopOnce, 0 );
                    self.actions.attack.clampWhenFinished = true;
                    self.actions.die.setLoop( THREE.LoopOnce, 0 );
                    self.actions.die.clampWhenFinished = true;
                    self.actions.hurt.setLoop( THREE.LoopOnce, 0 );
                    self.actions.hurt.clampWhenFinished = true;

                });

                return object3D;
            },

            update: function (deltaTime, actualTime) {
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

                if (this.mixer) {
                    this.mixer.update(deltaTime);
                }

            },

            _isPhysicsObject: function () {
                return true;
            },
            _getPhysicsBody: function () {
                if (null === this.physicsBody) {
                    var self = this;
                    var bottomShape = new CANNON.Sphere(0.5);
                    var topShape = new CANNON.Sphere(0.35);
                    var hfBody = new CANNON.Body({
                        mass: 81,
                        // type: CANNON.DYNAMIC,
                        angularDamping: 1.0,
                        linearDamping: 0.9
                    });
                    hfBody.addShape(bottomShape, 0).addShape(topShape, new CANNON.Vec3(0, 0, 0));
                    hfBody.addShape(topShape, 0).addShape(topShape, new CANNON.Vec3(0, 0.75, 0));

                    this.physicsBody = hfBody;
                    this.physicsBodyPositionOffset.set(0, 0.5, 0);
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
                if(this.contactNormal && this.contactNormal.dot(this.upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
                    this.canJump = true;
            }
        });

        return DarkTemplarKnight;
    });