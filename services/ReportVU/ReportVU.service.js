import { iseeInstance } from '../axiosService'

class ReportVUService {
  async fetchAnalytics (portalName) {
    return iseeInstance.get(`/sessions/analytics/${portalName}`)
  }

  async fetchSummaryAnalytics (portalName) {
    return iseeInstance.get(`/sessions/analytics/summary/${portalName}`)
  }

  async fetchAnalyticsFiltered (portalName, from, to, user) {
    return iseeInstance.post('/sessions/analytics/', {
      portal: portalName,
      from,
      to,
      user
    })
  }
}

export default new ReportVUService()
