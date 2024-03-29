"use strict";

define(["THREE", "WaterShader", "GameObjectBase", "util/PathHelper"],
    function (THREE, WaterShader, GameObjectBase, PathHelper) {

        var classToRet = function (width, height, depth, renderer, camera, scene, sunDirection) {
            GameObjectBase.call(this);

            this.ud.width = width;
            this.ud.height = height;
            this.ud.depth = depth;

            this.renderer = renderer;
            this.camera = camera;
            this.scene = scene;
            this.sunDirection = sunDirection || new THREE.Vector3(width, height, depth).normalize();
        };

        classToRet.geometry = {};
        classToRet.material = {};

        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
            getKey: function () {
                return this.ud.width.toString() +
                    " " + this.ud.height.toString() +
                    " " + this.ud.depth.toString();
            },

            getGeometry: function () {
                var key = this.getKey();
                if (!(key in classToRet.geometry)) {
                    classToRet.geometry[key] = this._createGeometry();
                }

                return classToRet.geometry[key];
            },

            getMaterial: function () {
                var key = this.getKey();

                if (!(key in classToRet.material)) {
                    // Load textures
                    var textureLoader = new THREE.TextureLoader();
                    var waterNormalPath = PathHelper.absolutePath('lib/ocean/assets/img/waternormals.jpg');
                    var waterNormals = textureLoader.load(waterNormalPath);
                    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
                    var self = this;

                    // Create the water effect
                    classToRet.material[key] = new THREE.Water(this.renderer, this.camera, this.scene, {
                        textureWidth: 256,
                        textureHeight: 256,
                        waterNormals: waterNormals,
                        alpha: 	1.0,
                        sunDirection: this.sunDirection,
                        sunColor: 0xFFFFFF,
                        waterColor: 0x54bbfe,
                        betaVersion: 0,
                        side: THREE.DoubleSide
                    });
                }

                return classToRet.material[key];
            },

            _subInit: function () {

            },

            _createGeometry: function () {
                return new THREE.BoxGeometry(this.ud.width, this.ud.height, this.ud.depth, 10, 10, 10);
            },

            _createObject: function () {

                var object3D = new THREE.Object3D();

                var geometry = this.getGeometry();

                var waterShader = this.getMaterial();
                var mesh = new THREE.Mesh(geometry, waterShader.material);
                mesh.add(waterShader);

                object3D.add(mesh);

                return object3D;
            },
            update: function (deltaTime, actualTime) {
                var theMaterial = this.getMaterial().material;
                var time = theMaterial.uniforms.time.value + 1.0 / 600.0;
                theMaterial.uniforms.time.value = time;

                this.getMaterial().render();
            }
        });

        return classToRet;
    });