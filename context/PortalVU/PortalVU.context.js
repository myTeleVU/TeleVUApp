import React, { createContext, useState } from 'react'
import PortalVUService from '../../services/PortalVU/PortalVU.service'
import PropTypes from 'prop-types'

export const PortalVUContext = createContext()

export const PortalVUContextProvider = (props) => {
  const [allPortals, setAllPortals] = useState([])
  const [allCalls, setAllCalls] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [tips, setTips] = useState([])

  const fetchPortals = async () => {
    try {
      const res = await PortalVUService.fetchPortals()
      setAllPortals(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const getActiveCalls = async () => {
    try {
      const response = await PortalVUService.getActiveCalls()
      const sessionsData = response.data
      const localAllCalls = []
      Object.keys(sessionsData).forEach((sessionName) => {
        const data = {}
        data.name = sessionName
        data.users = []
        sessionsData[sessionName].forEach((pa) => {
          const participant = JSON.parse(pa)
          data.portal = participant.portal
          data.users.push(participant.clientData)
        })
        localAllCalls.push(data)
      })
      setAllCalls(localAllCalls)
    } catch (err) {
      console.log(err)
    }
  }

  const getAllUsers = async () => {
    try {
      const response = await PortalVUService.getAllUsers()
      setAllUsers(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  const addPortal = async (
    portalName,
    licenceCount,
    portalType,
    mainPortal,
    portalLocation,
    expiryDate,
    isRecordByDefault,
    isNeverRecord
  ) => {
    return await PortalVUService.addPortal(
      portalName,
      licenceCount,
      portalType,
      mainPortal,
      portalLocation,
      expiryDate,
      isRecordByDefault,
      isNeverRecord
    )
  }

  const editPortal = async (portalName, licenceCount, expiryDate) => {
    return await PortalVUService.editPortal(
      portalName,
      licenceCount,
      expiryDate
    )
  }

  const getTips = async (portalName, isActive) => {
    try {
      const response = await PortalVUService.getTips(portalName || '', isActive)
      setTips(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  const createTip = async (tip, currentPortalName) => {
    try {
      await PortalVUService.createTip(tip, currentPortalName)
    } catch (err) {
      console.log(err)
    }
  }

  const editTip = async (currTipId, newTip, currentPortalName) => {
    try {
      await PortalVUService.editTip(currTipId, newTip, currentPortalName)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <PortalVUContext.Provider
      value={{
        allPortals,
        fetchPortals,
        addPortal,
        getActiveCalls,
        allCalls,
        allUsers,
        getAllUsers,
        editPortal,
        getTips,
        tips,
        createTip,
        editTip
      }}
    >
      {props.children}
    </PortalVUContext.Provider>
  )
}

PortalVUContextProvider.propTypes = {
  children: PropTypes.object
}
