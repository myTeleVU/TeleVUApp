import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { CamVUContextProvider } from '../../../context/CamVU/CamVU.context'
import { GlassVUContextProvider } from '../../../context/GlassVU/GlassVU.context'
import { RemoteVUContextProvider } from '../../../context/RemoteVU/RemoteVU.context'
import { ReportsContextProvider } from '../../../context/Session/Reports.context'
import { CurrentPortalContext } from '../../../context/Shared/CurrentPortal.context'
import { CurrentUserContext } from '../../../context/Shared/CurrentUser.context'
import { NotificationContext } from '../../../context/Shared/Notification.context'
import SessionService from '../../../services/Session/Session.service'
import {
  permissionConstraints,
  resolutionNumbers
} from '../../../utils/constants'
import {
  getMicrophone,
  getVideo,
  getWebcam,
  isScreenVU,
  trackEvent
} from '../../../utils/functions'
import AddCamToCall from '../AddCamToCall/AddCamToCall.component'
import AddGlassToCall from '../AddGlassToCall/AddGlassToCall.component'
import AddRemoteToCall from '../AddRemoteToCall/AddRemoteToCall.component'
import AddScreenToCall from '../AddScreenToCall/AddScreenToCall.component'
import CallBar from '../CallBar/CallBar.component'
import VideoBox from '../VideoBox/VideoBox.component'

import styles from './VideoCall.module.scss'
// todo: move session info fetching to be its own context. Recording mode + sendToggleRecording to move down
// move audio, video, screen, time into context
// move foundwebcam down to callbar

