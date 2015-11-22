import * as Reflux from 'reflux'
import * as Pathfinding from 'pathfinding'
import * as Tweenable from 'shifty'

import LevelStore from './levelStore'

import movementActions from '../actions/movementActions'

import { coordinatesFromGrid } from '../helpers/position'

export default Reflux.createStore({

  listenables: [movementActions],

  init() {
    this.tweenable = new Tweenable()
    this.finder = new Pathfinding.BiDijkstraFinder({
      allowDiagonal: false,
      dontCrossCorners: true
    })
    this.currentDirection = 'left'
    this.currentPosition = [1,1]
    this.isMoving = false
    this.maxTilesPerSecond = 2
    this.listenTo(LevelStore, this.handleLevelChange, this.handleLevelChange)
  },

  getInitialState() {
    return coordinatesFromGrid(this.tileSize, this.currentPosition[0], this.currentPosition[1])
  },

  handleLevelChange(levelMatrix: Array<Array<number>>) {
    const playerMoveableLevel: Array<Array<number>> = []
    levelMatrix.map((row) => {
      const cleanedRow: Array<number> = []
      playerMoveableLevel.push(cleanedRow)
      row.map((tile) => {
        cleanedRow.push(tile === 1 ? 1 : 0)
      })
    })
    this.level = new Pathfinding.Grid(playerMoveableLevel)
  },

  getNextTile(from: [number, number], to: [number,number]) {
    const horizontalMovement = from[0] - to[0]
    const verticalMovement = from[1] - to[1]
    if (horizontalMovement) {
      return { row: (horizontalMovement / Math.abs(horizontalMovement)) + from[0], tile: from[1]}
    }
    else {
      return { row: from[0], tile: (verticalMovement / Math.abs(verticalMovement)) + from[1] }
    }
  },

  onMoveToCoordinates(rowIndex: number, tileIndex: number) {
    const path: Array<[number, number]> = this.finder.findPath(
      this.currentPosition[0],
      this.currentPosition[1],
      rowIndex,
      tileIndex,
      this.level.clone()
    )
    const distanceToWaypoint = []

    const smoothedPath = Pathfinding.Util.smoothenPath(this.level.clone(), path)
    smoothedPath.map((coordinates, index) => {
      if (index + 1 === smoothedPath.length) {
        return
      }
      const fromRow = smoothedPath[index][0]
      const fromTile = smoothedPath[index + 1][0]
      const toRow = smoothedPath[index + 0][1]
      const toTile = smoothedPath[index + 1][1]
      const distance = Math.abs((fromRow - fromTile) + (toRow - toTile))
      distanceToWaypoint.push(distance)
    })
    let tween

    distanceToWaypoint.map((distance, index) => {
      const nextTween = {
        from: { row: smoothedPath[index][0], tile: smoothedPath[index][1] },
        to: { row: smoothedPath[index + 1][0], tile: smoothedPath[index + 1][1] },
        delay: 1000,
        duration: (distance * 1000) / this.maxTilesPerSecond,
        easing: 'linear',
        start: (state) => {
          this.trigger(coordinatesFromGrid(this.tileSize, state.row, state.tile))
        },
        finish: (state) => {
          this.currentPosition[0] = state.row
          this.currentPosition[1] = state.tile
          this.trigger(coordinatesFromGrid(this.tileSize, state.row, state.tile))
        },
        step: (state) => {
          this.trigger(coordinatesFromGrid(this.tileSize, state.row, state.tile))
        },
      }
      if (typeof tween === 'undefined') {
        tween = this.tweenable.tween(nextTween)
      }
      else {
        tween.tween(nextTween)
      }
    })
  },

  onSetTileSize(size: number) {
    this.tileSize = size
    this.trigger(this.getInitialState())
  }
})