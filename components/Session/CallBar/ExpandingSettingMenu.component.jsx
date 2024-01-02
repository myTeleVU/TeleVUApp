// TODO: refactor this component, we can use an array of objects to map over and render the buttons

import React, { useState, useRef } from 'react'
import SettingButton from './SettingButton.component'
// import { checkCurrent } from '../../../utils/functions'
import PropTypes from 'prop-types'

import styles from './ExpandingSettingMenu.module.scss'

const ExpandingSettingMenu = ({
  displayText,
  sendSignal,
  topButtonOnIcon,
  topButtonOffIcon,
  topButtonToolTip,
  buttonOneToolTip,
  buttonTwoToolTip,
  buttonThreeToolTip,
  buttonOneCommand,
  buttonTwoCommand,
  buttonThreeCommand,
  buttonOneIcon,
  buttonTwoIcon,
  buttonThreeIcon,
  currMainStreams,
  streamIndex
}) => {
  const [expand, setExpand] = useState(false)
  const expandRef = useRef(null)
  const connectionObject = currMainStreams
    ? [currMainStreams[streamIndex]?.stream?.connection]
    : []

  return (
    <div className={styles.mainButton}>
      <SettingButton
        toolTipTitleOn={topButtonToolTip}
        iconButtonRef={expandRef}
        buttonAction={() => setExpand(!expand)}
        buttonToggleState={expand}
        buttonOnIcon={topButtonOnIcon}
        buttonOffIcon={topButtonOffIcon}
        toolTipPlacement={expand ? 'top' : 'right'}
        displayText={displayText}
      />
      {expand && (
        <div className={styles.expandBar}>
          {buttonOneToolTip && (
            <SettingButton
              toolTipTitleOn={buttonOneToolTip}
              buttonAction={() =>
                sendSignal(buttonOneCommand, null, connectionObject)
              }
              buttonOffIcon={buttonOneIcon}
              toolTipPlacement={'bottom'}
            />
          )}
          {buttonTwoToolTip && (
            <SettingButton
              toolTipTitleOn={buttonTwoToolTip}
              buttonAction={() =>
                sendSignal(buttonTwoCommand, null, connectionObject)
              }
              buttonOffIcon={buttonTwoIcon}
              toolTipPlacement={'bottom'}
            />
          )}
          {buttonThreeToolTip && (
            <SettingButton
              toolTipTitleOn={buttonThreeToolTip}
              buttonAction={() =>
                sendSignal(buttonThreeCommand, null, connectionObject)
              }
              buttonOffIcon={buttonThreeIcon}
              toolTipPlacement={'bottom'}
            />
          )}
        </div>
      )}
    </div>
  )
}

ExpandingSettingMenu.propTypes = {
  displayText: PropTypes.string,
  sendSignal: PropTypes.func,
  topButtonOnIcon: PropTypes.node,
  topButtonOffIcon: PropTypes.node,
  topButtonToolTip: PropTypes.string,
  buttonOneToolTip: PropTypes.string,
  buttonTwoToolTip: PropTypes.string,
  buttonThreeToolTip: PropTypes.string,
  buttonOneCommand: PropTypes.string,
  buttonTwoCommand: PropTypes.string,
  buttonThreeCommand: PropTypes.string,
  buttonOneIcon: PropTypes.node,
  buttonTwoIcon: PropTypes.node,
  buttonThreeIcon: PropTypes.node,
  currMainStreams: PropTypes.array,
  streamIndex: PropTypes.number
}

export default ExpandingSettingMenu
