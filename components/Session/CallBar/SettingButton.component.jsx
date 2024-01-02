import React, { memo, useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import { SideBarContext } from '../../../context/Shared/SideBar.context'
import PropTypes from 'prop-types'

import styles from './SettingButton.module.scss'

const SettingButton = ({
  displayText,
  toolTipTitleOn,
  toolTipTitleOff,
  iconButtonRef,
  buttonAction,
  buttonToggleState,
  buttonOnIcon,
  buttonOffIcon,
  toolTipPlacement,
  column = true
}) => {
  const { isTabletOrMobile } = useContext(SideBarContext)
  return (
    <div
      className={column ? styles.settingButtonColumn : styles.settingButtonRow}
      onClick={buttonAction}
    >
      <IconButton ref={iconButtonRef} className={styles.roundIcon}>
        {buttonToggleState ? buttonOnIcon : buttonOffIcon}
      </IconButton>
      {!isTabletOrMobile && <span>{displayText}</span>}
    </div>
  )
}

SettingButton.propTypes = {
  displayText: PropTypes.string,
  toolTipTitleOn: PropTypes.string,
  toolTipTitleOff: PropTypes.string,
  iconButtonRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  buttonAction: PropTypes.func,
  buttonToggleState: PropTypes.bool,
  buttonOnIcon: PropTypes.node,
  buttonOffIcon: PropTypes.node,
  toolTipPlacement: PropTypes.string,
  column: PropTypes.bool
}

export default memo(SettingButton)
