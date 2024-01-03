import { iseeInstance } from '../axiosService'

class ScreenVUService {
  async fetchScreens (portalName) {
    return iseeInstance.get(`/screens/${portalName}`)
  }

  async addScreen (screenName, screenURL, portalName) {
    return iseeInstance.post('/screens/', {
      name: screenName,
      url: screenURL,
      portal: portalName
    })
  }

  async removeScreen (screenName, portalName) {
    return iseeInstance.delete('/screens/', {
      data: { name: screenName, portal: portalName }
    })
  }
}

export default new ScreenVUService()
