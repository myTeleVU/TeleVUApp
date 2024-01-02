// TODO: create unified scss

import React, { useState, useRef } from 'react'
import SettingButton from './SettingButton.component'
import { checkCurrent } from '../../../utils/functions'
import { MdAddToPhotos, MdOutlineConnectedTv } from 'react-icons/md'
import { FiUsers, FiCamera } from 'react-icons/fi'
import { FaGlasses } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { theme } from '../../../styles/theme.style'

import styles from './AddMenu.module.scss'

export const AddMenu = ({
  handleAddGlassToCallOpen,
  handleAddRemoteToCallOpen,
  handleAddScreenToCallOpen,
  handleAddCamToCallOpen,
  showThumbnails
}) => {
  const [expand, setExpand] = useState(false)
  const expandRef = useRef(null)
  const { t } = useTranslation()

  const openMenu = (fn) => {
    setExpand(false)
    fn()
  }

  return (
    <div>
      <SettingButton
        buttonAction={() => setExpand(!expand)}
        iconButtonRef={expandRef}
        buttonToggleState={expand}
        buttonOnIcon={<MdAddToPhotos className={styles.activeButton} />}
        buttonOffIcon={<MdAddToPhotos />}
        displayText={showThumbnails ? t('Add') : ''}
      />
      {expand && (
        <div
          className={styles.expand}
          style={{
            top: checkCurrent(expandRef) ? expandRef.current.offsetTop + 70 : 0,
            left: checkCurrent(expandRef) ? expandRef.current.offsetLeft : 0
          }}
        >
          <div className={styles.addMenuDiv}>
            <SettingButton
              buttonAction={() => openMenu(handleAddRemoteToCallOpen)}
              buttonOffIcon={<FiUsers />}
              displayText={`${t('Add')} ${t(theme.REMOTEVU)}`}
              column={false}
            />
            <SettingButton
              buttonAction={() => openMenu(handleAddScreenToCallOpen)}
              buttonOffIcon={<MdOutlineConnectedTv />}
              displayText={`${t('Add')} ${t(theme.SCREENVU)}`}
              column={false}
            />
            <SettingButton
              buttonAction={() => openMenu(handleAddCamToCallOpen)}
              buttonOffIcon={<FiCamera />}
              displayText={`${t('Add')} ${t(theme.CAMVU)}`}
              column={false}
            />
            <SettingButton
              buttonAction={() => openMenu(handleAddGlassToCallOpen)}
              buttonOffIcon={<FaGlasses />}
              displayText={`${t('Add')} ${t(theme.GLASSVU)}`}
              column={false}
            />
          </div>
        </div>
      )}
    </div>
  )
}

AddMenu.propTypes = {
  handleAddGlassToCallOpen: PropTypes.func,
  handleAddRemoteToCallOpen: PropTypes.func,
  handleAddScreenToCallOpen: PropTypes.func,
  handleAddCamToCallOpen: PropTypes.func
}
