/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { ReportsContext } from '../../../context/Session/Reports.context'
import DrawCanvas from '../DrawCanvas/DrawCanvas.component'
import OpenViduVideo from './OpenViduVideo.component'

import styles from './UserVideoFeed.module.scss'

export const UserVideoFeed = ({
  isThumbnail,
  streamManager,
  sendPointer,
  sendStartDrawing,
  sendStopDrawing,
  sendDrawing,
  sendResetDrawing,
  takePhoto,
  setTakePhoto,
  addImagesArray,
  recordingMode,
  sendPausedScreen,
  clearImagesArray,
  sendSignal,
  handleAddSubscriberOnGlassOpen,
  time,
  streamIndex,
  currMainStreams,
  setCurrMainStreams,
  showStreamIndex,
  setShowStreamIndex,
  showThumbnails
}) => {
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)

  const divRef = useRef()

  const { t } = useTranslation()
  const {
    setInboundAudio,
    setoutboundAudio,
    setInboundVideo,
    setOutboundVideo
  } = useContext(ReportsContext)

  const updateStats = useCallback((report, name) => {
    if (name === 'inbound audio') {
      setInboundAudio(report)
    } else if (name === 'inbound video') {
      setInboundVideo(report)
    } else if (name === 'outbound video') {
      setOutboundVideo(report)
    } else if (name === 'outbound audio') {
      setoutboundAudio(report)
    }
  }, [])

  const getNicknameTag = (shorten = false) => {
    try {
      let name = JSON.parse(streamManager?.stream?.connection?.data)?.clientData
      if (shorten && name?.length > 12) {
        name = name.substring(0, 12) + '...'
      }
      return name
    } catch {
      return ''
    }
  }

  const [name, setName] = useState(getNicknameTag(false))

  useEffect(() => {
    function handleResize () {
      if (!isThumbnail) {
        setHeight(divRef.current.clientHeight)
        setWidth(divRef.current.clientWidth)
      }
    }

    if (!isThumbnail & (height === '')) {
      setHeight(divRef.current.clientHeight)
      setWidth(divRef.current.clientWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [streamManager, isThumbnail])

  function getConnectionStats () {
    if (isThumbnail) {
      return
    }
    if (divRef.current) {
      setHeight(divRef.current.clientHeight)
      setWidth(divRef.current.clientWidth)
    }
    streamManager?.stream
      ?.getRTCPeerConnection()
      ?.getStats(null)
      .then((stats) => {
        stats.forEach((report) => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            updateStats(report, 'inbound video')
          }
          if (report.type === 'inbound-rtp' && report.kind === 'audio') {
            updateStats(report, 'inbound audio')
          }
          if (report.type === 'outbound-rtp' && report.kind === 'video') {
            updateStats(report, 'outbound video')
          }
          if (report.type === 'outbound-rtp' && report.kind === 'audio') {
            updateStats(report, 'outbound audio')
          }
        })
      })
  }

  useEffect(async () => {
    const statsInterval = window.setInterval(getConnectionStats, 10000)
    setName(getNicknameTag(false))
    return () => {
      clearInterval(statsInterval)
    }
  }, [streamManager, updateStats])

  return (
    <>
      {streamManager !== undefined && (
        <div
          className={
            isThumbnail ? styles.canvasWrap : styles.canvasWrapSubscriber
          }
          ref={divRef}
        >
          {!showStreamIndex && showThumbnails && (
            <div className={styles.name}>{name}</div>
          )}
          <OpenViduVideo
            streamManager={streamManager}
            isThumbnail={isThumbnail}
            takePhoto={takePhoto}
            setTakePhoto={setTakePhoto}
            addImagesArray={addImagesArray}
            sendPausedScreen={sendPausedScreen}
            clearImagesArray={clearImagesArray}
            sendSignal={sendSignal}
            handleAddSubscriberOnGlassOpen={handleAddSubscriberOnGlassOpen}
            time={time}
            currMainStreams={currMainStreams}
            setCurrMainStreams={setCurrMainStreams}
            setShowStreamIndex={setShowStreamIndex}
            streamIndex={streamIndex}
            showThumbnails={showThumbnails}
            streamId={streamManager?.stream?.streamId}
          />
          {!isThumbnail && recordingMode && showThumbnails && (
            <div className={styles.recording}>{t('Recording')}</div>
          )}
          {!isThumbnail && (
            <DrawCanvas
              sendPointer={sendPointer}
              sendStartDrawing={sendStartDrawing}
              sendStopDrawing={sendStopDrawing}
              sendDrawing={sendDrawing}
              sendResetDrawing={sendResetDrawing}
              height={height}
              width={width}
              streamId={streamManager?.stream?.streamId}
            />
          )}
          {!isThumbnail && showStreamIndex && (
            <div className={styles.streamIndexBox}>
              <h5>{streamIndex + 1}</h5>
            </div>
          )}
        </div>
      )}
    </>
  )
}

UserVideoFeed.propTypes = {
  isThumbnail: PropTypes.bool,
  streamManager: PropTypes.object,
  sendPointer: PropTypes.func,
  sendStartDrawing: PropTypes.func,
  sendStopDrawing: PropTypes.func,
  sendDrawing: PropTypes.func,
  sendResetDrawing: PropTypes.func,
  takePhoto: PropTypes.bool,
  setTakePhoto: PropTypes.func,
  addImagesArray: PropTypes.func,
  recordingMode: PropTypes.bool,
  sendPausedScreen: PropTypes.func,
  clearImagesArray: PropTypes.func,
  sendSignal: PropTypes.func,
  handleAddSubscriberOnGlassOpen: PropTypes.func,
  time: PropTypes.number
}
