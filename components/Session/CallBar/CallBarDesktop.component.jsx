// TODO: Talk about refactoring our navbar

import React, { useContext, memo } from 'react'
import Button from '@mui/material/Button'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { BsFillChatLeftTextFill } from 'react-icons/bs'
import {
  FaImages,
  FaMicrophoneAlt,
  FaMicrophoneAltSlash,
  FaVideo,
  FaVideoSlash
} from 'react-icons/fa'
import { MdScreenShare } from 'react-icons/md'
import { RiRecordMailFill, RiScreenshot2Fill } from 'react-icons/ri'
import { CurrentPortalContext } from '../../../context/Shared/CurrentPortal.context'
import { SideBarContext } from '../../../context/Shared/SideBar.context'
import { theme } from '../../../styles/theme.style'
import { AddMenu } from './AddMenu.component'
import { DrawingMenu } from './DrawingMenu.component'
import { PointingMenu } from './PointingMenu.component'
import SettingButton from './SettingButton.component'
import MoreSettings from './MoreSettings.component'

import styles from './CallBarDesktop.module.scss'

const CallBarDesktop = ({
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
  foundMicrophones,
  microphoneSelected,
  toggleVideoOnOff,
  toggleMicrophone
}) => {
  const { isMobile } = useContext(SideBarContext)
  const { portal } = useContext(CurrentPortalContext)
  const { t } = useTranslation()
  const md = new MobileDetect(window.navigator.userAgent)

  return (
    <div className={styles.sessionHeader}>
      <img src={theme.LOGO_WHITE} className={styles.sessionHeader__callLogo} />
      {portal.role !== 'Viewer' && (
        <div className={styles.callBarGroup}>
          <MoreSettings
            sendSignal={sendSignal}
            showThumbnails={showThumbnails}
            toggleWebcam={toggleWebcam}
            cameraSelected={cameraSelected}
            foundWebcams={foundWebcams}
            microphoneSelected={microphoneSelected}
            foundMicrophones={foundMicrophones}
            toggleMicrophone={toggleMicrophone}
          />
          <SettingButton
            toolTipTitleOn={'Close Image Gallery'}
            toolTipTitleOff={'Open Image Gallery'}
            buttonAction={openDrawer}
            buttonToggleState={drawerOpen}
            buttonOnIcon={<FaImages className={styles.activeButton} />}
            buttonOffIcon={<FaImages />}
            displayText={showThumbnails ? t('Image Gallery') : ''}
          />
          {!md.mobile() && (
            <SettingButton
              buttonAction={toggleScreenShare}
              buttonToggleState={screen}
              buttonOnIcon={<MdScreenShare className={styles.activeButton} />}
              buttonOffIcon={<MdScreenShare />}
              displayText={showThumbnails ? t('Screen Share') : ''}
            />
          )}
          <SettingButton
            toolTipTitleOn={'Close Chat'}
            toolTipTitleOff={'Open Chat'}
            buttonAction={toggleChat}
            buttonToggleState={chat}
            buttonOnIcon={
              <BsFillChatLeftTextFill className={styles.activeButton} />
            }
            buttonOffIcon={<BsFillChatLeftTextFill />}
            displayText={showThumbnails ? t('Chat') : ''}
          />
          {isMobile && (
            <>
              <AddMenu
                handleAddGlassToCallOpen={handleAddGlassToCallOpen}
                handleAddRemoteToCallOpen={handleAddRemoteToCallOpen}
                handleAddScreenToCallOpen={handleAddScreenToCallOpen}
                handleAddCamToCallOpen={handleAddCamToCallOpen}
                showThumbnails={showThumbnails}
              />
              <SettingButton
                toolTipTitleOff={'Take Screenshot'}
                buttonAction={() => setTakePhoto(true)}
                buttonOffIcon={<RiScreenshot2Fill />}
                displayText={showThumbnails ? t('Screenshot') : ''}
              />
            </>
          )}
          {!isMobile && (
            <AddMenu
              handleAddGlassToCallOpen={handleAddGlassToCallOpen}
              handleAddRemoteToCallOpen={handleAddRemoteToCallOpen}
              handleAddScreenToCallOpen={handleAddScreenToCallOpen}
              handleAddCamToCallOpen={handleAddCamToCallOpen}
              showThumbnails={showThumbnails}
            />
          )}
          {!isMobile && (
            <>
              <SettingButton
                toolTipTitleOff={'Take Screenshot'}
                buttonAction={() => setTakePhoto(true)}
                buttonOffIcon={<RiScreenshot2Fill />}
                displayText={showThumbnails ? t('Screenshot') : ''}
              />
              <SettingButton
                toolTipTitleOn={'Stop Recording'}
                toolTipTitleOff={'Start Recording'}
                buttonAction={sendToggleRecording}
                buttonToggleState={recordingMode}
                buttonOnIcon={
                  <RiRecordMailFill className={styles.activeButton} />
                }
                buttonOffIcon={<RiRecordMailFill />}
                displayText={showThumbnails ? t('Record') : ''}
              />
            </>
          )}
          <DrawingMenu
            showThumbnails={showThumbnails}
            sendSignal={sendSignal}
          />
          {md.mobile() && <PointingMenu sendSignal={sendSignal} />}
          {isMobile && (
            <SettingButton
              toolTipTitleOn={'Stop Recording'}
              toolTipTitleOff={'Start Recording'}
              buttonAction={sendToggleRecording}
              buttonToggleState={recordingMode}
              buttonOnIcon={
                <RiRecordMailFill className={styles.activeButton} />
              }
              buttonOffIcon={<RiRecordMailFill />}
              displayText={showThumbnails ? t('Record') : ''}
            />
          )}
          <SettingButton
            toolTipTitleOn={'Video On'}
            toolTipTitleOff={'Video Off'}
            buttonAction={toggleVideoOnOff}
            buttonToggleState={video}
            buttonOnIcon={<FaVideo />}
            buttonOffIcon={<FaVideoSlash />}
            displayText={showThumbnails ? t('Video') : ''}
          />
          <SettingButton
            toolTipTitleOn={'Mute'}
            toolTipTitleOff={'Unmute'}
            buttonAction={toggleAudioOnOff}
            buttonToggleState={audio}
            buttonOnIcon={<FaMicrophoneAlt />}
            buttonOffIcon={<FaMicrophoneAltSlash />}
            displayText={showThumbnails ? t('Mute') : ''}
          />
        </div>
      )}

      <Button
        variant="contained"
        color="error"
        onClick={endSession}
        className={styles.endCall}
      >
        {t('End')}
      </Button>
    </div>
  )
}

CallBarDesktop.propTypes = {
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
  foundMicrophones: PropTypes.object,
  microphoneSelected: PropTypes.string,
  toggleVideoOnOff: PropTypes.func,
  toggleMicrophone: PropTypes.func
}

export default memo(CallBarDesktop)
