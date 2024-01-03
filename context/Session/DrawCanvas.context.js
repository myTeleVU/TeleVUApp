import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import { trackEvent } from '../../utils/functions'
export const DrawCanvasContext = createContext()

export const DrawCanvasContextProvider = (props) => {
  // local user is pointing
  const [isPointing, setIsPointing] = useState(false)
  // local user is drawing
  const [isDrawing, setIsDrawing] = useState(false)
  // remote user has drawing on
  const [remoteIsPointing, setRemoteIsPointing] = useState(false)
  // upon toggle, clears all drawing
  const [resetDrawing, setResetDrawing] = useState(false)
  const [pointerLocation, setPointerLocation] = useState(null)
  // used to start drawing path
  const [startDrawingStatus, setStartDrawingStatus] = useState(false)
  // coordinates to draw
  const [drawingLocation, setDrawingLocation] = useState(null)
  const [color, setColor] = useState('yellow')

  const changeColor = (color) => {
    trackEvent('User Changed Color', {
      color
    })
    setColor(color)
  }

  const remoteChangeColor = (pointer) => {
    if (color !== pointer[4]) {
      setColor(pointer[4])
    }
  }

  return (
    <DrawCanvasContext.Provider
      value={{
        isDrawing,
        drawingLocation,
        color,
        changeColor,
        remoteChangeColor,
        resetDrawing,
        setResetDrawing,
        setIsDrawing,
        setDrawingLocation,
        startDrawingStatus,
        setStartDrawingStatus,
        pointerLocation,
        setPointerLocation,
        remoteIsPointing,
        setRemoteIsPointing,
        isPointing,
        setIsPointing
      }}
    >
      {props.children}
    </DrawCanvasContext.Provider>
  )
}

DrawCanvasContextProvider.propTypes = {
  children: PropTypes.object
}
