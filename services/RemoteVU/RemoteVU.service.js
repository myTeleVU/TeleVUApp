import { iseeInstance } from '../axiosService'

class RemoteVUService {
  async fetchUsers (portalName) {
    return iseeInstance.get(`/users/portal/${portalName}`)
  }

  async addUser (
    email,
    userName,
    portalName,
    portalRole,
    isScreenVU = false,
    isGlassvuUser = false
  ) {
    return iseeInstance.post('/users/', {
      email,
      name: userName,
      role: portalRole,
      portal: portalName,
      isScreenVU,
      isGlassvuUser
    })
  }

  async removeUser (email, portalName) {
    return iseeInstance.delete('/users/', {
      data: { email, portal: portalName }
    })
  }
}

export default new RemoteVUService()
