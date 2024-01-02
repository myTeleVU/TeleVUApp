import PropTypes from 'prop-types'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { DrawCanvasContext } from '../../../context/Session/DrawCanvas.context'

import styles from './DrawCanvas.module.scss'

const DrawCanvas = ({
  sendPointer,
  sendStartDrawing,
  sendStopDrawing,
  sendDrawing,
  sendResetDrawing,
  width,
  height,
  streamId
}) => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const imgRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isMouseInside, setIsMouseInside] = useState(false)
  const {
    color,
    resetDrawing,
    setResetDrawing,
    isDrawing,
    startDrawingStatus,
    drawingLocation,
    pointerLocation,
    remoteIsPointing,
    isPointing
  } = useContext(DrawCanvasContext)

  const drawingActivated = !(!isDrawing && !remoteIsPointing && !isPointing)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = width * 2
    canvas.height = height * 2
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const context = canvas.getContext('2d')
    context.scale(2, 2)
    context.lineCap = 'round'
    context.strokeStyle = color
    context.lineWidth = 5
    contextRef.current = context
  }, [])

  useEffect(() => {
    if (resetDrawing) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )
      setResetDrawing(false)
    }
  }, [resetDrawing])

  useEffect(() => {
    contextRef.current.strokeStyle = color
  }, [color])

  useEffect(() => {
    if (startDrawingStatus & !isDragging) {
      const stream = drawingLocation[5]
      if (stream !== streamId) {
        setIsMouseInside(false)
        return
      } else {
        setIsMouseInside(true)
      }
      contextRef.current.beginPath()
      const points = transform(drawingLocation)
      const x = points[0]
      const y = points[1]
      contextRef.current.moveTo(x, y)
      setIsDragging(true)
    } else if (!startDrawingStatus & isDragging) {
      contextRef.current.closePath()
      setIsDragging(false)
    } else {
      setIsDragging(false)
    }
  }, [startDrawingStatus])

  useEffect(() => {
    if (isDragging) {
      const stream = drawingLocation[5]
      if (stream !== streamId) {
        setIsMouseInside(false)
        return
      } else {
        setIsMouseInside(true)
      }
      const context = contextRef.current
      const points = transform(drawingLocation)
      const x = points[0]
      const y = points[1]
      context.lineTo(x, y)
      context.stroke()
    }
  }, [drawingLocation])

  useEffect(() => {
    if (pointerLocation) {
      const stream = pointerLocation[5]
      if (stream !== streamId) {
        setIsMouseInside(false)
        return
      } else {
        setIsMouseInside(true)
      }
      const context = contextRef.current
      const img = imgRef.current
      context.fillStyle = '#c82124'
      const points = transform(pointerLocation)
      const x = points[0]
      const y = points[1]
      if (img) {
        img.style.left = x + 'px'
        img.style.top = y + 'px'
      }
    }
  }, [pointerLocation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = width * 2
      canvas.height = height * 2
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const context = canvas.getContext('2d')
      context.scale(2, 2)
      context.lineCap = 'round'
      context.strokeStyle = color
      context.lineWidth = 5
      contextRef.current = context
      if (sendResetDrawing) {
        sendResetDrawing()
      }
    }
  }, [width, height])

  const startDrawing = ({ nativeEvent }) => {
    if (!isDrawing) {
      return
    }
    const { type } = nativeEvent

    let a
    let b
    let rect

    if (type === 'touchstart') {
      const { targetTouches, target } = nativeEvent
      rect = target.getBoundingClientRect()
      a = targetTouches[0].pageX - rect.left
      b = targetTouches[0].pageY - rect.top
    } else {
      const { offsetX, offsetY } = nativeEvent
      a = offsetX
      b = offsetY
    }

    contextRef.current.beginPath()
    contextRef.current.moveTo(a, b)
    setIsDragging(true)
    sendStartDrawing(
      String(
        a + ',' + b + ',' + width + ',' + height + ',' + color + ',' + streamId
      )
    )
  }

  const finishDrawing = () => {
    if (!isDrawing) {
      return
    }
    contextRef.current.closePath()
    setIsDragging(false)
    sendStopDrawing()
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing && !isPointing) {
      return
    }

    const { type } = nativeEvent

    let a
    let b
    let rect

    if (type === 'touchmove') {
      const { targetTouches, target } = nativeEvent
      rect = target.getBoundingClientRect()
      a = targetTouches[0].pageX - rect.left
      b = targetTouches[0].pageY - rect.top
    } else {
      const { offsetX, offsetY } = nativeEvent
      a = offsetX
      b = offsetY
    }

    if ((isDrawing || isPointing) && isMouseInside) {
      const canvas = canvasRef.current
      const img = imgRef.current
      const context = canvas.getContext('2d')
      context.fillStyle = '#c82124'
      img.style.left = a + 'px'
      img.style.top = b + 'px'
      sendPointer(
        String(
          a +
            ',' +
            b +
            ',' +
            width +
            ',' +
            height +
            ',' +
            color +
            ',' +
            streamId
        )
      )
    }

    if (isDrawing & isDragging && isMouseInside) {
      const img = imgRef.current
      contextRef.current.lineTo(a, b)
      contextRef.current.stroke()
      img.style.left = a + 'px'
      img.style.top = b + 'px'
      sendDrawing(
        String(
          a +
            ',' +
            b +
            ',' +
            width +
            ',' +
            height +
            ',' +
            color +
            ',' +
            streamId
        )
      )
    }
  }

  const transform = (drawingLocation) => {
    let x = drawingLocation[0]
    let y = drawingLocation[1]
    if (drawingLocation[2] && drawingLocation[3]) {
      const widthFactor = width / parseFloat(drawingLocation[2])
      const heightFactor = height / parseFloat(drawingLocation[3])
      x = widthFactor * parseFloat(x)
      y = heightFactor * parseFloat(y)
      return [x, y]
    } else {
      return [drawingLocation[0], drawingLocation[1]]
    }
  }

  return (
    <div>
      {drawingActivated && isMouseInside && (
        <img
          ref={imgRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 75,
            height: 75,
            opacity: 0.82
          }}
          src={process.env.PUBLIC_URL + `/assets/pngs/hand-${color}.png`}
        />
      )}
      <canvas
        className={styles.canvas}
        onMouseEnter={() => setIsMouseInside(true)}
        onMouseLeave={() => setIsMouseInside(false)}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={finishDrawing}
        ref={canvasRef}
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}

DrawCanvas.propTypes = {
  sendPointer: PropTypes.func,
  sendStartDrawing: PropTypes.func,
  sendStopDrawing: PropTypes.func,
  sendDrawing: PropTypes.func,
  sendResetDrawing: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number
}

export default DrawCanvas
