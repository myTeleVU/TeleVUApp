/* eslint-disable react/react-in-jsx-scope */
import { RiLayoutLeftLine, RiLayoutGridFill } from 'react-icons/ri'
import { TfiLayoutSlider } from 'react-icons/tfi'
import { TbLayout } from 'react-icons/tb'
import { theme } from '../styles/theme.style'

const objectFlip = (obj) => {
  const ret = {}
  Object.keys(obj).forEach((key) => {
    ret[obj[key]] = key
  })
  return ret
}

const routify = (str) => str.toLowerCase().replace(' ', '-')

const pathNameMapInitial = {}
pathNameMapInitial['/' + routify(theme.HOMEVU)] = theme.HOMEVU
pathNameMapInitial['/' + routify(theme.GLASSVU)] = theme.GLASSVU
pathNameMapInitial['/' + routify(theme.REMOTEVU)] = theme.REMOTEVU
pathNameMapInitial['/' + routify(theme.SCREENVU)] = theme.SCREENVU
pathNameMapInitial['/' + routify(theme.CAMVU)] = theme.CAMVU
pathNameMapInitial['/' + routify(theme.GROUPVU)] = theme.GROUPVU
pathNameMapInitial['/' + routify(theme.FLOWVU)] = theme.FLOWVU
pathNameMapInitial['/' + routify(theme.FILEVU)] = theme.FILEVU
pathNameMapInitial['/' + routify(theme.REPORTVU)] = theme.REPORTVU
pathNameMapInitial['/' + routify(theme.SETTINGS)] = theme.SETTINGS
pathNameMapInitial['/' + routify(theme.SESSION)] = theme.SESSION
pathNameMapInitial['/' + routify(theme.PORTALVU)] = theme.PORTALVU
pathNameMapInitial['/' + routify(theme.SESSION) + '/'] = theme.SESSION

export const pathNameMap = pathNameMapInitial

export const namePathMap = objectFlip(pathNameMap)

const pathNameTextMapInitial = {}

pathNameTextMapInitial[
  '/' + routify(theme.GLASSVU)
] = `${theme.GLASSVU} shows a list of all smart glasses and devices assigned to each portal by your portal manager. Each registered ${theme.GLASSVU} device is available for communication with ${theme.REMOTEVU}  users (remote experts). You may also add new ${theme.GLASSVU} devices to your portal, provided you have the appropriate licenses.`
pathNameTextMapInitial[
  '/' + routify(theme.REMOTEVU)
] = `${theme.REMOTEVU} shows a list of all remote experts assigned to each portal by your portal manager. Each registered ${theme.REMOTEVU}  user can connect and communicate with ${theme.GLASSVU} devices (smart glasses). You may also add new ${theme.REMOTEVU} users to your portal, provided you have the appropriate licenses.`
pathNameTextMapInitial[
  '/' + routify(theme.SCREENVU)
] = `${theme.SCREENVU} shows a list of all remote medical screens (e.g. fluoroscopy, endoscopy, vital signs displays) assigned to each portal by your portal manager. Each registered ${theme.SCREENVU} device is linked to a portal and can be viewed by ${theme.REMOTEVU} users and shared with ${theme.GLASSVU} users. You may also add new ${theme.SCREENVU} users to your portal, provided you have the appropriate licenses.`
pathNameTextMapInitial[
  '/' + routify(theme.CAMVU)
] = `${theme.CAMVU} shows a list of all remote Wi-Fi-based cameras assigned to each portal by your portal manager. Each registered ${theme.CAMVU} device is linked to a portal and can be viewed by ${theme.REMOTEVU}  users as an additional video feed. You may also add new ${theme.CAMVU} users to your portal, provided you have the appropriate licenses.`
pathNameTextMapInitial[
  '/' + routify(theme.GROUPVU)
] = `${theme.GROUPVU} shows a list of all groups of devices assigned to each portal by your portal manager. Each registered ${theme.GROUPVU} device is available for communication with ${theme.REMOTEVU} users (remote experts). You may also add new ${theme.GROUPVU} to your portal, provided you have the appropriate licenses. `
pathNameTextMapInitial[
  '/' + routify(theme.FLOWVU)
] = `${theme.FLOWVU} shows a list of all digital workflows that are available on your portal. Each registered ${theme.FLOWVU} which is marked as "Published" is accessible to all ${theme.GLASSVU} devices registered to your portal. You may also create a new ${theme.FLOWVU} by uploading your Powerpoint presentation and customizing the workflow logic, provided you have the appropriate licenses.`
pathNameTextMapInitial[
  '/' + routify(theme.REPORTVU)
] = `${theme.REPORTVU} shows a list of all communications between users on each portal. Call ID is a unique identifier that shows the list of participants in each call. All calls are date and time-stamped and may be filtered based on specific criteria.`

