/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { CurrentPortalContext } from '../../../../context/Shared/CurrentPortal.context'
import { HomeVUContext } from '../../../../context/HomeVU/HomeVU.context'
import { Typography, Box, IconButton, Modal } from '@mui/material'
import VideoViewer from '../../../FileVU/VideoViewer/VideoViewer.component'
import { useTranslation } from 'react-i18next'
import { trackEvent, formatFileSize } from '../../../../utils/functions'
import { BiFileBlank } from 'react-icons/bi'
import { BsCloudDownload, BsEyeFill } from 'react-icons/bs'

import styles from './FilesAndRecordings.module.scss'

const FilesAndRecordings = () => {
  const { portal } = useContext(CurrentPortalContext)
  const { viewFile, allFiles, fetchFiles, viewFileById } =
    useContext(HomeVUContext)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [fileKey, setFileKey] = useState('')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const { t } = useTranslation()

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const date = new Date(dateString)

    return date.toLocaleDateString(undefined, options)
  }

  const getUrl = async (key) => {
    try {
      const response = await viewFile(portal.name, key)
      setFileKey(key)
      setUrl(response.data.url)
      setNote(response.data.note)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDownload = async (key) => {
    try {
      await getUrl(key)

      const link = document.createElement('a')
      link.download = url
      link.href = url
      link.click()

      trackEvent('Downloaded Recorded Video')
    } catch (err) {
      console.log(err)
    }
  }

  const handleView = async (key) => {
    try {
      await getUrl(key)
      setVideoModalOpen(true)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (portal.name) {
      fetchFiles(portal.name)
    }
  }, [portal.name])

  return (
    <Box className={styles.container}>
      {allFiles?.length > 0
        ? (
            allFiles?.map((file, index) => (
          <Box key={index} className={styles.file}>
            <BiFileBlank className={styles['file__icon--file']} />
            <Box className={styles.file__info}>
              <Typography className={styles.file__name}>{file.Key}</Typography>
              <Typography className={styles.file__stats}>{`${formatDate(
                file.LastModified
              )} – ${formatFileSize(file.Size)}`}</Typography>
            </Box>
            <Box className={styles.file__btns}>
              <IconButton onClick={() => handleDownload(file.Key)}>
                <BsCloudDownload
                  className={styles.file__icon}
                  style={{ color: '#2a81a7' }}
                />
              </IconButton>
              <IconButton onClick={() => handleView(file.Key)}>
                <BsEyeFill className={styles.file__icon} />
              </IconButton>
            </Box>
          </Box>
            ))
          )
        : (
        <Typography className={styles.noFiles}>
          {t('No files or recordings')}
        </Typography>
          )}

      <Modal open={videoModalOpen} onClose={() => setVideoModalOpen(false)}>
        <Box className={styles.videoModal}>
          <VideoViewer
            url={url}
            fileKey={fileKey}
            setVideo={setVideoModalOpen}
            note={note}
          />
        </Box>
      </Modal>
    </Box>
  )
}

export default FilesAndRecordings
