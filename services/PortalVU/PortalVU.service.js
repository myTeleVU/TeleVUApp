import { iseeInstance } from '../axiosService'

class PortalVUService {
  async fetchLicences (portalName) {
    return iseeInstance.get(`/portals/${portalName}`)
  }

  async fetchPortals () {
    return iseeInstance.get('/portals')
  }

  async addPortal (
    portalName,
    licenceCount,
    portalType,
    mainPortal,
    portalLocation,
    expiryDate,
    isRecordByDefault,
    isNeverRecord
  ) {
    return iseeInstance.post('/portals', {
      name: portalName,
      licenses: licenceCount,
      type: portalType,
      mainPortal,
      location: portalLocation,
      expiryDate,
      isRecordByDefault,
      isNeverRecord
    })
  }

  async editPortal (portalName, licenceCount, expiryDate) {
    return iseeInstance.put('/portals', {
      name: portalName,
      licenses: licenceCount,
      expiryDate
    })
  }

  async getActiveCalls () {
    return iseeInstance.get('/sessions')
  }

  async getAllUsers () {
    return iseeInstance.get('/users/all')
  }

  async getTips (portalName, isActive) {
    return iseeInstance.get(
      `/tips/${portalName}${
        isActive !== undefined ? '?isActive=' + isActive : ''
      }`
    )
  }

  async createTip (tip, currentPortalName) {
    return iseeInstance.post('/tips', {
      tip,
      currentPortalName
    })
  }

  async editTip (currTipId, newTip, currentPortalName) {
    return iseeInstance.put('/tips', {
      currTipId,
      newTip,
      currentPortalName
    })
  }
}

export default new PortalVUService()
