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

        var classToRet = function (width, height, seed, continuity, numLevels, faceWidth, faceHeight, faceDepth) {
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

        classToRet.geometry = {};
        classToRet.material = {};
        classToRet.GRASS_MATERIAL = 0;
        classToRet.DIRT_MATERIAL = 1;
        classToRet.TRANSPARENT_MATERIAL = 2;

        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
            getKey: function () {
                return this.ud.width.toString() +
                    " " + this.ud.height.toString() +
                    " " + this.ud.seed.toString() +
                    " " + this.ud.continuity.toString() +
                    " " + this.ud.numLevels.toString();
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
                    var textureLoader = new THREE.TextureLoader();
                    var grassPath = PathHelper.absolutePath('assets/textures/grass1.jpg');
                    var grassTexture = textureLoader.load(grassPath);
                    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
                    grassTexture.repeat.set( 1.0, 1.0);

                    var dirtPath = PathHelper.absolutePath('assets/textures/dirt1.jpg');
                    var dirtTexture = textureLoader.load(dirtPath);
                    dirtTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
                    dirtTexture.repeat.set( 1.0, 1.0);

                    var grassMaterial = new THREE.MeshLambertMaterial({map: grassTexture });
                    var dirtMaterial = new THREE.MeshLambertMaterial({map: dirtTexture});
                    var transparentMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});
                    var materialArray = [];
                    materialArray.push(grassMaterial);
                    materialArray.push(dirtMaterial);
                    materialArray.push(transparentMaterial);

                    // dirtMaterial.polygonOffset = true;
                    // dirtMaterial.polygonOffsetFactor = 0.5;

                    classToRet.material[key] = new THREE.MeshFaceMaterial(materialArray);
                }

                return classToRet.material[key];
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

                var face0 = new THREE.Face3(vertex2Index, vertex1Index, vertex0Index);

                if (vertex2.y === vertex1.y && vertex2.y === vertex0.y) {
                    if (vertex2.y !== this.ud.faceHeight) {
                        face0.materialIndex = classToRet.GRASS_MATERIAL;
                    }
                } else {
                    face0.materialIndex = classToRet.DIRT_MATERIAL;
                }

                // face0.materialIndex = 0;
                var face1 = new THREE.Face3(vertex3Index, vertex2Index, vertex0Index);
                if (vertex3.y === vertex2.y && vertex3.y === vertex0.y) {
                    if (vertex3.y !== this.ud.faceHeight) {
                        face1.materialIndex = classToRet.GRASS_MATERIAL;
                    }
                } else {
                    face1.materialIndex = classToRet.DIRT_MATERIAL;
                }

                geometry.faces.push(face0);
                geometry.faceVertexUvs[0].push([new THREE.Vector2(1, 1),new THREE.Vector2(1, 0),new THREE.Vector2(0, 0)]);

                geometry.faces.push(face1);
                geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 1),new THREE.Vector2(1, 1),new THREE.Vector2(0, 0)]);
            },

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
                    face.materialIndex = classToRet.DIRT_MATERIAL;
                });
                cubeGeom.faces[4].materialIndex = classToRet.TRANSPARENT_MATERIAL;
                cubeGeom.faces[5].materialIndex = classToRet.TRANSPARENT_MATERIAL;

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

        return classToRet;
    });