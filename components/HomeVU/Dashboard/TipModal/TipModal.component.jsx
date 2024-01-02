/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { getModalStyle } from '../../../../utils/functions'

import {
  Modal,
  Box,
  Typography,
  TextField,
  Divider,
  Button,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { MdCancel } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import styles from './TipModal.module.scss'

const TipModal = ({ open, setOpen, tip }) => {
  const [modalStyle] = useState(getModalStyle)
  const { t } = useTranslation()

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div style={modalStyle} className={styles.container}>
        <div className={styles.container__topBar}>
          <p className={styles.container__title}>{tip.title}</p>
          <div className={styles.container__closeContainer}>
            <MdCancel
              onClick={() => setOpen(false)}
              className={styles.container__closeButton}
            />
            {t('Close')}
          </div>
        </div>
        <div className={styles.container__form}>{tip.description}</div>
        <div className={styles.container__bottomBar}>
          <div className={styles.container__bottomButtons}></div>
        </div>
      </div>
    </Modal>
  )
}

export default TipModal
