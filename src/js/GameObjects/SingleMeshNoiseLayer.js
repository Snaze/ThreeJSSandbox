"use strict";

define(["THREE",
        "GridLevelSection",
        "noisejs",
        "GameObjectBase",
        "morph",
        "util/ArrayUtils",
        "cannon",
        "util/Console",
        "util/MeshHelper",
        "util/PathHelper"],
    function (THREE,
              GridLevelSection,
              Noise,
              GameObjectBase,
              Morph,
              ArrayUtils,
              CANNON,
              console,
              MeshHelper,
              PathHelper) {

        var SingleMeshNoiseLayer = function (width, height, seed, continuity, numLevels, faceWidth, faceHeight, faceDepth) {
            GameObjectBase.call(this);

            this.ud.width = width;
            this.ud.height = height;
            this.ud.seed = seed || 0;
            this.ud.continuity = continuity || 8.0;
            this.ud.numLevels = numLevels || 6;
            this.ud.faceWidth = faceWidth || 1.0;
            this.ud.faceHeight = faceHeight || 1.0;
            this.ud.faceDepth = faceDepth || 1.0;
            this.ud.totalWidth = 0;
            this.ud.totalDepth = 0;

            this.noise = new Noise(this.ud.seed);

            this.binaryImages = [];
            this.noiseImage = [];
            this.physicsVertexIndices = [];
            this.physicsVertices = [];
            this.physicsBody = null;
            this.physicsShape = null;
            this.heightFieldMatrix = null;

            console.assert(width > 0);
            console.assert(height > 0);

            if (faceWidth !== faceDepth) {
                throw new Error("faceWidth and faceDepth must have the same value.  I need to fix this.");
            }

        };

        SingleMeshNoiseLayer.geometry = {};
        SingleMeshNoiseLayer.material = {};
        SingleMeshNoiseLayer.GRASS_MATERIAL = 0;
        SingleMeshNoiseLayer.DIRT_MATERIAL = 1;
        SingleMeshNoiseLayer.TRANSPARENT_MATERIAL = 2;
        SingleMeshNoiseLayer.DIRT_MATERIAL_NO_WRAP = 3;

        SingleMeshNoiseLayer.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
            getKey: function () {
                return this.ud.width.toString() +
                    " " + this.ud.height.toString() +
                    " " + this.ud.seed.toString() +
                    " " + this.ud.continuity.toString() +
                    " " + this.ud.numLevels.toString();
            },

            getGeometry: function () {
                var key = this.getKey();
                if (!(key in SingleMeshNoiseLayer.geometry)) {
                    SingleMeshNoiseLayer.geometry[key] = this._createGeometry();
                }

                return SingleMeshNoiseLayer.geometry[key];
            },

            getMaterial: function () {
                var key = this.getKey();

                if (!(key in SingleMeshNoiseLayer.material)) {
                    var textureLoader = new THREE.TextureLoader();
                    var grassPath = PathHelper.absolutePath('assets/textures/grass1.jpg');
                    var grassTexture = textureLoader.load(grassPath);
                    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
                    grassTexture.repeat.set( 1.0, 1.0);

                    // var dirtPath = PathHelper.absolutePath('assets/textures/r_border.png');
                    // var dirtPath = PathHelper.absolutePath('assets/textures/dirt1.jpg');
                    var dirtPath = PathHelper.absolutePath('assets/textures/dirt_big.png');
                    var dirtTextureWrap = textureLoader.load(dirtPath);
                    dirtTextureWrap.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
                    dirtTextureWrap.repeat.set(0.25, 0.25);

                    var dirtTexture = textureLoader.load(dirtPath);


                    var grassMaterial = new THREE.MeshLambertMaterial({map: grassTexture, side: THREE.FrontSide });
                    var dirtMaterial = new THREE.MeshLambertMaterial({
                        map: dirtTextureWrap,
                        side: THREE.FrontSide,
                        // vertexColors: THREE.FaceColors
                        // wireframe: true
                    });
                    var transparentMaterial = new THREE.MeshBasicMaterial({transparent: true,
                        opacity: 0,
                        side: THREE.DoubleSide
                    });
                    var dirtMaterialNoWrap = new THREE.MeshLambertMaterial({
                        map: dirtTexture,
                        side: THREE.FrontSide,
                        // vertexColors: THREE.FaceColors
                        // wireframe: true
                    });
                    var materialArray = [];
                    materialArray.push(grassMaterial);
                    materialArray.push(dirtMaterial);
                    materialArray.push(transparentMaterial);
                    materialArray.push(dirtMaterialNoWrap);

                    // dirtMaterial.polygonOffset = true;
                    // dirtMaterial.polygonOffsetFactor = 0.5;

                    SingleMeshNoiseLayer.material[key] = new THREE.MeshFaceMaterial(materialArray);
                }

                return SingleMeshNoiseLayer.material[key];
            },

            _subInit: function () {
                for (var i = 0; i < this.ud.numLevels; i++) {
                    this.binaryImages.push(ArrayUtils.create2DArray(this.ud.height, this.ud.width, 0));
                }

                this.noiseImage = ArrayUtils.create2DArray(this.ud.height, this.ud.width, 0);
            },

            _createSquare: function (geometry, xIndex, yValues, zIndex) {
                var xValue = xIndex * this.ud.faceWidth;
                var zValue = zIndex * this.ud.faceDepth;

                var currentWidth = xValue + this.ud.faceWidth;
                var currentDepth = zValue + this.ud.faceDepth;

                this.ud.totalWidth = Math.max(currentWidth, this.ud.totalWidth);
                this.ud.totalDepth = Math.max(currentDepth, this.ud.totalDepth);

                var vertex0 = new THREE.Vector3(xValue, yValues[0], zValue);
                var vertex1 = new THREE.Vector3(currentWidth, yValues[1], zValue);
                var vertex2 = new THREE.Vector3(currentWidth, yValues[2], currentDepth);
                var vertex3 = new THREE.Vector3(xValue, yValues[3], currentDepth);

                geometry.vertices.push(vertex0);
                var vertex0Index = geometry.vertices.length - 1;

                geometry.vertices.push(vertex1);
                var vertex1Index = geometry.vertices.length - 1;

                geometry.vertices.push(vertex2);
                var vertex2Index = geometry.vertices.length - 1;

                geometry.vertices.push(vertex3);
                var vertex3Index = geometry.vertices.length - 1;

                var color0 = new THREE.Color(Math.random() % 255, Math.random() % 255, Math.random() % 255);
                var color1 = new THREE.Color(Math.abs(color0.r), color0.g, color0.b);

                var face0 = new THREE.Face3(vertex2Index, vertex1Index, vertex0Index);
                face0.color = color0;

                if (vertex2.y === vertex1.y && vertex2.y === vertex0.y) {
                    if (vertex2.y !== this.ud.faceHeight) {
                        face0.materialIndex = SingleMeshNoiseLayer.GRASS_MATERIAL;
                    }
                } else {
                    face0.materialIndex = SingleMeshNoiseLayer.DIRT_MATERIAL;
                }

                // face0.materialIndex = 0;
                var face1 = new THREE.Face3(vertex3Index, vertex2Index, vertex0Index);
                face1.color = color1;
                if (vertex3.y === vertex2.y && vertex3.y === vertex0.y) {
                    if (vertex3.y !== this.ud.faceHeight) {
                        face1.materialIndex = SingleMeshNoiseLayer.GRASS_MATERIAL;
                    }
                } else {
                    face1.materialIndex = SingleMeshNoiseLayer.DIRT_MATERIAL;
                }

                geometry.faces.push(face0);
                geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),new THREE.Vector2(1, 0),new THREE.Vector2(1, 1)]);
                // geometry.faceVertexUvs[0].push([new THREE.Vector2(1, 1),new THREE.Vector2(0, 0), new THREE.Vector2(1, 0)]);
                // this._mapFace0Texture(geometry, face0.materialIndex, vertex0, vertex1, vertex2);

                geometry.faces.push(face1);
                geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 1),new THREE.Vector2(1, 1),new THREE.Vector2(0, 0)]);
                // this._mapFace1Texture(geometry, face1.materialIndex, vertex0, vertex2, vertex3);
            },
            // /**
            //  *
            //  * @param geometry The geometry you wish to map the text to
            //  * @param materialIndex Material index of the texture
            //  * @param vertex0 In a square, bottom left vertex
            //  * @param vertex1 In a square, bottom right vertex
            //  * @param vertex2 In a square, top right vertex
            //  * @private
            //  */
            // _mapFace0Texture: function (geometry, materialIndex, vertex0, vertex1, vertex2) {
            //     if (materialIndex === SingleMeshNoiseLayer.GRASS_MATERIAL) {
            //         geometry.faceVertexUvs[0].push([new THREE.Vector2(1, 1),new THREE.Vector2(1, 0),new THREE.Vector2(0, 0)]);
            //         return;
            //     }
            //
            //     // var line0to1 = new THREE.Line3(vertex0, vertex1);
            //     var line1to2 = new THREE.Line3(vertex1, vertex2);
            //
            //     // var faceWidth = Math.abs(line0to1.distance());
            //     var faceHeight = Math.abs(line1to2.distance());
            //
            //
            //     var uValue = 1.0;
            //     // var vValue = faceHeight / (512 / minDim);
            //     var vValue = 0.1;
            //
            //     geometry.faceVertexUvs[0].push([new THREE.Vector2(uValue, vValue),
            //         new THREE.Vector2(uValue, 0), new THREE.Vector2(0, 0)]);
            // },
            //
            // /**
            //  *
            //  * @param geometry The geometry you wish to map the text to
            //  * @param materialIndex Material index of the texture
            //  * @param vertex0 In a square, bottom left vertex
            //  * @param vertex2 In a square, top right vertex
            //  * @param vertex3 in a square, top left vertex
            //  * @private
            //  */
            // _mapFace1Texture: function (geometry, materialIndex, vertex0, vertex2, vertex3) {
            //     if (materialIndex === SingleMeshNoiseLayer.GRASS_MATERIAL) {
            //         geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 1),new THREE.Vector2(1, 1),new THREE.Vector2(0, 0)]);
            //         return;
            //     }
            //
            //     var line3to2 = new THREE.Line3(vertex3, vertex2);
            //     // var line0to3 = new THREE.Line3(vertex0, vertex3);
            //
            //     var faceHeight = Math.abs(line3to2.distance());
            //     // var faceWidth = Math.abs(line0to3.distance());
            //
            //     // var minDim = Math.min(faceWidth, faceHeight);
            //
            //     var uValue = 1.0;
            //     // var vValue = faceHeight / (512 / minDim);
            //     var vValue = 0.1;
            //
            //     geometry.faceVertexUvs[0].push([new THREE.Vector2(0, vValue),
            //         new THREE.Vector2(uValue, vValue), new THREE.Vector2(0, 0)]);
            // },

            _getYValueFromSimplexNoise: function (x, z) {
                var simplexValue;

                if ((z === 0) ||
                    (x === 0) ||
                    (z >= (this.ud.height - 2)) ||
                    (x >= (this.ud.width - 2))) {
                    simplexValue = -1.0;
                } else {
                    simplexValue = this.noise.simplex2(x / this.ud.continuity, z / this.ud.continuity);
                }

                if (z < this.noiseImage.length && x < this.noiseImage[0].length) {
                    this.noiseImage[z][x] = simplexValue;
                }

                var normalizedSimplexValue = (simplexValue + 1.0) / 2.0; // Bring into 0 to 1 range
                var levelNumber = Math.floor(normalizedSimplexValue * this.ud.numLevels) + 1;
                if (this.ud.numLevels < levelNumber) {
                    levelNumber = this.ud.numLevels;
                }

                if (z < this.binaryImages.length && x < this.binaryImages[0].length) {
                    this.binaryImages[levelNumber - 1][z][x] = 1;
                }

                return levelNumber * this.ud.faceHeight;
                // return 0;
            },

            logMatrices: function () {
                console.log("Noise Image");

                var theString = ArrayUtils.convert2DArrayToString(this.noiseImage);
                console.log(theString);

                this.binaryImages.forEach(function (binaryImage, index) {
                    console.log("");
                    console.log("Binary Image - Level " + index);

                    var theString = ArrayUtils.convert2DArrayToString(binaryImage);
                    console.log(theString);
                });
            },

            _createGeometry: function () {
                var toRet = new THREE.Geometry();
                var yValue;
                var yValues;
                var yValueGrid = [];
                var cellBelow;
                var cellLeft;
                this.heightFieldMatrix = [];
                // var baseSimplexValue = this._getYValueFromSimplexNoise(0, 0);


                for (var z = 0; z < this.ud.height; z++) {

                    yValueGrid[z] = [];
                    this.heightFieldMatrix[z] = [];

                    // this.heightFieldMatrix[z].push(this.ud.faceHeight, this.ud.faceHeight, this.ud.faceHeight);

                    for (var x = 0; x < this.ud.width; x++) {

                        yValue = this._getYValueFromSimplexNoise(x, z);

                        this.heightFieldMatrix[z].push(yValue);

                        if ((x === 0) && (z === 0)) {
                            yValues = [yValue, yValue, yValue, yValue];
                            yValueGrid[z][x] = yValues;
                        } else if (z === 0) {
                            cellLeft = yValueGrid[z][x - 1];

                            yValues = [cellLeft[1], yValue, yValue, cellLeft[2]];
                            yValueGrid[z][x] = yValues;
                        } else if (x === 0) {
                            cellBelow = yValueGrid[z - 1][x];

                            yValues = [cellBelow[3], cellBelow[2], yValue, yValue];
                            yValueGrid[z][x] = yValues;
                        } else { // Neither 0
                            cellBelow = yValueGrid[z - 1][x];
                            cellLeft = yValueGrid[z][x - 1];

                            yValues = [cellBelow[3], cellBelow[2], yValue, cellLeft[2]];
                            yValueGrid[z][x] = yValues;
                        }

                        if (z < this.ud.height && x < this.ud.width) {
                            this._createSquare(toRet, x, yValues, z);
                        }
                    }


                }

                toRet.elementsNeedUpdate = true;
                toRet.verticesNeedUpdate = true;
                toRet.mergeVertices();
                toRet.computeLineDistances();
                toRet.computeVertexNormals();
                toRet.computeFaceNormals();

                return toRet;
            },

            _createObject: function () {

                var object3D = new THREE.Object3D();

                var terrainMesh = new THREE.Mesh(this.getGeometry(), this.getMaterial());
                terrainMesh.position.y -= this.ud.faceHeight;

                var baseHeight = this.ud.faceHeight * 1;
                var cubeGeom = new THREE.BoxGeometry(this.ud.totalWidth,
                    baseHeight,
                    this.ud.totalDepth,
                    1, 1, 1);

                cubeGeom.faces.forEach(function (face) {
                    face.materialIndex = SingleMeshNoiseLayer.DIRT_MATERIAL;
                });
                cubeGeom.faces[4].materialIndex = SingleMeshNoiseLayer.TRANSPARENT_MATERIAL;
                cubeGeom.faces[5].materialIndex = SingleMeshNoiseLayer.TRANSPARENT_MATERIAL;

                var baseBoxMesh = new THREE.Mesh(cubeGeom, this.getMaterial());
                baseBoxMesh.position.set(this.ud.totalWidth / 2.0,
                    -baseHeight / 2.0, this.ud.totalDepth / 2.0);

                var masterGeometry = MeshHelper.mergeMeshes([terrainMesh, baseBoxMesh]);
                var toRet = new THREE.Mesh(masterGeometry, this.getMaterial());

                object3D.add(toRet);

                toRet.position.x += -(this.ud.totalWidth / 2.0);
                toRet.position.y += -(this.ud.faceHeight / 2.0);
                toRet.position.z += -(this.ud.totalDepth / 2.0);

                // this.incrementPosition(deltaX, deltaY, deltaZ);

                object3D.traverse(function (child) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                });

                return object3D;
            },
            _isPhysicsObject: function () {
                return true;
            },
            _getPhysicsBody: function () {
                if (null === this.physicsBody) {
                    // Create heightfield
                    var self = this;
                    var hfShape = new CANNON.Heightfield(this.heightFieldMatrix, {
                        elementSize: self.ud.faceWidth
                    });
                    var hfBody = new CANNON.Body({ mass: 0 });
                    var quat = new CANNON.Quaternion();
                    quat.setFromEuler(-90 * Math.PI / 180, 0, -90 * Math.PI / 180);
                    hfBody.addShape(hfShape
                        , new CANNON.Vec3(
                        -(this.ud.totalWidth / 2.0) + this.ud.faceWidth,
                        -(this.ud.faceHeight / 2.0) - this.ud.faceHeight,
                        -(this.ud.totalDepth / 2.0) + this.ud.faceDepth
                    ), quat);

                    this.physicsBody = hfBody;

                }

                return this.physicsBody;
            }

        });

        return SingleMeshNoiseLayer;
    });