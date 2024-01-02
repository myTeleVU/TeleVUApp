import React from 'react'
import AddToCall from '../AddToCall/AddToCall.component'
import { CurrentPortalContext } from '../../../context/Shared/CurrentPortal.context'
import { CamVUContext } from '../../../context/CamVU/CamVU.context'
import PropTypes from 'prop-types'
import { theme } from '../../../styles/theme.style'

export default function AddCamToCall ({
  open,
  handleClose,
  addToCall,
  toggleScreenVU,
  screenvuState,
  subscribers,
  removeCamera
}) {
  const [callParticipants, setCallParticipants] = React.useState({})
  const { allScreens, fetchScreens } = React.useContext(CamVUContext)
  const { portal } = React.useContext(CurrentPortalContext)

  React.useEffect(() => {
    fetchScreens(portal.name)
  }, [portal.name])

  React.useEffect(async () => {
    const participants = {}
    subscribers.forEach((subscriber) => {
      const connection = subscriber.stream?.connection
      const userMetadata = JSON.parse(connection?.data)
      const userType = userMetadata.userType
      if (userType === 'ScreenVU') {
        const name = userMetadata.clientData
        const id = connection.connectionId
        participants[name] = id
      }
    })
    setCallParticipants(participants)
  }, [subscribers])

  return (
    <AddToCall
      open={open}
      handleClose={handleClose}
      addToCall={addToCall}
      allDevicesArray={allScreens}
      title={theme.CAMVU}
      callParticipants={callParticipants}
      isOnline={() => true}
      getToken={(row) => row.id}
    />
  )
}

AddCamToCall.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  addToCall: PropTypes.func,
  toggleScreenVU: PropTypes.func,
  screenvuState: PropTypes.bool,
  subscribers: PropTypes.array,
  removeCamera: PropTypes.func
}
