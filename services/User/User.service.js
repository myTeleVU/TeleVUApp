import { iseeInstance } from '../axiosService'

class UserService {
  async fetchMe () {
    return iseeInstance.get('/users/whoami')
  }

  async changeDetails (detailsToBeChanged) {
    return iseeInstance.post('/users/details', detailsToBeChanged)
  }

  async getAllUsers () {
    return iseeInstance.get('/users/all')
  }

  async updateAutoAcceptCalls (userId, autoAcceptCalls) {
    return iseeInstance.patch(`/users/${userId}`, { autoAcceptCalls })
  }
}

export default new UserService()
