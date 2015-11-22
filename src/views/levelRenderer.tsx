import * as React from 'react'
import * as Reflux from 'reflux'

import { coordinatesFromGrid } from '../helpers/position'

import movementActions from '../actions/movementActions'

import Tile from '../components/tile'
import Unit from '../components/unit'
import Player from '../components/player'

import LevelStore from '../stores/levelStore'
import MovementStore from '../stores/movementStore'

interface Props {

}

interface State {
  level?: Array<Array<number>>
}

const rowLength = 28
const tileSizePercent = (1 / rowLength) * 100
movementActions.setTileSize(21.4219)

export default React.createClass<Props, State>({

  mixins: [Reflux.connect(LevelStore, 'level'), Reflux.connect(MovementStore, 'position')],

  render() {
    //console.log(this.state.position)
    const tiles = []
    if (this.state.level) {
      this.state.level.map((row, rowIndex) => {
        row.map((tile, tileIndex) => {
          const isWalkable = tile !== 1
          let callback
          if (isWalkable) {
            callback = () => {
              console.log('moving to', rowIndex, tileIndex)
              movementActions.moveToCoordinates(rowIndex, tileIndex)
            }
          }
          tiles.push(<Tile key={`row${rowIndex}tile${tileIndex}`}
                           title={`Row: ${rowIndex}, Tile: ${tileIndex}`}
                           sizePercent={`${tileSizePercent}%`}
                           isWalkable={isWalkable}
                           onPress={callback} />)
        })
      })
      return (
        <div
          style={{
            position: 'fixed',
            backgroundColor: '#aaa',
            width: '600px',
            height: '600px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
          {tiles}
          <div style={{
            position: 'fixed',
            width: `21.4219px`,
            height: `21.4219px`,
            top: `${this.state.position[1]}`,
            left: `${this.state.position[0]}`
          }}>
            <Unit name={'player'}>
              <Player />
            </Unit>
          </div>
        </div>
      )
    }
    return (<div />)
  }
})
