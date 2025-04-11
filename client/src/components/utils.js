import { LAYERS, MAP_DIMENSIONS, SOLID_TILES } from './mapConstants';

export const isSolidTile = (x, y) => {
    for (let layer of LAYERS) {
        if (SOLID_TILES.includes(layer[y][x])) {
            return true;
        }
    }
    return false;
};

export const isMapEdge = (x, y) => {
    const { ROWS, COLS } = MAP_DIMENSIONS;
    return (x < 0 || x >= COLS || y < 0 || y >= ROWS)
};

export const checkMapCollision = (x, y) => {
    // Allow movement within the entire map grid
    const isWithinMapBounds =
        x >= 0 &&
        x < MAP_DIMENSIONS.COLS &&
        y >= 0 &&
        y < MAP_DIMENSIONS.ROWS;

    console.log(`Collision check for (${x},${y}):`, !isWithinMapBounds);

    return !isWithinMapBounds;
};