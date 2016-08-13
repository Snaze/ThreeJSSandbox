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

                    currentSection = new GridLevelSection(this.ud.cellRadius, this.ud.cellHeight).init();
                    object3D.add(currentSection);

                    currentSection.position.x = x * (currentSection.getDims().x / 2.0);
                    currentSection.position.z = z * (currentSection.getDims().z / 2.0);

                    this.ud._gridSections[z][x] = currentSection;
                }
            }

            return object3D;
        }
    });

    return toRet;
});