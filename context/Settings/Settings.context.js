import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import UserService from '../../services/User/User.service'
import { Auth } from 'aws-amplify'
import { trackEvent } from '../../utils/functions'

export const SettingsContext = createContext()

export const SettingsContextProvider = (props) => {
  const [attributes, setAttributes] = useState(null)

  const changeAutoAcceptCalls = async (userId, autoAcceptCalls) => {
    return await UserService.updateAutoAcceptCalls(userId, autoAcceptCalls)
  }

  const changeDetails = async (detailsToBeChanged) => {
    return await UserService.changeDetails(detailsToBeChanged)
  }

  const _changePassword = async (oldPassword, newPassword) => {
    trackEvent('User Password Updated')
    return await Auth.currentAuthenticatedUser().then((user) => {
      return Auth.changePassword(user, oldPassword, newPassword)
    })
  }

  const _getPreferredMFA = async () => {
    return await Auth.currentAuthenticatedUser({ bypassCache: true }).then(
      (user) => {
        return Auth.getPreferredMFA(user, { bypassCache: true })
      }
    )
  }

  const _setPreferredMFA = async (type) => {
    return await await Auth.currentAuthenticatedUser().then((user) => {
      return Auth.setPreferredMFA(user, type)
    })
  }

  const _getCurrentAttributes = async (type) => {
    const { attributes } = await Auth.currentAuthenticatedUser({
      bypassCache: true
    })
    setAttributes(attributes)
  }

  const _updateUserPhoneNumber = async (value) => {
    return await Auth.currentAuthenticatedUser().then((user) => {
      return Auth.updateUserAttributes(user, {
        phone_number: value
      })
    })
  }

  const _verifyCurrentUserPhoneNumber = () => {
    return Auth.verifyCurrentUserAttribute('phone_number')
  }

  const _verifyCurrentUserPhoneNumberSubmit = (code) => {
    return Auth.verifyCurrentUserAttributeSubmit('phone_number', code)
  }

  const _setupTOTP = async () => {
    return await Auth.currentAuthenticatedUser().then((user) => {
      return Auth.setupTOTP(user)
    })
  }

  const _verifyTotpToken = async (challengeAnswer) => {
    return await Auth.currentAuthenticatedUser().then((user) => {
      return Auth.verifyTotpToken(user, challengeAnswer)
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        changeAutoAcceptCalls,
        changeDetails,
        _changePassword,
        _getPreferredMFA,
        _setPreferredMFA,
        _getCurrentAttributes,
        _updateUserPhoneNumber,
        _verifyCurrentUserPhoneNumber,
        _verifyCurrentUserPhoneNumberSubmit,
        _setupTOTP,
        _verifyTotpToken,
        attributes
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  )
}

SettingsContextProvider.propTypes = {
  children: PropTypes.array
}
