import React, { createContext, useState } from 'react'
import GlassVUService from '../../services/GlassVU/GlassVU.service'
import PropTypes from 'prop-types'
import { trackEvent } from '../../utils/functions'

export const GlassVUContext = createContext()

export const GlassVUContextProvider = (props) => {
  const [allDevices, setallDevices] = useState([])

  const fetchDevices = (portalName) => {
    GlassVUService.fetchDevices(portalName).then((res) => {
      setallDevices(res.data)
    })
  }

  const addDevice = async (portalName, glassName) => {
    trackEvent('Added Device')
    return await GlassVUService.addDevice(glassName, portalName)
  }

  const removeDevice = async (token) => {
    trackEvent('Device Removed')
    return await GlassVUService.removeDevice(token)
  }

  const releaseDevice = async (token) => {
    trackEvent('Device Released')
    return await GlassVUService.releaseDevice(token)
  }

  return (
    <GlassVUContext.Provider
      value={{
        fetchDevices,
        allDevices,
        addDevice,
        removeDevice,
        releaseDevice
      }}
    >
      {props.children}
    </GlassVUContext.Provider>
  )
}

GlassVUContextProvider.propTypes = {
  children: PropTypes.object
}
