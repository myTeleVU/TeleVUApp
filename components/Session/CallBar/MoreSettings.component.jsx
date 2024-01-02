import React, { useState, memo } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import SettingButton from './SettingButton.component'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import SourceSelector from './SourceSelector.component'
import Divider from '@mui/material/Divider'

import styles from './MoreSettings.module.scss'

const MoreSettings = ({
  sendSignal,
  showThumbnails,
  toggleWebcam,
  cameraSelected,
  foundWebcams,
  microphoneSelected,
  foundMicrophones,
  toggleMicrophone
}) => {
  const { t } = useTranslation()

  const [isMoreSettingsOpen, setIsMoreSettingsOpen] = useState(false)
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false)
  const [isVideoSettingsOpen, setIsVideoSettingsOpen] = useState(false)

  return (
    <>
      <SettingButton
        toolTipTitleOn={'Open More Settings'}
        toolTipTitleOff={'Close More Settings'}
        buttonAction={() => setIsMoreSettingsOpen(!isMoreSettingsOpen)}
        buttonToggleState={isMoreSettingsOpen}
        buttonOnIcon={<FiMoreHorizontal className={styles.activeButton} />}
        buttonOffIcon={<FiMoreHorizontal />}
        displayText={showThumbnails ? t('Settings') : ''}
      />
      {isMoreSettingsOpen && (
        <div className={styles.moreSettings}>
          <h5>{t('Video Source')}</h5>
          <SourceSelector
            isOpen={isVideoSettingsOpen}
            setShowSources={setIsVideoSettingsOpen}
            sourceSelected={cameraSelected}
            toggleSource={toggleWebcam}
            foundSources={foundWebcams}
          />
          <Divider />
          <h5>{t('Audio Source')}</h5>
          <SourceSelector
            isOpen={isAudioSettingsOpen}
            setShowSources={setIsAudioSettingsOpen}
            sourceSelected={microphoneSelected}
            toggleSource={toggleMicrophone}
            foundSources={foundMicrophones}
          />
        </div>
      )}
    </>
  )
}

MoreSettings.propTypes = {
  sendSignal: PropTypes.func,
  showThumbnails: PropTypes.bool,
  foundMicrophones: PropTypes.object,
  foundWebcams: PropTypes.object,
  toggleWebcam: PropTypes.func,
  toggleMicrophone: PropTypes.func
}

export default memo(MoreSettings)
