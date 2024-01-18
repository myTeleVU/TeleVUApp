import React, { createContext, useState, useCallback, useEffect } from 'react'
import UserService from '../../services/User/User.service'
//import { Auth } from 'aws-amplify'
import PropTypes from 'prop-types'

export const CurrentUserContext = createContext()

export const CurrentUserContextProvider = (props) => {
  const [me, setMe] = useState(null)
  const [portals, setPortals] = useState(null)

  const formatAllPortals = (allPortals) => {
    if (!allPortals) {
      return
    }
    const formattedPortals = []
    allPortals.forEach((portal) => {
      formattedPortals.push(portal)
      portal.subPortals?.forEach((subportal) => {
        formattedPortals.push(subportal)
      })
    })
    return formattedPortals
  }

  const fetchMe = useCallback(async () => {
    UserService.fetchMe()
      .then((response) => {
        if (response.data) {
          setMe(response.data.user)
          setPortals(formatAllPortals(response.data.portals))
        } else {
          Auth.signOut()
        }
      })
      .catch((_) => {
        Auth.signOut()
      })
  }, [])

  useEffect(() => {
    fetchMe()
  }, [])

  return (
    <CurrentUserContext.Provider value={{ me, fetchMe, portals }}>
      {props.children}
    </CurrentUserContext.Provider>
  )
}

CurrentUserContextProvider.propTypes = {
  children: PropTypes.object
}
