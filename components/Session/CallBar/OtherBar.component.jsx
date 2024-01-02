import React, { useState, useContext, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { IoMdRefresh } from 'react-icons/io'
import { MdFlashlightOff, MdFlashlightOn, MdQrCode } from 'react-icons/md'
import { SideBarContext } from '../../../context/Shared/SideBar.context'
import { trackEvent } from '../../../utils/functions'
import SettingButton from './SettingButton.component'
import SpeedMenu from './SpeedMenu.component'

import styles from './GlassSettings.module.scss'

const OtherBar = ({ sendSignal, time, currMainStreams, streamIndex }) => {
  const [qrCode, setQrCode] = useState(false)
  const [flashlightState, setFlashlightState] = useState(false)
  const { isMobile } = useContext(SideBarContext)
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
    <div
      className={
        isMobile
          ? `${styles.otherGlassSettings} ${styles.fullWidth}`
          : styles.otherGlassSettings
      }
    >
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
      <SpeedMenu time={time} />
    </div>
  )
}

OtherBar.propTypes = {
  sendSignal: PropTypes.func,
  time: PropTypes.number,
  currMainStreams: PropTypes.array,
  streamsIndex: PropTypes.number
}

export default memo(OtherBar)
