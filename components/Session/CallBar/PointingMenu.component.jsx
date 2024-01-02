import React from 'react'
import SettingButton from './SettingButton.component'
import { FaHandPointer } from 'react-icons/fa'
import { DrawCanvasContext } from '../../../context/Session/DrawCanvas.context'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

export const PointingMenu = ({ sendSignal }) => {
  const { isPointing, setIsPointing, remoteIsPointing } =
    React.useContext(DrawCanvasContext)
  const { t } = useTranslation()

  const togglePoint = () => {
    if (remoteIsPointing) {
      return
    }
    if (!isPointing) {
      sendSignal('remote pointing', 'true')
    } else {
      sendSignal('remote pointing', 'false')
    }
    setIsPointing(!isPointing)
  }
  return (
    <SettingButton
      buttonAction={togglePoint}
      buttonToggleState={isPointing}
      buttonOnIcon={<FaHandPointer className="activeButton" />}
      buttonOffIcon={<FaHandPointer />}
      displayText={t('Point')}
    />
  )
}

PointingMenu.propTypes = {
  sendSignal: PropTypes.func
}
