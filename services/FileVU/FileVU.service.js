import { iseeInstance } from '../axiosService'

class FileVUService {
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
    return iseeInstance.get('/files/view/' + fileId, {
      portal: portalName
    })
  }

  async addNote (fileName, note) {
    return iseeInstance.post('/files/note/', {
      fileName,
      note
    })
  }
}

export default new FileVUService()
