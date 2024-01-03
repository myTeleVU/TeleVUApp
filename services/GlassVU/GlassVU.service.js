import { iseeInstance } from '../axiosService'

class GlassVUService {
  async fetchDevices (portalName) {
    return iseeInstance.get(`/devices/${portalName}`)
  }

  async addDevice (glassName, portalName) {
    return iseeInstance.post('/devices/', {
      name: glassName,
      portal: portalName
    })
  }

  async removeDevice (glassToken) {
    return iseeInstance.delete('/devices/', { data: { token: glassToken } })
  }

  async releaseDevice (glassToken) {
    return iseeInstance.patch('/devices/release', { token: glassToken })
  }
}

export default new GlassVUService()
