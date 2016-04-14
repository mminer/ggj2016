import { combineReducers } from 'redux';
import levels from 'levels';
import { createReducer } from 'util';
import { LOAD_LEVEL, LOSE, MOVE, WIN } from 'constants/actions';
import { LOST, PLAYING, WON } from 'constants/game-statuses';
import { PRESSED, UNPRESSED } from 'constants/tile-codes';

export default combineReducers({
  currentLevelNumber: createReducer(0, {
    [LOAD_LEVEL] (state, { levelNumber }) {
      return levelNumber;
    },
  }),

  maxMoves: createReducer(Infinity, {
    [LOAD_LEVEL] (state, { levelNumber }) {
      let level = levels[levelNumber];
      return level.maxMoves;
    },
  }),

  moveCount: createReducer(0, {
    [LOAD_LEVEL] () {
      return 0;
    },

    [MOVE] (state) {
      return state + 1;
    },
  }),

  playerPosition: createReducer({ row: 0, column: 0 }, {
    [LOAD_LEVEL] (state, { levelNumber }) {
      let level = levels[levelNumber];
      let { row, column } = level.playerPosition;
      return { row, column };
    },

    [MOVE] (state, { row, column }) {
      return { row, column };
    },
  }),

  status: createReducer(PLAYING, {
    [LOAD_LEVEL] () {
      return PLAYING;
    },

    [LOSE] () {
      return LOST;
    },

    [WIN] () {
      return WON;
    },
  }),

  tiles: createReducer([[]], {
    [LOAD_LEVEL] (state, { levelNumber }) {
      let level = levels[levelNumber];
      return level.tiles.map(rowTiles => rowTiles.slice());
    },

    [MOVE] (state, { row, column }) {
      // Toggle the tile at the new position.
      let currentTile = state[row][column];
      let newTile = currentTile === PRESSED ? UNPRESSED : PRESSED;
      state = state.map(rowTiles => rowTiles.slice());
      state[row][column] = newTile;
      return state;
    },
  }),
});