import React from 'react'
import RemoteVUService from '../../services/RemoteVU/RemoteVU.service'
import PropTypes from 'prop-types'
import { trackEvent } from '../../utils/functions'

export const RemoteVUContext = React.createContext()

export const RemoteVUContextProvider = (props) => {
  const [allUsers, setAllUsers] = React.useState([])

  const fetchUsers = async (portalName) => {
    try {
      const res = await RemoteVUService.fetchUsers(portalName)
      setAllUsers(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const addUser = async (
    email,
    userName,
    portalName,
    portalRole,
    isScreenVU = false,
    isGlassvuUser = false
  ) => {
    trackEvent('RemoteVU Added')
    return await RemoteVUService.addUser(
      email,
      userName,
      portalName,
      portalRole,
      isScreenVU,
      isGlassvuUser
    )
  }

  const removeUser = async (email, portalName) => {
    trackEvent('RemoteVU Removed')
    return await RemoteVUService.removeUser(email, portalName)
  }

  return (
    <RemoteVUContext.Provider
      value={{ allUsers, fetchUsers, addUser, removeUser }}
    >
      {props.children}
    </RemoteVUContext.Provider>
  )
}

RemoteVUContextProvider.propTypes = {
  children: PropTypes.object
}
