import { iseeInstance } from '../axiosService'

class SessionService {
  async createToken (userName, sessionName, portalName) {
    return iseeInstance.post('/sessions', {
      data: userName,
      sessionname: sessionName,
      portal: portalName
    })
  }

  async fetchSessionInfo (token, mySessionId) {
    return iseeInstance.post('/sessions/get-session-recording-info', {
      token,
      sessionname: mySessionId
    })
  }

  async leaveSession (token, mySessionId) {
    return iseeInstance.post('/sessions/leave-session', {
      token,
      sessionname: mySessionId
    })
  }

  async startRecording (token, mySessionId, recordingMode, portalName) {
    return iseeInstance.post('/sessions/start-recording', {
      token,
      sessionname: mySessionId,
      recordingMode,
      portal: portalName
    })
  }

  async stopRecording (token, mySessionId, portalName) {
    return iseeInstance.post('/sessions/stop-recording', {
      token,
      sessionname: mySessionId,
      portal: portalName
    })
  }

  async addCamera (token, mySessionId, deviceID) {
    return iseeInstance.post('/sessions/add-camera', {
      token,
      sessionname: mySessionId,
      device: deviceID
    })
  }

  async removeConnection (token, mySessionId, connectionId) {
    return iseeInstance.post('/sessions/remove-connection', {
      token,
      sessionname: mySessionId,
      connectionId
    })
  }

  async sendImage (imageData) {
    return iseeInstance.post('/files/upload', imageData)
  }

  async saveImage (imageData) {
    return iseeInstance.post('/files/save', imageData)
  }

  async updateImage (imageData) {
    return iseeInstance.post('/files/update', imageData)
  }

  async closeSession (sessionName) {
    return iseeInstance.post('/sessions/close-session', {
      sessionName
    })
  }
}

export default new SessionService()
