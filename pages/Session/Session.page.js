import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import MediaServer from '../../components/Session/MediaServer/MediaServer.component'
import { DrawCanvasContextProvider } from '../../context/Session/DrawCanvas.context'
import PropTypes from 'prop-types'
import { theme } from '../../styles/theme.style'
import { routify } from '../../utils/functions'

// change chat to be context

const Session = ({
  openSnackBar,
  online,
  addRemoteVUToCall,
  addGlassVUToCall
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mySessionId, setMySessionId] = React.useState(null)
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/' + routify(theme.HOMEVU))
  }

  const connectToCall = () => {
    const sessionId = searchParams.get('join_session_id')
    if (sessionId) {
      setMySessionId(sessionId)
      searchParams.delete('join_session_id')
      setSearchParams(searchParams)
    } else {
      goHome()
    }
  }

  React.useEffect(() => {
    connectToCall()
    return () => {
      setMySessionId(null)
    }
  }, [])

  return mySessionId
    ? (
    <DrawCanvasContextProvider>
      <MediaServer
        openSnackBar={openSnackBar}
        mySessionId={mySessionId}
        online={online}
        addRemoteVUToCall={addRemoteVUToCall}
        addGlassVUToCall={addGlassVUToCall}
      />
    </DrawCanvasContextProvider>
      )
    : null
}

Session.propTypes = {
  openSnackBar: PropTypes.func,
  online: PropTypes.object,
  addRemoteVUToCall: PropTypes.func,
  addGlassVUToCall: PropTypes.func
}

export default React.memo(Session)
