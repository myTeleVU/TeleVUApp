import React from 'react'
import { createDevices } from '../../../utils/functions'
import { CurrentPortalContext } from '../../../context/Shared/CurrentPortal.context'
import { GlassVUContext } from '../../../context/GlassVU/GlassVU.context'
import AddToCall from '../AddToCall/AddToCall.component'
import PropTypes from 'prop-types'
import { theme } from '../../../styles/theme.style'

export default function AddGlassToCall ({
  open,
  handleClose,
  online,
  addToCall,
  mySessionId
}) {
  const [onlineDevices, setOnlineDevices] = React.useState([])
  const { allDevices, fetchDevices } = React.useContext(GlassVUContext)
  const { portal } = React.useContext(CurrentPortalContext)
  const [allDevicesArray, setAllDevicesArray] = React.useState([])

  React.useEffect(() => {
    fetchDevices(portal.name)
  }, [portal.name])

  React.useEffect(() => {
    setAllDevicesArray(createDevices(allDevices))
  }, [allDevices])

  React.useEffect(async () => {
    if (portal.name && online) {
      if (online[portal.name]) {
        setOnlineDevices(online[portal.name].Device)
      } else {
        setOnlineDevices([])
      }
    }
  }, [portal.name, online])

  const getToken = (row) => {
    for (const device of onlineDevices) {
      if (device.userId === row.name) {
        return device.socketId
      }
    }
    return false
  }

  const isOnline = (name) => {
    for (const device of onlineDevices) {
      if (device.userId === name) {
        return true
      }
    }
    return false
  }

  return (
    <AddToCall
      open={open}
      handleClose={handleClose}
      addToCall={addToCall}
      mySessionId={mySessionId}
      isOnline={isOnline}
      getToken={getToken}
      allDevicesArray={allDevicesArray}
      title={theme.GLASSVU}
    />
  )
}

AddGlassToCall.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  online: PropTypes.object,
  addToCall: PropTypes.func,
  mySessionId: PropTypes.string
}
