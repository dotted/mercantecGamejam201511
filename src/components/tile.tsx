import * as React from 'react'

export interface Props {
  key?: string,
  isWalkable: boolean,
  title?: string,
  size?: number,
  sizePercent?: string,
  onPress?: () => void
}

export default React.createClass<Props, {}>({

  displayName: 'Tile',

  render() {
    const fillColor = this.props.isWalkable ? '#fff' : '#000'
    const size = this.props.size || this.props.sizePercent
    return (<div onClick={this.props.onPress}
                 key={this.props.key}
                 title={this.props.title}
                 style={{
                   cursor: this.props.onPress ? 'pointer' : undefined,
                   backgroundColor: fillColor,
                   width: size,
                   height: size
                 }} />)
  }
})
