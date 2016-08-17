"use strict";

define(["THREE", "GameObjectBase", "util/PathHelper", "util/CustomLoadingManager"],
    function (THREE, GameObjectBase, PathHelper, CustomLoadingManager) {

        var classToRet = function (width, height, depth, textureFile, textureExtension) {
            GameObjectBase.call(this);

            this.ud.width = width;
            this.ud.height = height;
            this.ud.depth = depth;
            this.ud.textureFile = textureFile;
            this.ud.textureExtension = textureExtension;


        };

        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {

            _subInit: function () {

            },

            _createTextureArray: function () {
                var absolutePath = PathHelper.absolutePath(this.ud.textureFile);

                var toRet = [];


                toRet.push(absolutePath + "_left." + this.ud.textureExtension);
                toRet.push(absolutePath + "_right." + this.ud.textureExtension);

                toRet.push(absolutePath + "_up." + this.ud.textureExtension);
                toRet.push(absolutePath + "_down." + this.ud.textureExtension);

                toRet.push(absolutePath + "_front." + this.ud.textureExtension);
                toRet.push(absolutePath + "_back." + this.ud.textureExtension);

                return toRet;
            },

            _createObject: function () {

                var toRet = new THREE.Object3D();

                var loader = new THREE.CubeTextureLoader(new CustomLoadingManager());
                var self = this;


                var textureArray = this._createTextureArray();

                loader.load(textureArray, function (aCubeMap) {
                    aCubeMap.format = THREE.RGBFormat;

                    var aShader = THREE.ShaderLib['cube'];
                    aShader.uniforms['tCube'].value = aCubeMap;

                    var aSkyBoxMaterial = new THREE.ShaderMaterial({
                        fragmentShader: aShader.fragmentShader,
                        vertexShader: aShader.vertexShader,
                        uniforms: aShader.uniforms,
                        depthWrite: false,
                        side: THREE.BackSide
                    });

                    var aSkybox = new THREE.Mesh(
                        new THREE.BoxGeometry(self.ud.width, self.ud.height, self.ud.depth),
                        aSkyBoxMaterial
                    );

                    toRet.add(aSkybox);
                });


                return toRet;
            },
            update: function (deltaTime, actualTime) {

            }
        });

        return classToRet;
    });