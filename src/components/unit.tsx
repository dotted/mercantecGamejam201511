import * as React from 'react'

interface Props {
  children?: React.ReactChild,
  name: string
}

export default React.createClass<Props, {}>({

  displayName: 'Unit',

  render() {
    const fillColor = this.props.isWalkable ? '#fff' : '#000'
    const size = this.props.size || this.props.sizePercent
    return (this.props.children)
  }
})
