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

        var classToRet = function (width, height, depth) {
            GameObjectBase.call(this);

            this.width = width;
            this.height = height;
            this.depth = depth;
        };

        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {

            _subInit: function () {

            },

            _createObject: function () {

                var object3D = new THREE.Object3D();

                var box = new THREE.BoxGeometry(this.width, this.height, this.depth, 1, 1, 1);
                var material = new THREE.MeshBasicMaterial({color: 0xFF1100});

                object3D.add(new THREE.Mesh(box, material));

                return object3D;
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
                    var shape = new CANNON.Box(new CANNON.Vec3(this.width / 2, this.height / 2, this.depth / 2));
                    var hfBody = new CANNON.Body({
                        mass: 100,
                        // angularDamping: 1.0,
                        // linearDamping: 0.0
                    });
                    hfBody.addShape(shape);

                    this.physicsBody = hfBody;
                    this.physicsBody.position.set(0, 0, 0);
                }

                return this.physicsBody;
            }
        });

        return classToRet;
    });