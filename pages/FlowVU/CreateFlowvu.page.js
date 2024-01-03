import React, { useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomButton from '../../components/FlowVU/CustomButton/CustomButton'
import { CurrentPortalContext } from '../../context/Shared/CurrentPortal.context'
import { FlowVUContext } from '../../context/FlowVU/FlowVU.context'

import './CreateFlowvu.page.css'
import CircularProgress from '@mui/material/CircularProgress'
import { NotificationContext } from '../../context/Shared/Notification.context'
import { useTranslation } from 'react-i18next'

const CreateFlowvu = () => {
  const { createFlowvu, getFlowvuOperation } = useContext(FlowVUContext)
  const navigate = useNavigate()

  const { portal } = useContext(CurrentPortalContext)
  const nextBtnText = 'Upload'
  const fileSizeLimitInMB = 100
  const headingText = `Upload your PowerPoint Presentation, less than ${fileSizeLimitInMB}MB`

  const [uploadBtnText, setUploadBtnText] = useState('Select File')
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [isDisabled, setIsDisabled] = useState(true)
  const [isUploadDisabled, setIsUploadDisabled] = useState(false)
  const uploadInputRef = useRef(null)
  const nameInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setSnackBarMessage } = useContext(NotificationContext)
  const { t } = useTranslation()

  const handleUpload = (e) => {
    e.preventDefault()
    uploadInputRef.current?.click()
  }

  const handleDisplayFileDetails = () => {
    const inputFile =
      (uploadInputRef.current?.files.length !== 0 &&
        uploadInputRef.current.files[0].name) ||
      ''
    if (!isValidExtension(inputFile)) {
      setUploadedFileName(null)
      setIsDisabled(true)
      setSnackBarMessage(
        t('Please choose a valid PPT file'),
        'error'
      )
    } else if (!isValidFileSize(uploadInputRef.current.files[0])) {
      setUploadedFileName(null)
      setIsDisabled(true)
      setSnackBarMessage(
        t(`PPT file exceeds ${fileSizeLimitInMB}MB`),
        'error'
      )
    } else {
      setErrorMsg(null) // incase the error message was already set due to previous file selection
      setUploadedFileName(uploadInputRef.current.files[0].name)
      setIsDisabled(false)
    }
  }

  const isValidFileSize = (file) => {
    const byteValue = 1048576
    const maxFileSizeLimitInBytes = fileSizeLimitInMB * byteValue
    return file.size <= maxFileSizeLimitInBytes
  }

  const isValidExtension = (filename) => {
    const ext = /^.+\.([^.]+)$/.exec(filename)
    return ext[1] === 'pptx' || ext[1] === 'ppt'
  }

  const uploadPpt = async () => {
    const pptData = new FormData()
    pptData.append('portalId', portal.id)
    pptData.append('flowvuName', nameInputRef.current?.value)
    pptData.append('pptFile', uploadInputRef.current?.files[0])
    try {
      const response = await createFlowvu(pptData)
      const flowvuOperationId = response.data
      let flowvuOperationStatus = await getFlowvuOperation(flowvuOperationId)
      const timer = (ms) =>
        new Promise((resolve, reject) => setTimeout(resolve, ms))
      async function pollOperationStatus () {
        while (flowvuOperationStatus.data.done === false) {
          await timer(3000)
          flowvuOperationStatus = await getFlowvuOperation(flowvuOperationId)
        }
      }

      await pollOperationStatus()
      setIsLoading(false)
      navigate(`/flowvu/${flowvuOperationStatus.data.resultId}`)
    } catch (err) {
      setSnackBarMessage(
        t(err.response.data.message),
        'error'
      )
      setUploadBtnText('Select File')
      setIsDisabled(false)
      setIsUploadDisabled(false)
      setIsLoading(false)
      console.error(err.message)
    }
  }

  const validateUpload = () => {
    const workflowName = nameInputRef.current?.value
    if (!workflowName || workflowName.trim() === '') {
      setSnackBarMessage(
        t('Please enter a name for your workflow'),
        'error'
      )
    } else {
      setUploadBtnText('Uploading ...')
      setIsDisabled(true)
      setIsUploadDisabled(true)
      setIsLoading(true)
      uploadPpt()
    }
  }

  return (
    <div>
      <CustomButton
        isDisabled={isDisabled}
        isGreyBg={isDisabled}
        btnText={nextBtnText}
        size="lg"
        btnClassNames="ps-5 pe-5"
        classNames="justify-content-end d-flex pt-5"
        onClickHandler={validateUpload}
      />
      {headingText}
      <input
        ref={nameInputRef}
        type="text"
        className="no-outline pt-5"
        placeholder="Enter Workflow Name"
      />
      <input
        ref={uploadInputRef}
        onChange={handleDisplayFileDetails}
        className="d-none"
        type="file"
        accept=".ppt, .pptx"
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20
        }}
      >
        <CustomButton
          icon={true}
          isDisabled={isUploadDisabled}
          isGreyBg={isUploadDisabled}
          btnText={uploadBtnText}
          btnClassNames="ps-5 pe-5 me-4"
          size="lg"
          onClickHandler={handleUpload}
        />
        {isLoading ? <CircularProgress style={{ color: '#3594B6' }} /> : null}
      </div>

      {/* Conditional text. Should show once file is successfully uploaded */}
      <p className="display-inline">
        {' '}
        {uploadedFileName
          ? (
              'Selected file: ' + uploadedFileName
            )
          : (
          <span className="text-danger">{errorMsg}</span>
            )}
      </p>
    </div>
  )
}

export default CreateFlowvu
