define(["THREE", "TerrainGenerator", "GameObjectBase"],
    function (THREE, TerrainGenerator, GameObjectBase) {
        "use strict";

        var classToRet = function (width, height, segments, smoothingFactor) {
            GameObjectBase.call(this);

            this.width = width;
            this.height = height;
            this.segments = segments;
            this.smoothingFactor = smoothingFactor;

            this.deepth = -1;
            this.deepthGround = -80;
        };


        classToRet.material = null;
        classToRet.materialGround = null;

        (function () {
            var textureLoader = new THREE.TextureLoader();
            var dirtTexture = textureLoader.load('../../assets/textures/dirt1.jpg');
            var grassTexture = textureLoader.load('../../assets/textures/grass1.jpg');

            classToRet.material = new THREE.MeshLambertMaterial({map: grassTexture});
            classToRet.materialGround = new THREE.MeshLambertMaterial({map: dirtTexture});
        })();

        classToRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
            _subInit: function () {
                var terrainGeneration = new TerrainGenerator(this.width, this.height, this.segments, this.smoothingFactor);
                this.terrain = terrainGeneration.diamondSquare();

                this.geometry = new THREE.PlaneGeometry(this.width, this.height, this.segments, this.segments);
                this.geometryGround = new THREE.PlaneGeometry(this.width, this.height, this.segments, this.segments);
                var index = 0;
                for (var i = 0; i <= this.segments; i++) {
                    for (var j = 0; j <= this.segments; j++) {
                        this.geometry.vertices[index].z = this.terrain[i][j];
                        this.geometryGround.vertices[index].z = this.terrain[i][j] + this.deepth;
                        index++;
                    }
                }

            },
            _createObject: function () {
                this.combined = new THREE.Geometry();
                this.combinedGround = new THREE.Geometry();

                // sides
                var leftGeometry = new THREE.PlaneGeometry(this.width, 10, this.segments, 1),
                    leftGroundGeometry = new THREE.PlaneGeometry(this.width, 10, this.segments, 1),
                    a = 0;

                for (var i = this.segments; i >= 0; i--) {
                    leftGeometry.vertices[a].z = this.terrain[0][i];
                    leftGeometry.vertices[a].y = -this.height / 2;
                    leftGroundGeometry.vertices[a].z = this.terrain[0][i] + this.deepth;
                    leftGroundGeometry.vertices[a].y = -this.height / 2;
                    a++;
                }
                for (var i = this.segments; i >= 0; i--) {
                    leftGeometry.vertices[a].z = this.terrain[0][i] + this.deepth;
                    leftGeometry.vertices[a].y = -this.height / 2;
                    leftGroundGeometry.vertices[a].z = this.deepthGround;
                    leftGroundGeometry.vertices[a].y = -this.height / 2;
                    a++;
                }

                var rightGeometry = new THREE.PlaneGeometry(this.width, 10, this.segments, 1),
                    rightGroundGeometry = new THREE.PlaneGeometry(this.width, 10, this.segments, 1);
                    a = 0;
                for (var i = 0; i <= this.segments; i++) {
                    rightGeometry.vertices[a].z = this.terrain[this.segments][i];
                    rightGeometry.vertices[a].y = -this.height / 2;
                    rightGroundGeometry.vertices[a].z = this.terrain[this.segments][i] + this.deepth;
                    rightGroundGeometry.vertices[a].y = -this.height / 2;
                    a++;
                }
                for (var i = 0; i <= this.segments; i++) {
                    rightGeometry.vertices[a].z = this.terrain[this.segments][i] + this.deepth;
                    rightGeometry.vertices[a].y = -this.height / 2;
                    rightGroundGeometry.vertices[a].z = this.deepthGround;
                    rightGroundGeometry.vertices[a].y = -this.height / 2;
                    a++;
                }

                var topGeometry = new THREE.PlaneGeometry(this.height, 10, this.segments, 1),
                    topGroundGeometry = new THREE.PlaneGeometry(this.height, 10, this.segments, 1);
                    a = 0;

                for (var i = this.segments; i >= 0; i--) {
                    topGeometry.vertices[a].z = this.terrain[i][0];
                    topGeometry.vertices[a].x = -this.width / 2;
                    topGeometry.vertices[a].y = this.height / 2 - a * (this.height / this.segments);
                    topGroundGeometry.vertices[a].z = this.terrain[i][0] + this.deepth;
                    topGroundGeometry.vertices[a].x = -this.width / 2;
                    topGroundGeometry.vertices[a].y = this.height / 2 - a * (this.height / this.segments);
                    a++;
                }
                for (var i = this.segments; i >= 0; i--) {
                    topGeometry.vertices[a].z = this.terrain[i][0] + this.deepth;
                    topGeometry.vertices[a].x = -this.width / 2;
                    topGeometry.vertices[a].y = this.height / 2 - (this.segments - i) * (this.height / this.segments);
                    topGroundGeometry.vertices[a].z = this.deepthGround;
                    topGroundGeometry.vertices[a].x = -this.width / 2;
                    topGroundGeometry.vertices[a].y = this.height / 2 - (this.segments - i) * (this.height / this.segments);
                    a++;
                }

                var bottomGeometry = new THREE.PlaneGeometry(this.height, 10, this.segments, 1),
                    bottomGroundGeometry = new THREE.PlaneGeometry(this.height, 10, this.segments, 1);
                    a = 0;

                for (var i = 0; i <= this.segments; i++) {
                    bottomGeometry.vertices[a].z = this.terrain[i][this.segments];
                    bottomGeometry.vertices[a].x = -this.width / 2;
                    bottomGeometry.vertices[a].y = this.height / 2 - i * (this.height / this.segments);
                    bottomGroundGeometry.vertices[a].z = this.terrain[i][this.segments] + this.deepth;
                    bottomGroundGeometry.vertices[a].x = -this.width / 2;
                    bottomGroundGeometry.vertices[a].y = this.height / 2 - i * (this.height / this.segments);
                    a++;
                }
                for (var i = 0; i <= this.segments; i++) {
                    bottomGeometry.vertices[a].z = this.terrain[i][0] + this.deepth;
                    bottomGeometry.vertices[a].x = -this.width / 2;
                    bottomGeometry.vertices[a].y = this.height / 2 - i * (this.height / this.segments);
                    bottomGroundGeometry.vertices[a].z = this.deepthGround;
                    bottomGroundGeometry.vertices[a].x = -this.width / 2;
                    bottomGroundGeometry.vertices[a].y = this.height / 2 - i * (this.height / this.segments);
                    a++;
                }

                // base
                var baseGeometry = new THREE.PlaneGeometry(this.width, this.height, this.segments, this.segments),
                    baseGroundGeometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
                baseGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
                baseGroundGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
                a = 0;
                for (var i = this.segments; i >= 0; i--) {
                    for (var j = 0; j <= this.segments; j++) {
                        baseGeometry.vertices[a].z = this.terrain[i][j] + this.deepth;
                        a++;
                    }
                }

                for (var i = 0; i < baseGroundGeometry.vertices.length; i++) {
                    baseGroundGeometry.vertices[i].z = this.deepthGround;
                }

                leftGroundGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
                leftGroundGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
                topGroundGeometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));

                var toRet = new THREE.Object3D();

                this.combinedGround.merge(leftGroundGeometry);
                this.combinedGround.merge(rightGroundGeometry);
                this.combinedGround.merge(topGroundGeometry);
                this.combinedGround.merge(bottomGroundGeometry);
                this.combinedGround.merge(baseGroundGeometry);

                this.combinedGround.merge(this.geometryGround);
                this.meshGround = new THREE.Mesh(this.combinedGround, classToRet.materialGround);
                toRet.add(this.meshGround);
                this.meshGround.rotation.x = Math.PI / 180 * (-90);

                leftGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
                leftGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
                topGeometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));

                this.combined.merge(leftGeometry);
                this.combined.merge(rightGeometry);
                this.combined.merge(topGeometry);
                this.combined.merge(bottomGeometry);
                this.combined.merge(baseGeometry);

                this.combined.merge(this.geometry);
                this.mesh = new THREE.Mesh(this.combined, classToRet.material);
                toRet.add(this.mesh);
                this.mesh.rotation.x = Math.PI / 180 * (-90);
                return toRet;
            }
        });

        return classToRet;
    });


