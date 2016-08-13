"use strict";

define(["THREE", "GridLevelOctogon", "GridLevelSquare", "GameObjectBase", "GridLevelSection"],
    function (THREE, GridLevelOctogon, GridLevelSquare, GameObjectBase, GridLevelSection) {

    var toRet = function (width, height, cellRadius, cellHeight) {
        GameObjectBase.call(this);

        this.ud.width = width;
        this.ud.height = height;
        this.ud.cellRadius = cellRadius || 10;
        this.ud.cellHeight = cellHeight || 25;
        this.ud._gridSections = [];
    };

    toRet.prototype = Object.assign(Object.create(GameObjectBase.prototype), {
        _createObject: function() {

            var object3D = new THREE.Object3D();
            var currentSection;

            for (var z = 0; z < this.ud.height; z++) {

                this.ud._gridSections[z] = [];

                for (var x = 0; x < this.ud.width; x++) {

                    var isLast = (x === (this.ud.width - 1));

                    currentSection = new GridLevelSection(this.ud.cellRadius, this.ud.cellHeight, isLast).init();
                    object3D.add(currentSection);

                    currentSection.position.x = x * currentSection.getIncrement();
                    currentSection.position.z = z * currentSection.getIncrement();

                    this.ud._gridSections[z][x] = currentSection;
                }
            }
            var box = new THREE.Box3();
            box.setFromObject(object3D);
            var width = Math.abs(box.min.x - box.max.x);
            var depth = Math.abs(box.min.z - box.max.z);

            object3D.position.x -= width / 2.0;
            object3D.position.z -= depth / 2.0;

            return object3D;
        }
    });

    return toRet;
});