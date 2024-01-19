import React, {
  createRef,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react'
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import PropTypes from 'prop-types'
import { TbReplace, TbPictureInPictureOn } from 'react-icons/tb'
import { CurrentPortalContext } from '../../../context/Shared/CurrentPortal.context'
import { theme } from '../../../styles/theme.style'
import GlassSettings from '../CallBar/GlassSettings.component'
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from 'react-icons/fa'
// import { useTranslation } from 'react-i18next'
import { trackEvent } from '../../../utils/functions'

import styles from './OpenViduVideo.module.scss'

const OpenViduVideo = ({
  streamManager,
  isThumbnail,
  takePhoto,
  addImagesArray,
  setTakePhoto,
  sendPausedScreen,
  clearImagesArray,
  sendSignal,
  time,
  currMainStreams,
  setCurrMainStreams,
  setShowStreamIndex,
  streamIndex,
  showThumbnails,
  streamId
}) => {
  const videoRef = createRef(null)
  const canvasRef = createRef(null)
  const photoRef = createRef(null)
  const replaceBtnRef = createRef(null)
  const [isLocalVideoPaused, setIsLocalVideoPaused] = useState(false)
  const { portal } = useContext(CurrentPortalContext)
  const [feedOptionsIsOpen, setFeedOptionsIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [audio, setAudio] = useState(true)

  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true)

  const isPiPSupported = document.pictureInPictureEnabled

  const connectionObject = currMainStreams
    ? [currMainStreams[streamIndex]?.stream?.connection]
    : []

  useEffect(() => {
    if (streamManager) {
      streamManager.addVideoElement(videoRef.current)
      takePhotoNow()
    }
  }, [streamManager])

  useEffect(() => {
    if (takePhoto) {
      takePhotoNow()
    }
  }, [takePhoto])

  const capturePhoto = (sendToGlass = false) => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (canvas) {
      const context = canvas.getContext('2d')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight

      context.drawImage(
        video,
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      )

      if (sendToGlass) {
        canvas.toBlob(function (blob) {
          sendPausedScreen(blob)
        }, 'image/png')
      } else {
        canvas.toBlob(function (blob) {
          const url = URL.createObjectURL(blob)
          addImagesArray(url)
        }, 'image/png')
      }
    }
  }

  const takePhotoNow = () => {
    if (!isThumbnail & takePhoto) {
      setTakePhoto(false)
      capturePhoto(false)
    }
  }

  const toggleVideo = () => {
    if (videoRef) {
      const video = videoRef.current
      if (isLocalVideoPaused) {
        video.play()
        clearImagesArray()
      } else {
        sendSignal('video pause', streamId)
        video.pause()
        capturePhoto(true)
      }
      setIsLocalVideoPaused(!isLocalVideoPaused)
    }
  }

  const handleSwapBtnClick = (event) => {
    setShowStreamIndex((prevShow) => !prevShow)
    setFeedOptionsIsOpen(!feedOptionsIsOpen)
    setAnchorEl(event.currentTarget)
  }

  const handleFeedReplace = (index) => {
    setCurrMainStreams((prev) => {
      const newStreams = [...prev]
      newStreams[index] = streamManager
      return newStreams
    })
    setFeedOptionsIsOpen(false)
    setShowStreamIndex(false)
  }

  const handlePiP = async () => {
    try {
      if (videoRef.current !== document.pictureInPictureElement) {
        await videoRef.current.requestPictureInPicture()
      } else {
        await document.exitPictureInPicture()
      }
    } catch (error) {
      console.error('Failed to enter Picture-in-Picture mode', error)
    }
  }

  const toggleAudio = useCallback(() => {
    trackEvent('Audio Change', {
      audio: !audio
    })
    if (!audio) {
      sendSignal('audio on', audio, connectionObject)
    } else {
      sendSignal('audio off', audio, connectionObject)
    }
    setAudio(!audio)
  }, [sendSignal, audio])

  return (
    <>
      {!isThumbnail && (
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef}></canvas>
          <div>
            <img
              ref={photoRef}
              alt="The screen capture will appear in this box."
            />
          </div>
        </div>
      )}
      <div
        className={`${styles.relativePosition} ${
          !isThumbnail && styles.videoAround
        }`}
      >
        <video
          poster={theme.PROFILE}
          autoPlay={true}
          ref={videoRef}
          className={isThumbnail ? styles.publisher : styles.subscriber}
        />
        {!isThumbnail && portal.role !== 'Viewer' && showThumbnails && (
          <>
            {!isSettingsExpanded && (
              <button onClick={toggleAudio} className={styles.muteButton}>
                {audio
                  ? (
                  <FaMicrophoneAlt className={styles.muteButton__icon} />
                    )
                  : (
                  <FaMicrophoneAltSlash className={styles.muteButton__icon} />
                    )}
              </button>
            )}
            <div className={styles.sidebar}>
              <GlassSettings
                sendSignal={sendSignal}
                currMainStreams={currMainStreams}
                streamIndex={streamIndex}
                toggleVideo={toggleVideo}
                isLocalVideoPaused={isLocalVideoPaused}
                time={time}
                isSettingsExpanded={isSettingsExpanded}
                setIsSettingsExpanded={setIsSettingsExpanded}
                audio={audio}
                toggleAudio={toggleAudio}
              />
            </div>
          </>
        )}
        {isThumbnail && portal.role !== 'Viewer' && (
          <div>
            {isPiPSupported && (
              <button
                variant="contained"
                className={`${styles.videoButton} ${styles.pipButton}`}
                title="Picture in Picture"
                onClick={handlePiP}
              >
                <TbPictureInPictureOn />
              </button>
            )}
            <button
              ref={replaceBtnRef}
              variant="contained"
              className={`${styles.videoButton} ${styles.swapButton}`}
              title="Replace Feed"
              onClick={(e) => handleSwapBtnClick(e)}
            >
              <TbReplace />
            </button>
            {anchorEl && (
              <ClickAwayListener>
                <Popper
                  open={feedOptionsIsOpen}
                  anchorEl={anchorEl}
                  placement="bottom"
                  className={styles.swapFeedOptions}
                >
                  <div className={styles.swapFeedOptions__container}>
                    <h5>Select feed:</h5>
                    {currMainStreams.map((stream, index) => (
                      <button
                        key={`swap-option-${index}`}
                        className={styles.swapFeedOptions__button}
                        onClick={() => handleFeedReplace(index)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </Popper>
              </ClickAwayListener>
            )}
          </div>
        )}
      </div>
    </>
  )
}

OpenViduVideo.propTypes = {
  streamManager: PropTypes.object,
  isThumbnail: PropTypes.bool,
  takePhoto: PropTypes.bool,
  setTakePhoto: PropTypes.func,
  addImagesArray: PropTypes.func,
  sendPausedScreen: PropTypes.func,
  clearImagesArray: PropTypes.func,
  sendSignal: PropTypes.func,
  handleAddSubscriberOnGlassOpen: PropTypes.func,
  time: PropTypes.number
}

export default OpenViduVideo
