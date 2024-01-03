import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, _setSnackBarMessage] = useState('')
  const [snackBarType, setSnackBarType] = useState('success')

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackBarOpen(false)
  }

  const setSnackBarMessage = (message, type = 'success') => {
    _setSnackBarMessage(message)
    setSnackBarType(type)
    setSnackBarOpen(true)
  }

  const setSnackBarMessageName = (name, message, type = 'success') => {
    _setSnackBarMessage(name + ' ' + message)
    setSnackBarType(type)
    setSnackBarOpen(true)
  }

  return (
    <NotificationContext.Provider
      value={{
        handleCloseSnackBar,
        setSnackBarMessage,
        setSnackBarMessageName,
        setSnackBarType,
        snackBarOpen,
        snackBarMessage,
        snackBarType
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

NotificationContextProvider.propTypes = {
  children: PropTypes.object
}
