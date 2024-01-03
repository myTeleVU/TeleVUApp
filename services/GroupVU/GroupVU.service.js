import { iseeInstance } from '../axiosService'

class GroupVUService {
  async fetchGroups (portalName) {
    return iseeInstance.get(`/groups/${portalName}`)
  }

  async addGroup (groupName, portalName, devices = [], users = []) {
    return iseeInstance.post('/groups/', {
      name: groupName,
      portal: portalName,
      devices,
      users
    })
  }

  async removeGroup (groupId) {
    return iseeInstance.delete('/groups/', {
      data: { id: groupId }
    })
  }
}

export default new GroupVUService()
