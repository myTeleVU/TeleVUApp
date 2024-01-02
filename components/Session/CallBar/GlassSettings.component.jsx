// TODO: refactor the ExpandingSettingMenu component to be more generic, i.e. supply array of tooltips, commands, icons, etc.
// TODO: fix issue with SpeedMenu

import React, { useState, useCallback } from 'react'
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from 'react-icons/fa'
import {
  MdAddBox,
  MdOutlineRemoveCircleOutline,
  MdBrightnessMedium,
  MdPauseCircleFilled,
  MdPlayCircleFilled,
  MdFlashlightOff,
  MdFlashlightOn,
  MdQrCode
} from 'react-icons/md'
import { IoMdRefresh } from 'react-icons/io'
import { RiZoomInFill, RiFocus3Fill, RiArrowGoBackLine } from 'react-icons/ri'
import { FiSettings } from 'react-icons/fi'
import { HiSpeakerWave } from 'react-icons/hi2'
import SettingButton from './SettingButton.component'
import ChangeResolutionSelector from './ChangeResolutionSelector.component'
import ExpandingSettingMenu from './ExpandingSettingMenu.component'
import { trackEvent } from '../../../utils/functions'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import styles from './GlassSettings.module.scss'

const GlassSettings = ({
  sendSignal,
  currMainStreams,
  streamIndex,
  toggleVideo,
  isLocalVideoPaused,
  time,
  isSettingsExpanded,
  setIsSettingsExpanded,
  audio,
  toggleAudio
}) => {
  const [qrCode, setQrCode] = useState(false)
  const [flashlightState, setFlashlightState] = useState(false)
  const { t } = useTranslation()

  const connectionObject = currMainStreams
    ? [currMainStreams[streamIndex]?.stream?.connection]
    : []

  const toggleQrCode = useCallback(() => {
    setQrCode(!qrCode)
  }, [qrCode])

  const sendRenegotitate = useCallback(() => {
    trackEvent('Renegotiate Connection')
    sendSignal('renegotiate', null, connectionObject)
  }, [sendSignal])

  const toggleFlashlight = useCallback(() => {
    trackEvent('Flashlight Change', {
      flashlightState: !flashlightState
    })
    if (!flashlightState) {
      sendSignal('flaslight on', '', connectionObject)
    } else {
      sendSignal('flaslight off', '', connectionObject)
    }
    setFlashlightState(!flashlightState)
  }, [flashlightState, sendSignal])

  return (
    <div className={styles.container}>
      <button
        onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
        className={styles.settingsButton}
      >
        <FiSettings className={styles.settingsButton__icon} />
      </button>
      <div
        className={`${styles.glassSettings} ${
          isSettingsExpanded
            ? styles['glassSettings--open']
            : styles['glassSettings--closed']
        }`}
      >
        {isSettingsExpanded && (
          <>
            <SettingButton
              toolTipTitleOn={'Mute Glass'}
              toolTipTitleOff={'Unmute Glass'}
              buttonAction={toggleAudio}
              buttonToggleState={audio}
              buttonOnIcon={<FaMicrophoneAlt />}
              buttonOffIcon={<FaMicrophoneAltSlash />}
              toolTipPlacement={'right'}
              displayText={t('Mute')}
            />
            <SettingButton
              toolTipTitleOn={'Resume Video'}
              toolTipTitleOff={'Pause Video'}
              buttonAction={toggleVideo}
              buttonToggleState={isLocalVideoPaused}
              buttonOnIcon={<MdPlayCircleFilled />}
              buttonOffIcon={<MdPauseCircleFilled />}
              displayText={t('Pause')}
            />
            <ExpandingSettingMenu
              topButtonToolTip={'Change Zoom'}
              buttonOneToolTip={'Zoom In'}
              buttonTwoToolTip={'Zoom Out'}
              buttonThreeToolTip={'Zoom Reset'}
              sendSignal={sendSignal}
              topButtonOnIcon={<RiZoomInFill className={styles.active} />}
              topButtonOffIcon={<RiZoomInFill />}
              buttonOneCommand={'zoom in'}
              buttonTwoCommand={'zoom out'}
              buttonThreeCommand={'zoom reset'}
              buttonOneIcon={<MdAddBox />}
              buttonTwoIcon={<MdOutlineRemoveCircleOutline />}
              buttonThreeIcon={<RiArrowGoBackLine />}
              displayText={t('Zoom')}
              currMainStreams={currMainStreams}
              streamIndex={streamIndex}
            />
            <ExpandingSettingMenu
              topButtonToolTip={'Change Brightness'}
              buttonOneToolTip={'Set Brighter'}
              buttonTwoToolTip={'Set Darker'}
              sendSignal={sendSignal}
              topButtonOnIcon={<MdBrightnessMedium className={styles.active} />}
              topButtonOffIcon={<MdBrightnessMedium />}
              buttonOneCommand={'set brighter'}
              buttonTwoCommand={'set darker'}
              buttonOneIcon={<MdAddBox />}
              buttonTwoIcon={<MdOutlineRemoveCircleOutline />}
              displayText={t('Brightness')}
              currMainStreams={currMainStreams}
              streamIndex={streamIndex}
            />
            <ExpandingSettingMenu
              topButtonToolTip={'Change Focus'}
              buttonOneToolTip={'Focus In'}
              buttonTwoToolTip={'Focus Out'}
              buttonThreeToolTip={'Focus Reset'}
              sendSignal={sendSignal}
              topButtonOnIcon={<RiFocus3Fill className={styles.active} />}
              topButtonOffIcon={<RiFocus3Fill />}
              buttonOneCommand={'focus in'}
              buttonTwoCommand={'focus out'}
              buttonThreeCommand={'focus reset'}
              buttonOneIcon={<MdAddBox />}
              buttonTwoIcon={<MdOutlineRemoveCircleOutline />}
              buttonThreeIcon={<RiArrowGoBackLine />}
              displayText={t('Focus')}
              currMainStreams={currMainStreams}
              streamIndex={streamIndex}
            />
            <ExpandingSettingMenu
              topButtonToolTip={'Change Volume'}
              buttonOneToolTip={'Increase Volume'}
              buttonTwoToolTip={'Decrease Volume'}
              sendSignal={sendSignal}
              topButtonOnIcon={<HiSpeakerWave className={styles.active} />}
              topButtonOffIcon={<HiSpeakerWave />}
              buttonOneCommand={'volume up'}
              buttonTwoCommand={'volume down'}
              buttonOneIcon={<MdAddBox />}
              buttonTwoIcon={<MdOutlineRemoveCircleOutline />}
              displayText={t('Volume')}
              currMainStreams={currMainStreams}
              streamIndex={streamIndex}
            />
            <ChangeResolutionSelector sendSignal={sendSignal} />
            <SettingButton
              toolTipTitleOn={'Flashlight Off'}
              toolTipTitleOff={'Flashlight On'}
              buttonAction={toggleFlashlight}
              buttonToggleState={flashlightState}
              buttonOnIcon={<MdFlashlightOff />}
              buttonOffIcon={<MdFlashlightOn />}
              toolTipPlacement={'right'}
              displayText={t('Flashlight')}
            />
            <SettingButton
              toolTipTitleOn={'Stop scanning'}
              toolTipTitleOff={'Start scanning'}
              buttonAction={toggleQrCode}
              buttonToggleState={qrCode}
              buttonOnIcon={<MdQrCode className={styles.active} />}
              buttonOffIcon={<MdQrCode />}
              toolTipPlacement={'right'}
              displayText={t('Scan')}
            />
            <SettingButton
              toolTipTitleOn={'Reconnect Glass'}
              buttonAction={sendRenegotitate}
              buttonOffIcon={<IoMdRefresh />}
              toolTipPlacement={'right'}
              displayText={t('Reconnect')}
            />
            {/* <SpeedMenu time={time} /> */}
          </>
        )}
      </div>
    </div>
  )
}

GlassSettings.propTypes = {
  sendSignal: PropTypes.func,
  currMainStreams: PropTypes.array,
  streamIndex: PropTypes.number,
  toggleVideo: PropTypes.func,
  isLocalVideoPaused: PropTypes.bool,
  time: PropTypes.number,
  isSettingsExpanded: PropTypes.bool,
  setIsSettingsExpanded: PropTypes.func,
  audio: PropTypes.bool,
  toggleAudio: PropTypes.func
}

export default GlassSettings
