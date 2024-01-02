import { OpenVidu } from 'openvidu-browser'
import PropTypes from 'prop-types'
import React, { memo, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DrawCanvasContext } from '../../../context/Session/DrawCanvas.context'
import { CurrentPortalContext } from '../../../context/Shared/CurrentPortal.context'
import { CurrentUserContext } from '../../../context/Shared/CurrentUser.context'
import { NotificationContext } from '../../../context/Shared/Notification.context'
import SessionService from '../../../services/Session/Session.service'
import { theme } from '../../../styles/theme.style'
import { parseSubscriber, routify, trackEvent } from '../../../utils/functions'
import VideoCall from '../VideoCall/VideoCall.component'

const MediaServer = ({
  mySessionId,
  online,
  addRemoteVUToCall,
  addGlassVUToCall,
  openSnackBar
}) => {
  const { me } = useContext(CurrentUserContext)
  const { portal } = useContext(CurrentPortalContext)
  const {
    setDrawingLocation,
    setStartDrawingStatus,
    remoteChangeColor,
    setResetDrawing,
    setPointerLocation,
    setRemoteIsPointing
  } = useContext(DrawCanvasContext)

  const { t } = useTranslation()
  const [OV, setOV] = useState(null)
  const [session, setSession] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [token, setToken] = useState(null)
  const [mainStreamManager, setMainStreamManager] = useState(null)
  const [messageHistory, setMessageHistory] = useState([])
  const [recordingMode, setRecordingMode] = useState(false)
  const [streamID, setStreamID] = useState(null)
  const { setSnackBarMessage, setSnackBarMessageName } =
    useContext(NotificationContext)
  const navigate = useNavigate()
  let clearTimer

  useEffect(() => {
    const OV = new OpenVidu()

    OV.setAdvancedConfiguration({
      forceMediaReconnectionAfterNetworkDrop: true
    })

    OV.enableProdMode()

    setOV(OV)

    const session = OV.initSession()

    setSession(session)

    session.on('connectionCreated', (event) => {
      const userMetadata = JSON.parse(event.connection.data)
      const name = userMetadata.clientData
      if (name !== me.name) {
        setSnackBarMessageName(name, t('joined call'))
      }
    })

    session.on('connectionDestroyed', (event) => {
      handleConnectionDestroyed(event)
    })

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined)
      addSubscriber(subscriber)
    })

    session.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager)
    })

    session.on('recordingStarted', (event) => {
      setSnackBarMessage(t('Recording Started'))
      setRecordingMode(true)
    })

    session.on('recordingStopped', (event) => {
      setSnackBarMessage(t('Recording Stopped'), 'info')
      setRecordingMode(false)
    })

    session.on('sessionDisconnected', (event) => {
      // console.log(event)
      // setConnected(!connected)
    })

    session.on('exception', (exception) => {
      console.warn(exception)
      if (exception.name === 'NO_STREAM_PLAYING_EVENT') {
        setSnackBarMessage(
          t('Failed to receive video. Try refreshing the connection'),
          'error'
        )
      }
    })

    session.on('signal:message', (event) => {
      const from = JSON.parse(event.from.data).clientData
      const message = { from, message: event.data }
      addChatMessage(message)
      if (from !== me.name) {
        setSnackBarMessage(from + ': ' + event.data, 'info')
      }
    })

    session.on('signal:pointer', (event) => {
      const from = JSON.parse(event.from.data).clientData
      if (from !== me.name) {
        const pointer = event.data.split(',')
        setPointerLocation(pointer)
        remoteChangeColor(pointer)
      }
    })

    session.on('signal:remote pointing', (event) => {
      const from = JSON.parse(event.from.data).clientData
      if (from !== me.name) {
        const value = event.data
        if (value === 'true') {
          setRemoteIsPointing(true)
        } else {
          setRemoteIsPointing(false)
        }
      }
    })

    session.on('signal:start drawing', (event) => {
      const from = JSON.parse(event.from.data).clientData
      if (from !== me.name) {
        const pointer = event.data.split(',')
        setDrawingLocation(pointer)
        setStartDrawingStatus(true)
        remoteChangeColor(pointer)
      }
    })

    session.on('signal:stop drawing', (event) => {
      const from = JSON.parse(event.from.data).clientData
      if (from !== me.name) {
        setStartDrawingStatus(false)
      }
    })

    session.on('signal:drawing', (event) => {
      const from = JSON.parse(event.from.data).clientData
      if (from !== me.name) {
        const pointer = event.data.split(',')
        setDrawingLocation(pointer)
      }
    })

    session.on('signal:reset drawing', (event) => {
      const data = event.data
      if (data === 'true') {
        setResetDrawing(true)
      }
    })

    createToken().then((response) => {
      try {
        if (!response.token) {
          setSnackBarMessage(
            'There was an error connecting to the session',
            'error'
          )
          goHome()
          return
        }
        const token = response.token
        session
          .connect(token, {
            clientData: me.name,
            userType: me.userType === 'RemoteVU' ? 'Operator' : me.userType,
            portal: portal.name,
            email: me.email,
            id: me.id
          })
          .then(() => {
            setToken(token)
          })
          .catch((error) => {
            console.log(
              'There was an error connecting to the session:',
              error.code,
              error.message
            )
            setSnackBarMessage(
              'There was an error connecting to the session',
              'error'
            )
            goHome()
          })
      } catch (_) {
        setSnackBarMessage(
          'There was an error connecting to the session',
          'error'
        )
        goHome()
      }
    })

    return () => {
      session.disconnect()
      session.off('streamCreated')
      session.off('connectionCreated')
      session.off('connectionDestroyed')
      session.off('streamPropertyChanged')
      session.off('streamDestroyed')
      session.off('exception')
      session.off('signal:message')
      session.off('signal:start recording')
      session.off('signal:stop recording')
      session.off('signal:start drawing')
      session.off('signal:stop drawing')
      session.off('signal:drawing')
      session.off('signal:reset drawing')
      session.off('signal:end call')
      session.off('sessionDisconnected')
      session.off('recordingStarted')
      session.off('recordingStopped')
    }
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(clearTimer)
    }
  }, [])

  const leaveSession = () => {
    if (session) {
      session.disconnect()
      SessionService.leaveSession(token, mySessionId)
    }
  }

  const sendSignal = async (type, content, connectionObjects = []) => {
    if (session) {
      return session.signal({
        data: content,
        to: connectionObjects,
        type
      })
    }
  }

  const endSession = () => {
    if (session) {
      setSnackBarMessage(t('Call ended'), 'info')
      trackEvent('Call ended')
      leaveSession()
    }
    goHome()
  }

  const endSessionLater = (now = false) => {
    setSnackBarMessage(
      t(
        'You are the last user in the call. Ending the call in 1 minute if no one reconnects'
      ),
      'info'
    )
    if (now) {
      if (getNumberOfParticipants() === 0) {
        endSession()
      }
    } else {
      clearTimer = setTimeout(() => {
        endSessionLater(true)
      }, 60000)
    }
  }

  const getNumberOfParticipants = () => {
    const localSubscribers = subscribers
    let activeConnections = localSubscribers.length
    localSubscribers.forEach((sub) => {
      const userMetadata = JSON.parse(sub.stream?.connection?.data)
      const userType = userMetadata.userType
      if (userType === 'ScreenVU') {
        activeConnections = activeConnections - 1
      }
    })
    return activeConnections
  }

  const createToken = async () => {
    return await SessionService.createToken(me.email, mySessionId, portal.name)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        setSnackBarMessage(
          'There was an error connecting to the session',
          'error'
        )
        goHome()
      })
  }

  const updateMainStreamManager = (stream) => {
    setStreamID(parseSubscriber(stream).id)
    setMainStreamManager(stream)
  }

  const deleteSubscriber = (streamManager) => {
    const localSubscribers = subscribers
    const index = localSubscribers.indexOf(streamManager, 0)
    if (index > -1) {
      localSubscribers.splice(index, 1)
      setSubscribers(localSubscribers.slice())
    }
  }

  const addSubscriber = (subscriber) => {
    const localSubscribers = subscribers
    localSubscribers.push(subscriber)
    setSubscribers(localSubscribers.slice())
  }

  const addChatMessage = (message) => {
    const localMessageArray = messageHistory
    localMessageArray.push(message)
    setMessageHistory(localMessageArray.slice())
  }

  const goHome = () => {
    navigate(`/${routify(theme.HOMEVU)}`)
  }

  const handleConnectionDestroyed = (event) => {
    const userMetadata = JSON.parse(event.connection.data)
    const name = userMetadata.clientData
    if (event.reason === 'disconnect') {
      // user left by choice
      setSnackBarMessageName(name, t('left the call'), 'info')
      if (getNumberOfParticipants() === 0) {
        endSession()
      }
    } else if (event.reason === 'networkDisconnect') {
      // user left due to network issue, wait to see if they rejoin
      setSnackBarMessageName(name, t('lost their connection'), 'error')
      if (getNumberOfParticipants() === 0) {
        endSessionLater()
      }
    }
  }

  if (token == null) {
    return null
  }

  return (
    <VideoCall
      sendSignal={sendSignal}
      setSnackBarMessage={setSnackBarMessage}
      openSnackBar={openSnackBar}
      session={session}
      OV={OV}
      mySessionId={mySessionId}
      token={token}
      mainStreamManager={mainStreamManager}
      setMainStreamManager={setMainStreamManager}
      endSession={endSession}
      recordingMode={recordingMode}
      setRecordingMode={setRecordingMode}
      addChatMessage={addChatMessage}
      messageHistory={messageHistory}
      updateMainStreamManager={updateMainStreamManager}
      subscribers={subscribers}
      online={online}
      addRemoteVUToCall={addRemoteVUToCall}
      addGlassVUToCall={addGlassVUToCall}
      streamID={streamID}
    />
  )
}

MediaServer.propTypes = {
  mySessionId: PropTypes.string,
  online: PropTypes.object,
  addRemoteVUToCall: PropTypes.func,
  addGlassVUToCall: PropTypes.func,
  setSnackBarMessage: PropTypes.func,
  setSnackBarMessageName: PropTypes.func,
  openSnackBar: PropTypes.func
}

export default memo(MediaServer)
