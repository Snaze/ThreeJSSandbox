define(["THREE", "util/Console", "util/GeometryHelper", "cannon", "util/ArrayUtils", "Immutable"],
    function (THREE, console, GeometryHelper, CANNON, ArrayUtils, Immutable) {
        "use strict";

        var trimeshCreator = function (geometry, numSubDivisions, xDiff, yDiff, zDiff) {
            this.geometry = geometry;
            this.xDiff = xDiff || 0;
            this.yDiff = yDiff || 0;
            this.zDiff = zDiff || 0;
            this.numSubDivisions = numSubDivisions || 0;

            this.physicsVertices = null;
            this.physicsVertexIndices = null;
        };

        trimeshCreator.prototype = {
            reset: function () {
                this.physicsVertices = [];
                this.physicsVertexIndices = []
            },
            create: function () {
                if (this.physicsVertices === null || this.physicsVertexIndices === null) {
                    this.reset();

                    var subdividedGeometry = GeometryHelper.subdivideFaces(this.geometry, this.numSubDivisions);
                    var self = this;

                    if (subdividedGeometry.vertices.length > Math.pow(2, 16)) {
                        throw new Error("Max Vertex Count on OpenGL is 65K");
                    } else {
                        console.log("TrimeshCreator: NumVertices = " + subdividedGeometry.vertices.length);
                    }

                    subdividedGeometry.vertices.forEach(function (vertex) {
                        self.physicsVertices.push(vertex.x + self.xDiff, vertex.y + self.yDiff, vertex.z + self.zDiff);
                    });

                    subdividedGeometry.faces.forEach(function (face) {
                        self.physicsVertexIndices.push(face.a, face.b, face.c);
                    });
                }

                return new CANNON.Trimesh(this.physicsVertices, this.physicsVertexIndices);
            }
        };

        return trimeshCreator;
    });
