// TODO (suggesstion): since all the props are being passed to CallBarDesktopComponent, we can just pass the props directly to CallBarDesktopComponent instead of destructuring them here and passing them down. This will make the code more readable and easier to maintain.
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import CallBarDesktopComponent from './CallBarDesktop.component'

const CallBar = ({
  sendSignal,
  handleAddGlassToCallOpen,
  handleAddRemoteToCallOpen,
  handleAddScreenToCallOpen,
  handleAddCamToCallOpen,
  toggleScreenShare,
  endSession,
  audio,
  toggleAudioOnOff,
  chat,
  toggleChat,
  setTakePhoto,
  recordingMode,
  sendToggleRecording,
  drawerOpen,
  openDrawer,
  screen,
  video,
  foundWebcams,
  toggleWebcam,
  cameraSelected,
  showThumbnails,
  toggleVideoOnOff,
  foundMicrophones,
  microphoneSelected,
  toggleMicrophone
}) => {
  return (
    <CallBarDesktopComponent
      sendSignal={sendSignal}
      handleAddGlassToCallOpen={handleAddGlassToCallOpen}
      handleAddRemoteToCallOpen={handleAddRemoteToCallOpen}
      handleAddScreenToCallOpen={handleAddScreenToCallOpen}
      handleAddCamToCallOpen={handleAddCamToCallOpen}
      toggleScreenShare={toggleScreenShare}
      endSession={endSession}
      audio={audio}
      toggleAudioOnOff={toggleAudioOnOff}
      chat={chat}
      toggleChat={toggleChat}
      setTakePhoto={setTakePhoto}
      recordingMode={recordingMode}
      sendToggleRecording={sendToggleRecording}
      drawerOpen={drawerOpen}
      openDrawer={openDrawer}
      video={video}
      foundWebcams={foundWebcams}
      toggleWebcam={toggleWebcam}
      cameraSelected={cameraSelected}
      screen={screen}
      showThumbnails={showThumbnails}
      toggleVideoOnOff={toggleVideoOnOff}
      foundMicrophones={foundMicrophones}
      microphoneSelected={microphoneSelected}
      toggleMicrophone={toggleMicrophone}
    />
  )
}

CallBar.propTypes = {
  sendSignal: PropTypes.func,
  handleAddGlassToCallOpen: PropTypes.func,
  handleAddRemoteToCallOpen: PropTypes.func,
  handleAddScreenToCallOpen: PropTypes.func,
  handleAddCamToCallOpen: PropTypes.func,
  handleAddSubscriberOnGlassOpen: PropTypes.func,
  toggleScreenShare: PropTypes.func,
  endSession: PropTypes.func,
  audio: PropTypes.bool,
  toggleAudioOnOff: PropTypes.func,
  time: PropTypes.number,
  chat: PropTypes.bool,
  toggleChat: PropTypes.func,
  setTakePhoto: PropTypes.func,
  recordingMode: PropTypes.bool,
  sendToggleRecording: PropTypes.func,
  drawerOpen: PropTypes.bool,
  openDrawer: PropTypes.func,
  qrCode: PropTypes.bool,
  toggleQrCode: PropTypes.func,
  flipHorizontalMode: PropTypes.bool,
  toggleFlipHorizontalMode: PropTypes.func,
  screen: PropTypes.bool,
  video: PropTypes.bool,
  foundWebcams: PropTypes.object,
  toggleWebcam: PropTypes.func,
  cameraSelected: PropTypes.string,
  toggleVideoOnOff: PropTypes.func,
  toggleMicrophone: PropTypes.func
}

export default memo(CallBar)
