"use strict";

define([
        "THREE",
        "GameObjectBase",
        "SingleMeshNoiseLayer",
        "WaterBox",
        "SkyBox",
        "GameObjects/config/WorldConfig",
        "GameObjects/Player",
        "cannon"
    ],
    function (THREE,
              GameObjectBase,
              SingleMeshNoiseLayer,
              WaterBox,
              SkyBox,
              WorldConfig,
              Player,
              CANNON) {

        var classToRet = function (args) {
            GameObjectBase.call(this);

            this.renderer = args.renderer;
            this.scene = args.scene;

            console.assert(this.renderer !== undefined);
            console.assert(this.scene !== undefined);

            this.width = args.width || WorldConfig.width;
            this.depth = args.depth || WorldConfig.depth; // This is really height for SingleMeshNoiseLayer
            this.seed = args.seed || WorldConfig.seed;
            this.continuity = args.continuity || WorldConfig.continuity;
            this.numLevels = args.numLevels || WorldConfig.numLevels;
            this.faceWidth = args.faceWidth || WorldConfig.faceWidth;
            this.faceHeight = args.faceHeight || WorldConfig.faceHeight;
            this.faceDepth = args.faceDepth || WorldConfig.faceDepth;
            this.skyBoxTextureFile = args.skyBoxTextureFile || WorldConfig.skyBoxTextureFile;
            this.skyBoxTextureExtension = args.skyBoxTextureExtension || WorldConfig.skyBoxTextureExtension;
            this.sunDirection = args.sunDirection || WorldConfig.sunDirection;
            this.gravity = args.gravity || WorldConfig.gravity;

            this.player = new Player(8, 0.22, 4.0, this.faceWidth);
            this.camera = this.player.camera;

            this.singleMeshNoiseLayer = new SingleMeshNoiseLayer(this.width, this.depth, this.seed,
                this.continuity, this.numLevels, this.faceWidth, this.faceHeight, this.faceDepth);

            var skyBoxDimension = 100000;
            this.skyBox = new SkyBox(skyBoxDimension, skyBoxDimension, skyBoxDimension,
                this.skyBoxTextureFile, this.skyBoxTextureExtension);

            this.waterBox = new WaterBox((this.width * this.faceWidth) - (8 * this.faceWidth),
                this.faceHeight - 2,
                (this.depth * this.faceDepth) - (8 * this.faceDepth),
                this.renderer, this.camera, this.scene, this.sunDirection);

            this.physicsWorld = new CANNON.World();
            this.physicsWorld.gravity.set(0, this.gravity, 0.0);
            this.physicsWorld.broadphase = new CANNON.NaiveBroadphase();
            this.physicsWorld.solver.iterations = 10;

        };


        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {

            _subInit: function () {
                this.player.init();
                this.player.setPosition(0, 50, 0);
                this.singleMeshNoiseLayer.init();
                this.skyBox.init();
                this.waterBox.init();

                this.player.addPhysicsBodyToWorld(this.physicsWorld);
                this.singleMeshNoiseLayer.addPhysicsBodyToWorld(this.physicsWorld);
                this.skyBox.addPhysicsBodyToWorld(this.physicsWorld);
                this.waterBox.addPhysicsBodyToWorld(this.physicsWorld);
            },

            _createObject: function () {

                var object3D = new THREE.Object3D();

                object3D.add(this.singleMeshNoiseLayer);
                object3D.add(this.skyBox);
                object3D.add(this.waterBox);
                object3D.add(this.player);
                this.skyBox.setPosition(0, 0, 0);
                // this.waterBox.position.x += 1.0;
                // this.waterBox.position.z += 1.0;

                return object3D;
            },
            update: function (deltaTime, actualTime) {
                this.physicsWorld.step(1/60);

                this.player.update(deltaTime, actualTime);
                this.waterBox.update(deltaTime, actualTime);
                // this.skyBox.update(deltaTime, actualTime);
                this.singleMeshNoiseLayer.update(deltaTime, actualTime);
            }
        });

        return classToRet;
    });