const VideoCall = ({
  openSnackBar,
  session,
  OV,
  mySessionId,
  token,
  mainStreamManager,
  setMainStreamManager,
  endSession,
  recordingMode,
  setRecordingMode,
  sendSignal,
  online,
  subscribers,
  addGlassVUToCall,
  addChatMessage,
  messageHistory,
  updateMainStreamManager,
  addRemoteVUToCall,
  streamID
}) => {
  const { me } = useContext(CurrentUserContext)
  const { portal } = useContext(CurrentPortalContext)
  const { setSnackBarMessage } = useContext(NotificationContext)

  const { t } = useTranslation()

  const [time, setTime] = useState(null)

  const [video, setVideo] = useState(getVideo(me))
  const [foundWebcams, setFoundWebcams] = useState(null)
  const [cameraSelected, setCameraSelected] = useState('')

  const [audio, setAudio] = useState(getMicrophone(me))
  const [foundMicrophones, setFoundMicrophones] = useState(null)
  const [microphoneSelected, setMicrophoneSelected] = useState('')

  const [screen, setScreen] = useState(false)
  const [publisher, setPublisher] = useState(null)
  const [showAddGlassToCall, setShowAddGlassToCall] = useState(false)
  const [showAddRemoteToCall, setShowAddRemoteToCall] = useState(false)
  const [showAddScreenToCall, setShowAddScreenToCall] = useState(false)
  const [showAddCamToCall, setShowAddCamToCall] = useState(false)
  const [chat, setChat] = useState(false)
  const [qrCode, setQrCode] = useState(false)
  const [flipHorizontalMode, setFlipHorizontalMode] = useState(false)
  const [screenvuState, setScreenvuState] = useState(false)
  const [imagesArray, setImagesArray] = useState([])
  const [currentImage, setCurrentImage] = useState(null)
  const [imageEditorState, setImageEditorState] = useState(false)
  const [takePhoto, _setTakePhoto] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(true)

  useEffect(() => {
    connectToCall()
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  const setTakePhoto = useCallback((value) => {
    _setTakePhoto(value)
    if (value === true) {
      setDrawerOpen(true)
      trackEvent('User Took Screenshot')
    }
  }, [])

  const connectToCall = async () => {
    setTime(Date.now())
    fetchSessionInfo()
    updateWebcamsAndMicrophones()
  }

  const updateWebcamsAndMicrophones = async () => {
    try {
      const foundWebcams = {}
      const foundMicrophones = {}
      await navigator.mediaDevices.getUserMedia(permissionConstraints)

      const devices = await OV.getDevices()
      devices.forEach((device) => {
        if (device.kind === 'videoinput') {
          foundWebcams[device.deviceId] = device.label
        } else if (device.kind === 'audioinput') {
          foundMicrophones[device.deviceId] = device.label
        }
      })

      setFoundWebcams(foundWebcams)
      if (me.userType === 'ScreenVU') {
        setCameraSelected(getWebcam(me, foundWebcams))
      }

      setFoundMicrophones(foundMicrophones)

      initPublisher(audio, video, cameraSelected, microphoneSelected)
    } catch (error) {
      setSnackBarMessage(
        t(
          'Access to your camera or microphone was denied by the browser. Check permissions'
        ),
        'error'
      )
      initPublisher(audio, false, '')
    }
  }

  const copyLink = useCallback(() => {
    setSnackBarMessage(t('Copied link to clipboard'))
    navigator.clipboard.writeText(
      process.env.REACT_APP_FRONTEND +
        '/session/?join_session_id=' +
        mySessionId
    )
  }, [mySessionId])

  const fetchSessionInfo = () => {
    SessionService.fetchSessionInfo(token, mySessionId).then((response) => {
      if (response.data) {
        setSnackBarMessage(t('Recording Started'))
        setRecordingMode(true)
      }
    })
  }

  const initPublisher = async (
    audio,
    video,
    cameraSelected,
    microphoneSelected = ''
  ) => {
    if (portal.role === 'Viewer') {
      return
    }
    const mySession = session
    const publisherSettings = {
      audioSource:
        audio && microphoneSelected !== '' ? microphoneSelected : undefined,
      videoSource: video
        ? cameraSelected !== ''
          ? cameraSelected
          : undefined
        : false,
      publishAudio: audio,
      publishVideo: video,
      resolution: me.preferredWebcamResolution
        ? resolutionNumbers[me.preferredWebcamResolution]
        : '1280x720',
      frameRate: me.preferredFrameRate ? me.preferredFrameRate : 30,
      insertMode: 'APPEND',
      mirror: false
    }
    const myPublisher = OV.initPublisher(
      undefined,
      publisherSettings,
      (error) => {
        if (error) {
          console.log('Error', error)
          setSnackBarMessage(
            t(
              'Access to your microphone / camera was denied by the browser. Check permissions and whether device is occupied elsewhere'
            ),
            'error'
          )
          setAudio(false)
          setVideo(false)
          setCameraSelected('')
          setMicrophoneSelected('')
        } else {
          trackEvent('User In Video Call')
          if (publisher) {
            mySession.unpublish(publisher)
          }
          mySession.publish(myPublisher)
          setPublisher(myPublisher)
        }
      }
    )
  }

  const sendVideoState = (value) => {
    if (!isScreenVU(me)) {
      sendSignal('video state', value)
    }
  }

  const turnOnScreenShare = () => {
    const newPublisher = OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: 'screen',
      publishAudio: audio,
      publishVideo: true,
      frameRate: 30,
      insertMode: 'APPEND',
      mirror: false
    })

    newPublisher.once('accessAllowed', () => {
      newPublisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .addEventListener('ended', () => {
          initPublisher(audio, video, cameraSelected, microphoneSelected)
          setScreen(false)
          sendVideoState('false')
        })

      const mySession = session
      mySession.unpublish(publisher)
      mySession.publish(newPublisher)

      setScreen(true)
      setPublisher(newPublisher)

      trackEvent('User Started Screensharing')
      sendVideoState('true')
    })

    newPublisher.once('accessDenied', () => {
      console.warn('ScreenShare: Access Denied')
    })
  }

  const toggleScreenShare = useCallback(() => {
    if (!screen) {
      turnOnScreenShare()
    } else {
      initPublisher(audio, video, cameraSelected, microphoneSelected)
      setScreen(false)
      sendVideoState('false')
    }
  }, [
    screen,
    video,
    turnOnScreenShare,
    initPublisher,
    audio,
    cameraSelected,
    microphoneSelected,
    sendVideoState
  ])

  const toggleAudioOnOff = useCallback(() => {
    if (audio) {
      publisher.publishAudio(false)
    } else {
      initPublisher(true, video, cameraSelected, microphoneSelected)
    }
    setAudio(!audio)
  }, [
    audio,
    video,
    cameraSelected,
    microphoneSelected,
    publisher,
    initPublisher
  ])

  const toggleVideoOnOff = useCallback(() => {
    const newVideoState = !video
    sendVideoState(newVideoState.toString())
    initPublisher(audio, newVideoState, cameraSelected, microphoneSelected)
    setVideo(newVideoState)
  }, [
    audio,
    video,
    cameraSelected,
    microphoneSelected,
    publisher,
    initPublisher
  ])

  const sendToggleRecording = useCallback(() => {
    if (!recordingMode) {
      setSnackBarMessage(t('Trying to start recording'), 'info')
      trackEvent('User Started Recording')
      SessionService.startRecording(
        token,
        mySessionId,
        me.recordingMode,
        portal.name
      )
    } else {
      setSnackBarMessage(t('Trying to stop recording'), 'info')
      trackEvent('User Stopped Recording')
      SessionService.stopRecording(token, mySessionId, portal.name)
    }
  }, [recordingMode, token, mySessionId, recordingMode, sendSignal])

  const toggleFlipHorizontalMode = useCallback(() => {
    trackEvent('User Flipped Video')
    if (!flipHorizontalMode) {
      mainStreamManager.stream
        .applyFilter('GStreamerFilter', {
          command: 'videoflip method=horizontal-flip'
        })
        .then(() => {
          console.log('Video rotated!')
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      mainStreamManager.stream
        .removeFilter()
        .then(() => {
          console.log('Filter removed')
        })
        .catch((error) => {
          console.error(error)
        })
    }
    setFlipHorizontalMode(!flipHorizontalMode)
  }, [flipHorizontalMode])

  const toggleWebcam = useCallback(
    async (e) => {
      trackEvent('User Toggled Video')
      const value = e.target.value
      setCameraSelected(value)
      await updateWebcamsAndMicrophones()
      initPublisher(audio, video, value, microphoneSelected)
    },
    [audio, video, updateWebcamsAndMicrophones, initPublisher, sendVideoState]
  )

  const toggleMicrophone = useCallback(
    async (e) => {
      trackEvent('User Toggled Microphone')
      const value = e.target.value
      setMicrophoneSelected(value)
      await updateWebcamsAndMicrophones()
      initPublisher(audio, video, cameraSelected, value)
    },
    [audio, video, cameraSelected, updateWebcamsAndMicrophones, initPublisher]
  )

  const addRemoteVU = useCallback(
    (to, id) => {
      setShowAddRemoteToCall(false)
      addRemoteVUToCall(to, id)
    },
    [addRemoteVUToCall]
  )

  const addScreenVU = useCallback(
    (to, id) => {
      setShowAddScreenToCall(false)
      addRemoteVUToCall(to, id)
    },
    [addRemoteVUToCall]
  )

  const addGlassVU = useCallback(
    (to, id) => {
      setShowAddGlassToCall(false)
      addGlassVUToCall(to, id)
    },
    [addGlassVUToCall]
  )

  const addCamera = useCallback(
    async (deviceID) => {
      setShowAddCamToCall(false)
      setSnackBarMessage(t('Adding Device'), 'info')
      await SessionService.addCamera(token, mySessionId, deviceID)
    },
    [token, mySessionId]
  )

  const removeCamera = useCallback(
    async (connectionId) => {
      setShowAddCamToCall(false)
      setSnackBarMessage(t('Removing device'), 'info')
      await SessionService.removeConnection(token, mySessionId, connectionId)
    },
    [token, mySessionId]
  )

  const toggleScreenVU = useCallback(() => {
    let value
    if (screenvuState) {
      value = 'ScreenVU Off'
    } else {
      value = 'ScreenVU On'
    }
    sendSignal('show screenvu', value)
    setScreenvuState(!screenvuState)
  }, [screenvuState, sendSignal])

  const addImagesArray = useCallback(
    (data) => {
      const images = imagesArray
      images.unshift(data)
      setImagesArray(images.slice())
    },
    [imagesArray]
  )

  const removeImage = useCallback(
    (index) => {
      const images = imagesArray
      images.splice(index, 1)
      setImagesArray(images.slice())
    },
    [imagesArray]
  )

  const clearImagesArray = useCallback(() => {
    sendSignal('clear image')
  }, [sendSignal])

  const sendImage = useCallback(
    async (file) => {
      trackEvent('User Sent Image')
      const formData = new FormData()
      const blob = await fetch(file).then((r) => r.blob())
      const name = uuidv4() + '.png'
      formData.append('sampleFile', blob, name)
      SessionService.sendImage(formData)
        .then(() => {
          sendSignal('image', name)
          setSnackBarMessage(t('File sent'))
        })
        .catch(() => {
          setSnackBarMessage(t('File was not sent'), 'error')
        })
    },
    [sendSignal]
  )

  const saveImage = useCallback(
    async (file) => {
      trackEvent('User Sent Image')
      const formData = new FormData()
      const blob = await fetch(file).then((r) => r.blob())
      const name = uuidv4() + '.png'
      formData.append('sampleFile', blob, name)
      formData.append('mySessionId', mySessionId)
      SessionService.saveImage(formData)
        .then(() => {
          setSnackBarMessage(t('File saved'))
        })
        .catch(() => {
          setSnackBarMessage(t('File was not saved'), 'error')
        })
    },
    [sendSignal]
  )

  const sendPausedScreen = useCallback(
    async (blob) => {
      const formData = new FormData()
      const name = uuidv4() + '.png'
      formData.append('sampleFile', blob, name)
      SessionService.sendImage(formData)
        .then(() => {
          sendSignal('image', name)
          setSnackBarMessage(t('Screen paused on glasses'))
        })
        .catch(() => {
          setSnackBarMessage(t('Screen not paused on glasses'), 'error')
        })
    },
    [sendSignal]
  )

  const sendMessage = useCallback(
    (value) => {
      sendSignal('message', value)
    },
    [sendSignal]
  )

  const sendPointer = useCallback(
    (value) => {
      sendSignal('pointer', value)
    },
    [sendSignal]
  )

  // TODO: move this logic to the view ports
  const sendStartDrawing = useCallback(
    (value) => {
      sendSignal('start drawing', value)
    },
    [sendSignal, streamID]
  )

  const sendStopDrawing = useCallback(
    (value) => {
      sendSignal('stop drawing', value)
    },
    [sendSignal]
  )

  const sendDrawing = useCallback(
    (value) => {
      sendSignal('drawing', value)
    },
    [sendSignal]
  )

  const sendResetDrawing = useCallback(
    (value = 'true') => {
      sendSignal('reset drawing', value)
    },
    [sendSignal]
  )

  const toggleChat = useCallback(() => {
    setChat(!chat)
  }, [chat])

  const toggleQrCode = useCallback(() => {
    setQrCode(!qrCode)
  }, [qrCode])

  return (
    <div className={styles.callDiv}>
      <ReportsContextProvider>
        {!imageEditorState && (
          <CallBar
            sendSignal={sendSignal}
            handleAddGlassToCallOpen={() => setShowAddGlassToCall(true)}
            handleAddRemoteToCallOpen={() => setShowAddRemoteToCall(true)}
            handleAddScreenToCallOpen={() => setShowAddScreenToCall(true)}
            handleAddCamToCallOpen={() => setShowAddCamToCall(true)}
            toggleScreenShare={toggleScreenShare}
            endSession={endSession}
            audio={audio}
            toggleAudioOnOff={toggleAudioOnOff}
            time={time}
            chat={chat}
            toggleChat={toggleChat}
            setTakePhoto={setTakePhoto}
            recordingMode={recordingMode}
            sendToggleRecording={sendToggleRecording}
            drawerOpen={drawerOpen}
            openDrawer={() => setDrawerOpen(!drawerOpen)}
            qrCode={qrCode}
            toggleQrCode={toggleQrCode}
            flipHorizontalMode={flipHorizontalMode}
            toggleFlipHorizontalMode={toggleFlipHorizontalMode}
            video={video}
            foundWebcams={foundWebcams}
            toggleWebcam={toggleWebcam}
            cameraSelected={cameraSelected}
            microphoneSelected={microphoneSelected}
            screen={screen}
            showThumbnails={showThumbnails}
            foundMicrophones={foundMicrophones}
            toggleVideoOnOff={toggleVideoOnOff}
            toggleMicrophone={toggleMicrophone}
          />
        )}
        <VideoBox
          publisher={publisher}
          handleMainVideoStream={updateMainStreamManager}
          subscribers={subscribers}
          mainStreamManager={mainStreamManager}
          imageEditorState={imageEditorState}
          recordingMode={recordingMode}
          sendPointer={sendPointer}
          sendStartDrawing={sendStartDrawing}
          sendStopDrawing={sendStopDrawing}
          sendDrawing={sendDrawing}
          sendResetDrawing={sendResetDrawing}
          takePhoto={takePhoto}
          setTakePhoto={setTakePhoto}
          addImagesArray={addImagesArray}
          currentImage={currentImage}
          setImageEditorState={setImageEditorState}
          setDrawerOpen={setDrawerOpen}
          sendPausedScreen={sendPausedScreen}
          clearImagesArray={clearImagesArray}
          sendSignal={sendSignal}
          time={time}
          imagesArray={imagesArray}
          setCurrentImage={setCurrentImage}
          toggleImageEditor={() => setImageEditorState(!imageEditorState)}
          sendImage={sendImage}
          removeImage={removeImage}
          saveImage={saveImage}
          drawerOpen={drawerOpen}
          closeDrawer={closeDrawer}
          chat={chat}
          sendMessage={sendMessage}
          messageHistory={messageHistory}
          setMessageHistory={addChatMessage}
          toggleChat={toggleChat}
          setChat={setChat}
          showThumbnails={showThumbnails}
          setShowThumbnails={setShowThumbnails}
        />
      </ReportsContextProvider>
      <RemoteVUContextProvider>
        <>
          <AddRemoteToCall
            open={showAddRemoteToCall}
            handleClose={() => setShowAddRemoteToCall(false)}
            online={online}
            addToCall={addRemoteVU}
            mySessionId={mySessionId}
            subscribers={subscribers}
            copyLink={copyLink}
          />
          <AddScreenToCall
            open={showAddScreenToCall}
            handleClose={() => setShowAddScreenToCall(false)}
            online={online}
            addToCall={addScreenVU}
            mySessionId={mySessionId}
            subscribers={subscribers}
            copyLink={copyLink}
          />
        </>
      </RemoteVUContextProvider>
      <GlassVUContextProvider>
        <AddGlassToCall
          open={showAddGlassToCall}
          handleClose={() => setShowAddGlassToCall(false)}
          online={online}
          addToCall={addGlassVU}
          mySessionId={mySessionId}
        />
      </GlassVUContextProvider>
      <CamVUContextProvider>
        <AddCamToCall
          open={showAddCamToCall}
          handleClose={() => setShowAddCamToCall(false)}
          addToCall={addCamera}
          removeCamera={removeCamera}
          mySessionId={mySessionId}
          toggleScreenVU={toggleScreenVU}
          screenvuState={screenvuState}
          subscribers={subscribers}
        />
      </CamVUContextProvider>
    </div>
  )
}

VideoCall.propTypes = {
  setSnackBarMessage: PropTypes.func,
  openSnackBar: PropTypes.func,
  session: PropTypes.object,
  OV: PropTypes.object,
  mySessionId: PropTypes.string,
  token: PropTypes.string,
  mainStreamManager: PropTypes.object,
  setMainStreamManager: PropTypes.func,
  endSession: PropTypes.func,
  recordingMode: PropTypes.bool,
  setRecordingMode: PropTypes.func,
  sendSignal: PropTypes.func,
  online: PropTypes.object,
  subscribers: PropTypes.array,
  addGlassVUToCall: PropTypes.func,
  addChatMessage: PropTypes.func,
  messageHistory: PropTypes.array,
  updateMainStreamManager: PropTypes.func,
  addRemoteVUToCall: PropTypes.func,
  streamID: PropTypes.string
}

export default memo(VideoCall)
