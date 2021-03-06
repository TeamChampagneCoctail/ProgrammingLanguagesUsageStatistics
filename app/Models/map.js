var Map = function() {
    'use strict';

    const brickTile = '1',
        forestTile = '2',
        waterTile = '3',
        crateTile = '4',
        stoneTile = '5',
        pathTile = ' ';

    let mapPrototype = [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', '1', ' ', '1', '2', ' ', '1', '5', '4', '5', '2', '1', ' ', ' ', '1', '2', '5', '4', '5', '1', ' ', '2', '1', ' ', '1', ' '],
        [' ', '1', ' ', '1', '2', ' ', '1', ' ', ' ', ' ', ' ', '1', ' ', ' ', '1', ' ', ' ', ' ', ' ', '1', ' ', '2', '1', ' ', '1', ' '],
        [' ', '1', ' ', '1', '2', ' ', '1', ' ', ' ', ' ', ' ', '1', ' ', ' ', '1', ' ', ' ', ' ', ' ', '1', ' ', '2', '1', ' ', '1', ' '],
        [' ', '1', ' ', '1', '2', ' ', '1', ' ', ' ', '1', ' ', '1', ' ', ' ', '1', ' ', '1', ' ', ' ', '1', ' ', '2', '1', ' ', '1', ' '],
        [' ', '1', ' ', '1', '2', ' ', '1', '5', '4', '1', ' ', '1', ' ', ' ', '1', ' ', '1', '4', '5', '1', ' ', '2', '1', ' ', '1', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['5', ' ', '1', '1', '1', '5', '4', '5', '4', '5', '4', '5', '4', '5', '4', '5', '4', '5', '4', '5', '5', '1', '1', '1', ' ', '5'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', '1', '1', ' ', '1', ' ', '1', ' ', '1', '1', '1', ' ', '1', ' ', ' ', ' ', '1', ' ', '1', '1', '1', ' ', '1', '1', '1', ' '],
        [' ', '1', ' ', ' ', '1', ' ', '1', ' ', '1', ' ', '1', ' ', '1', '1', ' ', '1', '1', ' ', '1', ' ', '1', ' ', '1', ' ', ' ', ' '],
        [' ', '1', ' ', ' ', '1', '1', '1', ' ', '1', ' ', '1', ' ', '1', ' ', '1', ' ', '1', ' ', '1', '1', '1', ' ', '1', '1', '1', ' '],
        [' ', '1', ' ', ' ', '1', '1', '1', ' ', '1', '1', '1', ' ', '1', ' ', ' ', ' ', '1', ' ', '1', ' ', ' ', ' ', '1', '1', '1', ' '],
        [' ', '1', ' ', ' ', '1', ' ', '1', ' ', '1', '1', '1', ' ', '1', ' ', ' ', ' ', '1', ' ', '1', ' ', ' ', ' ', ' ', ' ', '1', ' '],
        [' ', '1', '1', ' ', '1', ' ', '1', ' ', '1', ' ', '1', ' ', '1', ' ', ' ', ' ', '1', ' ', '1', ' ', ' ', ' ', '1', '1', '1', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '4', '4', '4', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '4', ' ', '4', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
    ];

    let map = {
        mapLayer: null,
        objectsLayer: null,
        backgroundLayer: null,
        mapObjects: [],
        layers: [],
        /* Functions */
        drawBackgroundImage: function(stage) {
            map.backgroundLayer = new Kinetic.Layer();

            var imageObj = new Image();
            imageObj.src = "assets/images/map/map_background.png";

            imageObj.onload = function() {
                var backgroundImage = new Kinetic.Rect({
                    x: 0,
                    y: 0,
                    width: stage.getWidth(),
                    height: stage.getHeight(),
                    fillPatternImage: imageObj,
                    fillPatternRepeat: 'repeat'
                });

                map.backgroundLayer.add(backgroundImage);
                map.backgroundLayer.draw();
            };
        },
        setupMapObjects: function() {
            map.objectsLayer = new Kinetic.Layer();
            var imageObj = new Image();
            for (let row = 0; row < 17; row += 1) {
                for (let col = 0; col < 26; col += 1) {
                    let tileType = mapPrototype[row][col];
                    if (tileType !== ' ') {
                        let tileX = col * 40;
                        let tileY = row * 40;
                        let tile = Object.create(MapObject);
                        tile.init({
                            type: tileType,
                            x: tileX,
                            y: tileY,
                            imageObject: imageObj.cloneNode()
                        }, map.objectsLayer);

                        map.mapObjects.push(tile);
                    }
                }
            }
        },

        /* Initialize */
        init: function(stage) {
            // 1. Initiate map layer & objects
            map.mapLayer = new Kinetic.Layer();

            // 2. Draw objects
            map.drawBackgroundImage(stage);
            map.setupMapObjects();

            // 3. Add layers to main stage
            stage.add(map.backgroundLayer);
            stage.add(map.mapLayer);
            stage.add(map.objectsLayer);

            // 4. Draw the map
            map.mapLayer.draw();
        },

        isNextPositionAvailable: function(tileBounds) {
            let mapWidth = mapPrototype[0].length * 40;
            let mapHeight = mapPrototype.length * 40;
            let corners = [{
                x: tileBounds.x,
                y: tileBounds.y
            }, {
                x: tileBounds.x + tileBounds.width,
                y: tileBounds.y
            }, {
                x: tileBounds.x,
                y: tileBounds.y + tileBounds.height
            }, {
                x: tileBounds.x + tileBounds.width,
                y: tileBounds.y + tileBounds.height
            }];

            for (let corner of corners) {
                let row = (corner.y % mapHeight) / 40 | 0;
                let col = (corner.x % mapWidth) / 40 | 0;
                let isOutOfBounds = corner.x < 0 || corner.x > mapWidth || corner.y < 0 || corner.y > mapHeight;
                if (isOutOfBounds || (mapPrototype[row][col] !== pathTile && mapPrototype[row][col] !== forestTile)) {
                    return false;
                }
            }

            return true;
        }
    };

    return map;
}();