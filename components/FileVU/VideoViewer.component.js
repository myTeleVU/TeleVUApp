import React, { useState, createRef, useContext, useEffect } from 'react'
import useStyles from './VideoViewer.style'
import Paper from '@mui/material/Paper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '../../utils/functions'
import { useSearchParams } from 'react-router-dom'
import { MyImageEditor } from '../services/Session/ImageEditor/ImageEditor.component'
import SessionService from '../../services/Session/Session.service'
import FileVUService from '../services/FileVU/FileVU.service'
import { CurrentPortalContext } from '../context/Shared/CurrentPortal.context'
import { NotificationContext } from '../context/Shared/Notification.context'
import { v4 as uuidv4 } from 'uuid'
import TextField from '@mui/material/TextField'
import './VideoViewer.scss'

export default function VideoViewer ({ setVideo, url, fileKey, note }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [extension, setExtension] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [isImageEditor, setIsImageEditor] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const imageRef = createRef(null)
  const { portal } = useContext(CurrentPortalContext)
  const [currentNote, setCurrentNote] = useState(note)
  const { setSnackBarMessage } = useContext(NotificationContext)

  useEffect(() => {
    const extension = fileKey.split('.').slice(-1)[0]
    if (extension) {
      setExtension(extension)
    } else {
      setExtension('mp4')
    }
  }, [fileKey])

  const onDownload = () => {
    trackEvent('Downloaded Recorded Video')
    const link = document.createElement('a')
    link.download = url
    link.href = url
    link.click()
  }

  const onBackButton = () => {
    searchParams.delete('video_id')
    setSearchParams(searchParams)
    setVideo(false)
  }

  const drawImage = () => {
    const img = imageRef.current
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const dataURL = canvas.toDataURL('image/png')
    return dataURL
  }

  const onEditButton = () => {
    setCurrentImage(drawImage())
    setIsImageEditor(true)
  }

  const onSaveButton = () => {
    FileVUService.addNote(fileKey.split('/')[1], currentNote)
  }

  const isPhoto = () => {
    return extension === 'png'
  }

  const isVideo = () => {
    return ['mp4', 'webm', 'mov'].includes(extension)
  }

  const isArchive = () => {
    return extension === 'zip'
  }

  const saveImage = async (file) => {
    const formData = new FormData()
    const blob = await fetch(file).then((r) => r.blob())
    const name = uuidv4() + '.png'
    formData.append('sampleFile', blob, name)
    formData.append('portalName', portal.name)
    formData.append('folderName', fileKey.split('/')[0])
    formData.append('prevFileName', fileKey.split('/')[1])
    SessionService.updateImage(formData)
      .then(() => {
        setSnackBarMessage(t('File saved'))
      })
      .catch(() => {
        setSnackBarMessage(t('File was not saved'), 'error')
      })
  }

  return (
    <Paper>
      <div className={classes.content}>
        <p className={classes.line} onClick={onBackButton}>
          <KeyboardArrowLeft />
          {t('Back')}
        </p>
        <div className="videoViewer__content">
          {!isImageEditor && (
            <>
              <div className={classes.video}>
                {isVideo() && (
                  <video
                    className={classes.videoplayer}
                    controls
                    preload="auto"
                  >
                    <source src={url} type="video/mp4" />
                    <source src={url} type="video/webm" />
                    <source src={url} type="video/ogg" />
                  </video>
                )}
                {isPhoto() && (
                  <img
                    src={url}
                    style={{ maxWidth: '80%' }}
                    ref={imageRef}
                    crossOrigin="anonymous"
                  />
                )}
                {isArchive() && (
                  <>
                    <p>
                      {t(
                        'Cannot display zip file in browser. Please download below'
                      )}
                    </p>
                  </>
                )}
              </div>
              <div className={classes.video}>
                <div className="file">File: {fileKey.split('/')[1]}</div>
                {isPhoto() && (
                  <TextField
                    id="outlined-basic"
                    label="Write a note"
                    variant="outlined"
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    rows={4}
                    multiline
                  />
                )}
                <div className="vieoViewer__actions">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onDownload}
                    className="buttonColor"
                  >
                    {t('Download')}
                  </Button>
                  {isPhoto() && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onEditButton}
                      className="buttonColor"
                    >
                      {t('Edit')}
                    </Button>
                  )}
                  {isPhoto() && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onSaveButton}
                      className="buttonColor"
                      disabled={!currentNote?.length > 0}
                    >
                      {t('Save Note')}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
          {isImageEditor && currentImage && (
            <div className="vieoViewer__imageEditor">
              <MyImageEditor
                closeImageEditor={() => setIsImageEditor(false)}
                currentImage={currentImage}
                saveImage={saveImage}
              />
            </div>
          )}
        </div>
      </div>
    </Paper>
  )
}

VideoViewer.propTypes = {
  setVideo: PropTypes.func,
  url: PropTypes.string,
  fileKey: PropTypes.string,
  setSnackBarMessage: PropTypes.func,
  openSnackBar: PropTypes.func,
  note: PropTypes.string
}
