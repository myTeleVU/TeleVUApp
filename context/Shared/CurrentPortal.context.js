import React, { createContext, useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import PropTypes from 'prop-types'
import PortalService from '../../services/PortalVU/PortalVU.service'

export const CurrentPortalContext = createContext()

export const CurrentPortalContextProvider = (props) => {
  const [currentPortal, setCurrentPortal] = useState(null)
  const [portal, setPortal] = useState({
    name: null,
    role: null,
    hasIseeLicence: true,
    hasFlowVULicence: true,
    id: null
  })
  const [licences, setLicenses] = useState([])

  const handlePortalChange = (event) => {
    setCurrentPortal(event.target.value)
    const cookies = new Cookies()
    cookies.set('lastPortal', event.target.value, {
      maxAge: 1000 * 60 * 60 * 24 * 365 // 365 days
    })
  }

  const loadPortalCookie = () => {
    const cookies = new Cookies()
    const portal = cookies.get('lastPortal')
    if (portal) {
      setCurrentPortal(portal)
    } else {
      setCurrentPortal(1)
    }
  }

  const fetchLicenses = () => {
    PortalService.fetchLicences(portal.name).then((response) => {
      setLicenses(response.data)
    })
  }

  useEffect(() => {
    loadPortalCookie()
  }, [])

  useEffect(() => {
    if (portal.name) {
      fetchLicenses()
    }
  }, [portal])

  return (
    <CurrentPortalContext.Provider
      value={{
        handlePortalChange,
        portal,
        setPortal,
        currentPortal,
        fetchLicenses,
        licences
      }}
    >
      {props.children}
    </CurrentPortalContext.Provider>
  )
}

CurrentPortalContextProvider.propTypes = {
  children: PropTypes.object
}
