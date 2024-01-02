import React from 'react'
import { CurrentUserContext } from '../../../context/Shared/CurrentUser.context'
import { CurrentPortalContext } from '../../../context/Shared/CurrentPortal.context'
import { RemoteVUContext } from '../../../context/RemoteVU/RemoteVU.context'
import AddToCall from '../AddToCall/AddToCall.component'
import PropTypes from 'prop-types'
import { theme } from '../../../styles/theme.style'

export default function AddRemoteToCall ({
  open,
  handleClose,
  online,
  addToCall,
  mySessionId,
  subscribers,
  copyLink
}) {
  const [onlineOperators, setOnlineOperators] = React.useState([])
  const [callParticipants, setCallParticipants] = React.useState([])
  const [allUsersFiltered, setAllUsersFiltered] = React.useState([])
  const { allUsers, fetchUsers } = React.useContext(RemoteVUContext)
  const { portal } = React.useContext(CurrentPortalContext)
  const { me } = React.useContext(CurrentUserContext)

  React.useEffect(() => {
    fetchUsers(portal.name)
  }, [portal.name])

  React.useEffect(() => {
    const allUsersFiltered = []
    if (allUsers) {
      allUsers.forEach((item) => {
        if (item.email !== me.email && item.userType === 'RemoteVU') {
          allUsersFiltered.push(item)
        }
      })
      setAllUsersFiltered(allUsersFiltered)
    }
  }, [allUsers])

  const isOnline = (name) => {
    for (const user of callParticipants) {
      if (user.userId === name) {
        return false
      }
    }
    for (const user of onlineOperators) {
      if (user.userId === name) {
        return true
      }
    }
    return false
  }

  const getToken = (row) => {
    for (const user of onlineOperators) {
      if (user.userId === row.email) {
        return user.socketId
      }
    }
    return false
  }

  React.useEffect(async () => {
    if (online[portal.name]) {
      setOnlineOperators(online[portal.name].Operator)
    } else {
      setOnlineOperators([])
    }
  }, [portal.name, online])

  React.useEffect(async () => {
    const participants = []
    subscribers.forEach((subscriber) => {
      const userMetadata = JSON.parse(subscriber.stream?.connection?.data)
      const userType = userMetadata.userType
      if (userType === 'Operator') {
        const email = userMetadata.email
        participants.push(email)
      }
    })
    setCallParticipants(participants)
  }, [subscribers])

  return (
    <AddToCall
      open={open}
      handleClose={handleClose}
      addToCall={addToCall}
      mySessionId={mySessionId}
      isOnline={isOnline}
      getToken={getToken}
      allDevicesArray={allUsersFiltered}
      title={theme.REMOTEVU}
      copyLink={copyLink}
    />
  )
}

AddRemoteToCall.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  online: PropTypes.object,
  addToCall: PropTypes.func,
  mySessionId: PropTypes.string,
  subscribers: PropTypes.array,
  copyLink: PropTypes.func
}
