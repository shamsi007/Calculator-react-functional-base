import React from 'react'

export default function Output(props) {
  return (
    <div className="outputScreen" id="display">
        {props.currentValue}
    </div>
  )
}
