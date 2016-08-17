"use strict";

define([
        "THREE",
        "GameObjectBase",
        "SingleMeshNoiseLayer",
        "WaterBox",
        "SkyBox",
        "GameObjects/config/WorldConfig"
    ],
    function (THREE,
              GameObjectBase,
              SingleMeshNoiseLayer,
              WaterBox,
              SkyBox,
              WorldConfig) {

        var classToRet = function (args) {
            GameObjectBase.call(this);

            this.renderer = args.renderer;
            this.camera = args.camera;
            this.scene = args.scene;

            console.assert(this.renderer !== undefined);
            console.assert(this.camera !== undefined);
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

            this.singleMeshNoiseLayer = new SingleMeshNoiseLayer(this.width, this.depth, this.seed,
                this.continuity, this.numLevels, this.faceWidth, this.faceHeight, this.faceDepth);

            var skyBoxDimension = 100000;
            this.skyBox = new SkyBox(skyBoxDimension, skyBoxDimension, skyBoxDimension,
                this.skyBoxTextureFile, this.skyBoxTextureExtension);

            this.waterBox = new WaterBox(this.width - 8, this.faceHeight - 2, this.depth - 8,
                this.renderer, this.camera, this.scene, this.sunDirection);
        };


        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {

            _subInit: function () {
                this.singleMeshNoiseLayer.init();
                this.skyBox.init();
                this.waterBox.init();
            },

            _createObject: function () {

                var object3D = new THREE.Object3D();

                object3D.add(this.singleMeshNoiseLayer);
                object3D.add(this.skyBox);
                object3D.add(this.waterBox);
                // this.waterBox.position.x += 1.0;
                // this.waterBox.position.z += 1.0;

                return object3D;
            },
            update: function (deltaTime, actualTime) {
                this.waterBox.update(deltaTime, actualTime);
            }
        });

        return classToRet;
    });