// TODO: switch to using scss

import React, { useRef, useContext } from 'react'
import { MdDraw } from 'react-icons/md'
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded'
import { drawingColors } from '../../../utils/constants'
import SettingButton from './SettingButton.component'
import { DrawCanvasContext } from '../../../context/Session/DrawCanvas.context'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import styles from './DrawingMenu.module.scss'

export const DrawingMenu = ({ sendSignal, showThumbnails }) => {
  const { t } = useTranslation()
  const drawingRef = useRef(null)
  const { isDrawing, setIsDrawing, remoteIsPointing, changeColor } =
    useContext(DrawCanvasContext)

  const sendResetDrawing = () => {
    sendSignal('reset drawing', 'true')
  }

  const toggleDraw = () => {
    if (remoteIsPointing) {
      return
    }
    if (!isDrawing) {
      sendSignal('remote pointing', 'true')
    } else {
      sendSignal('remote pointing', 'false')
    }
    setIsDrawing(!isDrawing)
  }

  return (
    <>
      <SettingButton
        toolTipTitleOn={'Stop Drawing'}
        toolTipTitleOff={'Start Drawing'}
        iconButtonRef={drawingRef}
        buttonAction={toggleDraw}
        buttonToggleState={isDrawing}
        buttonOnIcon={<MdDraw className={styles.activeButton} />}
        buttonOffIcon={<MdDraw />}
        displayText={showThumbnails ? t('Draw') : ''}
      />
      {isDrawing && (
        <div className={styles.palette}>
          {Object.keys(drawingColors).map((color) => (
            <button
              key={color}
              onClick={() => changeColor(color)}
              className={styles.palette__button}
              style={{ backgroundColor: color, color, margin: '0' }}
            />
          ))}

          <SettingButton
            toolTipTitleOff={'Clear Drawing'}
            buttonAction={sendResetDrawing}
            buttonOffIcon={
              <BackspaceRoundedIcon className={styles.activeButton} />
            }
            className={styles['palette__button--clear']}
          />
        </div>
      )}
    </>
  )
}

DrawingMenu.propTypes = {
  sendSignal: PropTypes.func,
  showThumbnails: PropTypes.bool
}
