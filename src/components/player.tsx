import * as React from 'react'

interface Props {
}

export default React.createClass<Props, {}>({

  displayName: 'Player',

  render() {
    return (<div style= {{
      borderRadius: '50%',
      height: '100%',
      width: '100%',
      backgroundColor: '#0aa'
    }} />)
  }
})
