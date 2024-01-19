//import { Auth } from 'aws-amplify'
import moment from 'moment'
import { pathNameMap } from './constants'
import { theme } from '../styles/theme.style'

export const getModalStyle = () => {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

/*
export const getJWT = async () => {
  return Auth.currentSession().then((res) => {
    const getIdToken = res.getIdToken()
    const jwt = getIdToken.getJwtToken()
    return jwt
  })
}
*/

export const getSummaryAnalyticsGraph = (summaryAnalytics) => {
  const labels = []
  const data = []
  summaryAnalytics.forEach((item) => {
    labels.push(moment(item.final_date, 'YYYY-MM-DD').format('MMM YYYY'))
    data.push(item.count)
  })

  const finalData = {
    labels,
    datasets: [
      {
        label: 'Calls',
        data,
        borderColor: theme.COLOR_LIGHT_BLUE,
        backgroundColor: theme.COLOR_DARK_TEAL
      }
    ]
  }
  return finalData
}

export const formatAnalytics = (allAnalytics) => {
  const data = []
  allAnalytics?.forEach((analytics) => {
    if (analytics.participantEvents && analytics.sessionEvents[0]) {
      let users = analytics.participantEvents.map((user) => user.clientData)
      users = [...new Set(users)]
      const [startDateTime, endDateTime] = getStartAndEndDateTimes(
        analytics.sessionEvents
      )
      data.push({
        id: analytics.sessionId,
        user: users.join('-'),
        startTimeString: startDateTime.toString().substring(0, 25), // substring cuts out timezone
        endTimeString: endDateTime.toString().substring(0, 25), // substring cuts out timezone
        duration: convertMSToDuration(endDateTime - startDateTime),
        recordings: analytics.recordingEvents?.map(
          (recording) => recording.recordingId
        )
      })
    }
  })
  return data
}

const getStartAndEndDateTimes = (sessionEvents) => {
  const eventWithTimes = sessionEvents.find(
    (event) => event.event === 'sessionDestroyed'
  )
  return [
    new Date(eventWithTimes?.startTime),
    new Date(eventWithTimes?.timestamp)
  ]
}

const convertMSToDuration = (ms) => {
  // Converts a time diff in ms to human output like 00:00:00
  let h, m, s
  h = Math.floor(ms / 1000 / 60 / 60)
  m = Math.floor((ms / 1000 / 60 / 60 - h) * 60)
  s = Math.floor(((ms / 1000 / 60 / 60 - h) * 60 - m) * 60)
  s < 10 ? (s = `0${s}`) : (s = `${s}`)
  m < 10 ? (m = `0${m}`) : (m = `${m}`)
  h < 10 ? (h = `0${h}`) : (h = `${h}`)
  return `${h}:${m}:${s}`
}

export const createDevices = (allDevices) => {
  const allDevicesArray = []
  for (const key in allDevices) {
    allDevicesArray.push(allDevices[key])
  }
  return allDevicesArray
}

export const checkCurrent = (ref) => {
  if (ref) {
    if (ref.current) {
      return true
    } else {
      return false
    }
  }
  return false
}

export const shouldHaveAddModal = (location) => {
  return [
    theme.GLASSVU,
    theme.REMOTEVU,
    theme.SCREENVU,
    theme.CAMVU,
    theme.GROUPVU,
    theme.FLOWVU,
    theme.PORTALVU
  ].includes(pathNameMap[location.pathname])
}

export const trackEvent = (event, data) => {
  const analytics = window.analytics
  if (analytics) {
    analytics.track(event, data)
  }
}

export const initiateAnalytics = (identity, data) => {
  const analytics = window.analytics
  if (analytics) {
    analytics.identify(identity, data)
  }
}

export const getMicrophone = (me) => {
  if (me.userType === 'ScreenVU') {
    return false
  } else {
    return true
  }
}

export const getVideo = (me) => {
  if (me.userType === 'ScreenVU') {
    return true
  } else {
    return false
  }
}

export const getWebcam = (me, webcams) => {
  let value = ''
  if (me.userType === 'ScreenVU') {
    Object.keys(webcams).forEach((webcam) => {
      const name = webcams[webcam]
      if (name.includes('OBS Virtual Camera')) {
        value = webcam
      }
    })
  }
  return value
}

export const isScreenVU = (me) => {
  return me.userType === 'ScreenVU'
}

export const parseSubscriber = (subscriber) => {
  const userMetadata = JSON.parse(subscriber.stream?.connection?.data)
  const id = subscriber.stream?.streamId
  const type = userMetadata.userType
  const name = userMetadata.clientData
  return { id, type, name }
}

export const containsEmail = (text) => {
  return /\S+@\S+\.\S+/.test(text)
}

export const containsUpperCase = (text) => {
  return /[A-Z]/.test(text)
}

export const containsLowercase = (text) => {
  return /[a-z]/.test(text)
}

export const containsNumber = (text) => {
  return /[0-9]/.test(text)
}

export const containsSpecialCharachter = (text) => {
  return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(text)
}

export const getInitials = (name) => {
  if (!name) {
    return '?'
  }
  const spaced = name.split(' ')
  const initials = spaced.map((name) => name.charAt(0))
  return initials.join('')
}

export const getFirstName = (name) => {
  if (!name) {
    return 'User'
  }
  const spaced = name.split(' ')
  return spaced[0]
}

export const getSortedPortals = (portals) => {
  const sortedPortals = portals.sort((a, b) => {
    return a.Portal.name.toLowerCase().localeCompare(b.Portal.name)
  })
  return sortedPortals
}

export const getCsvfromJsonObject = (jsonObject) => {
  const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  const header = Object.keys(jsonObject[0])
  const csv = [
    header.join(','), // header row first
    ...jsonObject.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    )
  ].join('\r\n')
  return csv
}

export const routify = (str) => str.toLowerCase().replace(' ', '-')

export const formatFileSize = (size) => {
  if (Math.trunc(size / 1000000) !== 0) {
    return `${Math.trunc(size / 1000000)} MB`
  } else {
    return `${Math.trunc(size / 1000)} KB`
  }
}