export const pathNameTextMap = pathNameTextMapInitial

export const snackBarAnchorOrigin = { vertical: 'bottom', horizontal: 'center' }

export const portalLocations = {
  'ca-central-1': 'Canada (Central)',
  'us-east-2': 'US East (Ohio)',
  'us-east-1': 'US East (N. Virginia)',
  'us-west-1': 'US West (N. California)',
  'us-west-2': 'US West (Oregon)',
  'eu-central-1': 'Europe (Frankfurt)',
  'eu-west-1': 'Europe (Ireland)',
  'eu-west-2': 'Europe (London)',
  'eu-south-1': 'Europe (Milan)',
  'eu-west-3': 'Europe (Paris)',
  'eu-north-1': 'Europe (Stockholm)',
  'af-south-1': 'Africa (Cape Town)',
  'ap-east-1': 'Asia Pacific (Hong Kong)',
  'ap-southeast-3': 'Asia Pacific (Jakarta)',
  'ap-south-1': 'Asia Pacific (Mumbai)',
  'ap-northeast-3': 'Asia Pacific (Osaka)',
  'ap-northeast-2': 'Asia Pacific (Seoul)',
  'ap-southeast-1': 'Asia Pacific (Singapore)',
  'ap-southeast-2': 'Asia Pacific (Sydney)',
  'ap-northeast-1': 'Asia Pacific (Tokyo)',
  'cn-north-1': 'China (Beijing)',
  'cn-northwest-1': 'China (Ningxia)',
  'sa-east-1': 'South America (São Paulo)',
  'me-south-1': 'Middle East (Bahrain)'
}

export const resolutionValues = {
  MD: 'Medium Defintion (480p)',
  HD: 'High Definition (720p)',
  'Full HD': 'Full HD (1080p)',
  'Ultra HD': 'Ultra HD (4k)'
}

export const resolutionNumbers = {
  MD: '640×480p',
  HD: '1280x720',
  'Full HD': '1920x1080',
  'Ultra HD': '3840x2160'
}

export const callCodecValues = { none: 'None', VP8: 'VP8', H264: 'H264' }

export const recordingModeValues = { basic: 'Basic', advanced: 'Advanced' }

export const permissionConstraints = { audio: true, video: true }

export const resolutionOptions = [
  'Ultra HD',
  'Full HD',
  'HD',
  'MD',
  'Video Off'
]

export const drawingColors = {
  yellow: 'Yellow',
  green: 'Green',
  red: 'Red',
  black: 'Black'
}

export const videoBoxLayoutOptions = {
  FULLSCREEN: {
    name: 'Fullscreen',
    icon: <TfiLayoutSlider style={{ height: '30px', width: '30px' }} />,
    capacity: 1
  },
  FOUR_BY_FOUR: {
    name: '4x4',
    icon: <RiLayoutGridFill style={{ height: '30px', width: '30px' }} />,
    capacity: 4
  },
  TWO_WINDOW_MD: {
    name: 'Two Window Medium',
    icon: <RiLayoutLeftLine style={{ height: '30px', width: '30px' }} />,
    capacity: 2
  },
  THREE_WINDOW_MD: {
    name: 'Three Window Medium',
    icon: <TbLayout style={{ height: '30px', width: '30px' }} />,
    capacity: 3
  }
}

export const homeVUTips = [
  {
    title: 'Schedule a Call',
    description: 'Using the calendar functionality you can now schdule a call.'
  }
]

export const deviceTypes = {
  Operator: 'RemoteVU',
  Device: 'GlassVU',
  ScreenVU: 'ScreenVU',
  CamVU: 'CamVU',
  GlassVU: 'GlassVU'
}
