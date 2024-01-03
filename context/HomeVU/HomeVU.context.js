/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import { trackEvent } from '../../utils/functions'
import HomeVUService from '../../services/HomeVU/HomeVU.service'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'

export const HomeVUContext = createContext()

export const HomeVUContextProvider = (props) => {
  const [summaryAnalytics, setSummaryAnalytics] = useState(null)
  const [allFiles, setAllFiles] = useState([])
  const [allDevices, setAllDevices] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [allScreens, setAllScreens] = useState([])
  const [scheduledMeetings, setScheduledMeetings] = useState([])
  const [tips, setTips] = useState([])

  // Files and Recordings
  const sortbyDate = (a, b) => {
    return new Date(b.LastModified) - new Date(a.LastModified)
  }

  const fetchFiles = async (portalName) => {
    try {
      const res = await HomeVUService.fetchFiles(portalName)
      const keys = res.data.Contents
      keys?.sort(sortbyDate)
      setAllFiles(keys)
    } catch (error) {
      console.log(error)
    }
  }

  const viewFile = async (portalName, key) => {
    try {
      trackEvent('Viewed Recorded Video')
      return await HomeVUService.viewFile(portalName, key)
    } catch (error) {
      console.log(error)
    }
  }

  const viewFileById = async (portalName, id) => {
    try {
      trackEvent('Viewed Recorded Video')
      return await HomeVUService.viewFileById(portalName, id)
    } catch (error) {
      console.log(error)
    }
  }

  // Past Calls
  const fetchSummaryAnalytics = async (portalName, userId) => {
    try {
      const res = await HomeVUService.fetchSummaryAnalytics(portalName, userId)
      setSummaryAnalytics(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  // Scheduling Modal
  const fetchDevices = (portalName) => {
    HomeVUService.fetchDevices(portalName).then((res) => {
      setAllDevices(res.data)
    })
  }

  const fetchUsers = async (portalName) => {
    try {
      const res = await HomeVUService.fetchUsers(portalName)
      setAllUsers(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchScreens = async (portalName) => {
    try {
      const res = await HomeVUService.fetchScreens(portalName)
      setAllScreens(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const createScheduledMeeting = async (param) => {
    try {
      return await HomeVUService.createScheduledMeeting(param)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteScheduledMeeting = async (id) => {
    try {
      return await HomeVUService.deleteScheduledMeeting(id)
    } catch (err) {
      console.log(err)
    }
  }

  const editScheduledMeeting = async (id, param) => {
    try {
      return await HomeVUService.editScheduledMeeting(id, param)
    } catch (err) {
      console.log(err)
    }
  }

  const getScheduledMeeting = async (id) => {
    try {
      return await HomeVUService.getScheduledMeeting(id)
    } catch (err) {
      console.log(err)
    }
  }

  const getScheduledMeetings = async (portalName, id) => {
    try {
      const res = await HomeVUService.getScheduledMeetings(portalName, id)
      setScheduledMeetings(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // Did You Know
  const getTips = async (portalName, isActive) => {
    try {
      const response = await HomeVUService.getTips(portalName || '', isActive)
      setTips(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <HomeVUContext.Provider
      value={{
        summaryAnalytics,
        fetchSummaryAnalytics,
        allFiles,
        fetchFiles,
        viewFile,
        viewFileById,
        allDevices,
        allUsers,
        fetchDevices,
        fetchUsers,
        fetchScreens,
        allScreens,
        createScheduledMeeting,
        editScheduledMeeting,
        deleteScheduledMeeting,
        getScheduledMeeting,
        getScheduledMeetings,
        scheduledMeetings,
        getTips,
        tips
      }}
    >
      {props.children}
    </HomeVUContext.Provider>
  )
}

HomeVUContextProvider.propTypes = {
  children: PropTypes.object
}
