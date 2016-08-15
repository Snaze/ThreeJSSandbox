"use strict";

define(["THREE", "GridLevelSection", "noisejs", "GameObjectBase", "morph"],
    function (THREE, GridLevelSection, Noise, GameObjectBase, Morph) {

        var classToRet = function (width, height, seed, continuity, numLevels, faceWidth, faceDepth) {
            GameObjectBase.call(this);

            this.ud.width = width;
            this.ud.height = height;
            this.ud.seed = seed || 0;
            this.ud.continuity = continuity || 8.0;
            this.ud.numLevels = numLevels || 6;
            this.ud.faceWidth = faceWidth || 1.0;
            this.ud.faceDepth = faceDepth || 1.0;
            this.ud.totalWidth = 0;
            this.ud.totalDepth = 0;

            this.noise = new Noise(this.ud.seed);

            console.assert(width > 0);
            console.assert(height > 0);

        };

        classToRet.geometry = {};
        classToRet.material = {};

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
                    var grassTexture = textureLoader.load('../../assets/textures/grass1.jpg');
                    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
                    grassTexture.repeat.set( 2.0, 2.0 );
                    classToRet.material[key] = new THREE.MeshPhongMaterial({map: grassTexture});
                }

                return classToRet.material[key];
            },

            _subInit: function () {

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

                geometry.faces.push(new THREE.Face3(vertex2Index, vertex1Index, vertex0Index));
                geometry.faces.push(new THREE.Face3(vertex3Index, vertex2Index, vertex0Index));
            },

            _getYValueFromSimplexNoise: function (x, z) {
                var simplexValue = this.noise.simplex2(x / this.ud.continuity, z / this.ud.continuity);
                var normalizedSimplexValue = (simplexValue + 1.0) / 2.0; // Bring into 0 to 1 range
                var levelNumber = Math.floor(normalizedSimplexValue * this.ud.numLevels) + 1;
                if (this.ud.numLevels < levelNumber) {
                    levelNumber = this.ud.numLevels;
                }

                return levelNumber * this.ud.height;
                // return 0;
            },

            _createGeometry: function () {
                var toRet = new THREE.Geometry();
                var yValue;
                var yValues;
                var yValueGrid = [];
                var cellBelow;
                var cellLeft;

                for (var z = 0; z < this.ud.height; z++) {

                    yValueGrid[z] = [];

                    for (var x = 0; x < this.ud.width; x++) {

                        yValue = this._getYValueFromSimplexNoise(x, z);

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

                        this._createSquare(toRet, x, yValues, z);
                    }
                }

                toRet.mergeVertices();
                toRet.computeVertexNormals();
                toRet.computeFaceNormals();

                return toRet;
            },

            _createObject: function () {

                var object3D = new THREE.Object3D();

                var mesh = new THREE.Mesh(this.getGeometry(), this.getMaterial());
                // mesh.doubleSided = true;
                object3D.add(mesh);
                mesh.position.x -= (this.ud.totalWidth / 2.0);
                mesh.position.z -= (this.ud.totalDepth / 2.0);

                return object3D;
            }
        });

        return classToRet;
    });