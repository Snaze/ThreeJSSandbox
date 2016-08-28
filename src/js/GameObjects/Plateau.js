

define(["THREE",
        "GameObjectBase",
        "hull",
        "util/PathHelper"],
    function (THREE,
              GameObjectBase,
              hull,
              PathHelper) {
        "use strict";

        var Plateau = function (binaryImage, concavity, extrudeAmt, scaleFactor) {
            GameObjectBase.call(this);

            this.binaryImage = binaryImage;
            this.concavity = concavity || 20;
            this.extrudeAmt = extrudeAmt || 50;
            this.scaleFactor = scaleFactor || 1.0;
            this._innerPoints = null;
            this._shapePoints = null;
            this._shape = null;
            this._material = null;
        };

        Plateau.MATERIAL_GRASS = 0;
        Plateau.MATERIAL_DIRT = 1;
        Plateau.MATERIAL_TRANSPARENT = 2;

        Plateau.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
            _subInit: function () {

                this._innerPoints = [];

                for (var y = 0; y < this.binaryImage.length; y++) {

                    for (var x = 0; x < this.binaryImage[y].length; x++) {

                        if (this.binaryImage[y][x] > 0) {
                            this._innerPoints.push([x, y]);
                        }
                    }
                }

                this._shapePoints = hull(this._innerPoints);
            },

            _getShape: function () {
                if (this._shape === null) {
                    console.assert(this._shapePoints !== null && this._shapePoints.length > 0);

                    this._shape = new THREE.Shape();
                    // this._shape.autoClose = true;

                    for (var pointIndex = 0; pointIndex < this._shapePoints.length; pointIndex++) {
                        var currentPoint = this._shapePoints[pointIndex];
                        var x = currentPoint[0];
                        var y = currentPoint[1];

                        if (pointIndex === 0) {
                            this._shape.moveTo(x, y);
                        } else {
                            this._shape.lineTo(x, y);
                        }
                    }
                }

                return this._shape;
            },

            _getExtrudeParams: function () {
                // curveSegments — int. number of points on the curves
                // steps — int. number of points used for subdividing segements of extrude spline
                // amount — int. Depth to extrude the shape
                // bevelEnabled — bool. turn on bevel
                // bevelThickness — float. how deep into the original shape bevel goes
                // bevelSize — float. how far from shape outline is bevel
                // bevelSegments — int. number of bevel layers
                // extrudePath — THREE.CurvePath. 3d spline path to extrude shape along. (creates Frames if (frames aren't defined)
                // frames — THREE.TubeGeometry.FrenetFrames. containing arrays of tangents, normals, binormals
                // material — int. material index for front and back faces
                // extrudeMaterial — int. material index for extrusion and beveled faces
                // UVGenerator — Object. object that provides UV generator functions
            },

            _getMaterial: function () {

                if (this._material === null) {
                    var textureLoader = new THREE.TextureLoader();
                    var grassPath = PathHelper.absolutePath('assets/textures/grass1.jpg');
                    var grassTexture = textureLoader.load(grassPath);
                    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
                    grassTexture.repeat.set( 1.0, 1.0);

                    // var dirtPath = PathHelper.absolutePath('assets/textures/r_border.png');
                    var dirtPath = PathHelper.absolutePath('assets/textures/dirt1.jpg');
                    var dirtTexture = textureLoader.load(dirtPath);
                    dirtTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
                    dirtTexture.repeat.set( 0.5, 0.5);

                    var grassMaterial = new THREE.MeshLambertMaterial({
                        map: grassTexture,
                        side: THREE.FrontSide
                        // , wireframe: true
                    });
                    var dirtMaterial = new THREE.MeshLambertMaterial({
                        map: dirtTexture,
                        side: THREE.FrontSide
                        // , wireframe: true
                    });
                    var transparentMaterial = new THREE.MeshBasicMaterial({transparent: true,
                        opacity: 0,
                        side: THREE.DoubleSide
                    });
                    var materialArray = [];
                    materialArray.push(grassMaterial);
                    materialArray.push(dirtMaterial);
                    materialArray.push(transparentMaterial);

                    this._material = new THREE.MeshFaceMaterial(materialArray);
                }

                return this._material;
            },

            _createObject: function () {

                var self = this;
                var object3D = new THREE.Object3D();

                var shape = this._getShape();
                var geometry = shape.extrude({
                    amount: self.extrudeAmt,
                    material: Plateau.MATERIAL_GRASS,
                    extrudeMaterial: Plateau.MATERIAL_DIRT,
                    bevelEnabled: false
                });
                geometry.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
                geometry.center();
                // geometry.elementsNeedUpdate = true;
                // geometry.verticesNeedUpdate = true;
                // geometry.mergeVertices();
                // geometry.computeLineDistances();
                // geometry.computeVertexNormals();
                // geometry.computeFaceNormals();
                // geometry.uvsNeedUpdate();
                // geometry.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));

                var material = this._getMaterial();
                var theMesh = new THREE.Mesh(geometry, material);
                object3D.add(theMesh);
                theMesh.quaternion.setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));



                return object3D;
            },
            _isPhysicsObject: function () {
                return false;
            }
        });

        return Plateau;
    });