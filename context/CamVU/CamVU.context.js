import React, { createContext, useState } from 'react'
import CamVUService from '../../services/CamVU/CamVU.service'
import PropTypes from 'prop-types'
import { trackEvent } from '../../utils/functions'

export const CamVUContext = createContext()

export const CamVUContextProvider = (props) => {
  const [allScreens, setAllScreens] = useState([])

  const fetchScreens = async (portalName) => {
    try {
      const res = await CamVUService.fetchScreens(portalName)
      setAllScreens(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const addScreen = async (screenName, screenURL, portalName) => {
    trackEvent('ScreenVU Added')
    return await CamVUService.addScreen(screenName, screenURL, portalName)
  }

  const removeScreen = async (screenName, portalName) => {
    trackEvent('ScreenVU Removed')
    return await CamVUService.removeScreen(screenName, portalName)
  }

  return (
    <CamVUContext.Provider
      value={{ fetchScreens, addScreen, removeScreen, allScreens }}
    >
      {props.children}
    </CamVUContext.Provider>
  )
}

CamVUContextProvider.propTypes = {
  children: PropTypes.object
}
