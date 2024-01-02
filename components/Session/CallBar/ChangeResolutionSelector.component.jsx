import React, { useState, memo } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { resolutionOptions } from '../../../utils/constants'
import SettingButton from './SettingButton.component'
import { GoScreenFull } from 'react-icons/go'
import PropTypes from 'prop-types'
import { trackEvent } from '../../../utils/functions'
import { useTranslation } from 'react-i18next'

const ChangeResolutionSelector = ({ sendSignal }) => {
  const [resolutionMenuAnchorEl, setResolutionMenuAnchorEl] = useState(null)
  const [currentResolution, setCurrentResolution] = useState(2)
  const { t } = useTranslation()
  const resolutionChanged = (event, index) => {
    trackEvent('Resolution Change', {
      resolution: resolutionOptions[index]
    })
    sendSignal('video-resolution', resolutionOptions[index])
    setResolutionMenuAnchorEl(null)
    setCurrentResolution(index)
  }

  return (
    <>
      <SettingButton
        toolTipTitleOn={'Change Resolution'}
        buttonAction={(e) => setResolutionMenuAnchorEl(e.currentTarget)}
        buttonOffIcon={<GoScreenFull />}
        toolTipPlacement={'right'}
        displayText={t('Resolution')}
      />
      <Menu
        id="simple-menu"
        anchorEl={resolutionMenuAnchorEl}
        keepMounted
        open={Boolean(resolutionMenuAnchorEl)}
        onClose={() => setResolutionMenuAnchorEl(null)}
      >
        {resolutionOptions.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === currentResolution}
            onClick={(event) => resolutionChanged(event, index)}
          >
            {t(option)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

ChangeResolutionSelector.propTypes = {
  sendSignal: PropTypes.func
}

export default memo(ChangeResolutionSelector)
