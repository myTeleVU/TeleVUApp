/* eslint-disable no-unused-vars */

import { iseeInstance } from '../axiosService'

class HomeVUService {
  async fetchSummaryAnalytics (portalName, userId) {
    return iseeInstance.get(
      `/sessions/analytics/summary/${portalName}${
        userId ? '?userId=' + userId : ''
      }`
    )
  }

  async fetchFiles (portalName) {
    return iseeInstance.get(`/files/list/${portalName}`)
  }

  async viewFile (portalName, fileKey) {
    return iseeInstance.post('/files/view', {
      portal: portalName,
      key: fileKey
    })
  }

  async viewFileById (portalName, fileId) {
    return iseeInstance.post('/files/view/' + fileId, {
      portal: portalName
    })
  }

  async fetchDevices (portalName) {
    return iseeInstance.get(`/devices/${portalName}`)
  }

  async fetchUsers (portalName) {
    return iseeInstance.get(`/users/portal/${portalName}`)
  }

  async fetchScreens (portalName) {
    return iseeInstance.get(`/screens/${portalName}`)
  }

  async createScheduledMeeting (params) {
    return iseeInstance.post('/scheduledMeetings/', params)
  }

  async deleteScheduledMeeting (id) {
    return iseeInstance.delete(`/scheduledMeetings/${id}`)
  }

  async editScheduledMeeting (id, params) {
    return iseeInstance.put(`/scheduledMeetings/${id}`, params)
  }

  async getScheduledMeeting (id) {
    return iseeInstance.get(`/scheduledMeetings/${id}`)
  }

  async getScheduledMeetings (portalName, id) {
    return iseeInstance.get(`/scheduledMeetings/${portalName}/${id}`)
  }

  async getTips (portalName, isActive) {
    return iseeInstance.get(
      `/tips/${portalName}${
        isActive !== undefined ? '?isActive=' + isActive : ''
      }`
    )
  }
}

export default new HomeVUService()
