/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react'
import {
  Alert,
  Typography,
  Box,
  Button,
  Checkbox,
  Modal,
  Divider,
  TextField,
  FormControlLabel,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  OutlinedInput
} from '@mui/material'
import QRCode from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import styles from './SchedulingModal.module.scss'
import { HomeVUContext } from '../../../../context/HomeVU/HomeVU.context'
import { CurrentPortalContext } from '../../../../context/Shared/CurrentPortal.context'
import { CurrentUserContext } from '../../../../context/Shared/CurrentUser.context'
import { NotificationContext } from '../../../../context/Shared/Notification.context'
import { getModalStyle } from '../../../../utils/functions'
import { MdCancel } from 'react-icons/md'

const SchedulingModal = ({ open, setOpen, callId }) => {
  const {
    allDevices,
    allUsers,
    allScreens,
    fetchDevices,
    fetchUsers,
    fetchScreens,
    createScheduledMeeting,
    editScheduledMeeting,
    getScheduledMeetings,
    getScheduledMeeting
  } = useContext(HomeVUContext)
  const { portal } = useContext(CurrentPortalContext)
  const { me } = useContext(CurrentUserContext)
  const { setSnackBarMessage } = useContext(NotificationContext)

  const [selectedGlasses, setSelectedGlasses] = useState([])
  const [selectedRemoteUsers, setSelectedRemoteUsers] = useState([])
  const [selectdScreens, setSelectedScreens] = useState([])
  const [selectedCameras, setSelectedCameras] = useState([])
  const [meetingToken, setMeetingToken] = useState('')
  const [modalStyle] = useState(getModalStyle)

  const emptyFormValues = {
    topic: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timeZome: '',
    automaticId: true,
    needsPassword: false,
    calendar: 'iCal',
    password: ''
  }

  const [formValues, setFormValues] = useState(emptyFormValues)

  const { t } = useTranslation()

  const clearAll = () => {
    setFormValues(emptyFormValues)
    setSelectedGlasses([])
    setSelectedRemoteUsers([])
    setSelectedScreens([])
    setSelectedCameras([])
  }

  const handleClose = () => {
    clearAll()
    setOpen(false)
  }

  const formatDateTimeToIcal = (dateTime) => {
    return dateTime.toISOString().replace(/-|:|\.\d+/g, '')
  }

  const handleSave = async () => {
    try {
      if (callId) {
        const meetingParams = {
          startDateTime,
          endDateTime
        }

        const res = await editScheduledMeeting(callId, meetingParams)

        setSnackBarMessage(
          t('Your meeting was successfuly updated!'),
          'success'
        )
        getScheduledMeetings(portal.name, me.id)
        handleClose()
      } else {
        const glasses = allDevices.filter((device) =>
          selectedGlasses.includes(device.name)
        )

        const remoteUsers = allUsers.filter((user) =>
          selectedRemoteUsers.includes(user.name)
        )

        const screens = allUsers.filter((screen) =>
          selectdScreens.includes(screen.name)
        )

        const cameras = allScreens.filter((camera) =>
          selectedCameras.includes(camera.name)
        )

        const meetingParams = {
          ...formValues,
          startDateTime,
          endDateTime,
          hostEmail: me.email,
          hostId: me.id,
          portalId: portal.id,
          glasses,
          remoteUsers,
          screens,
          cameras
        }

        const res = await createScheduledMeeting(meetingParams)

        setMeetingToken(res.data.sessionToken)
        setSnackBarMessage(
          t('Your meeting was successfuly scheduled!'),
          'success'
        )
        getScheduledMeetings(portal.name, me.id)
        handleClose()
      }
    } catch (err) {
      console.log(err)
      setSnackBarMessage(
        t('An error occurred when scheduling your meeting.'),
        'error'
      )
    }
  }

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value
    })
  }

  const handleSwitchChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.checked
    })
  }

  const handleNewSelection = (e) => {
    return typeof value === 'string'
      ? e.target.value.split(',')
      : e.target.value
  }

  function addHours (date, hours) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000)

    return date
  }

  const inviteesDropdowns = [
    {
      lblText: 'GlassVU',
      value: selectedGlasses,
      allOptions: allDevices,
      onChange: (e) => setSelectedGlasses(handleNewSelection(e)),
      filterFunc: (device) => device
    },
    {
      lblText: 'RemoteVU',
      value: selectedRemoteUsers,
      allOptions: allUsers,
      onChange: (e) => setSelectedRemoteUsers(handleNewSelection(e)),
      filterFunc: (user) => user.userType === 'RemoteVU'
    },
    {
      lblText: 'ScreenVU',
      value: selectdScreens,
      allOptions: allUsers,
      onChange: (e) => setSelectedScreens(handleNewSelection(e)),
      filterFunc: (user) => user.userType === 'ScreenVU'
    },
    {
      lblText: 'CamVU',
      value: selectedCameras,
      allOptions: allScreens,
      onChange: (e) => setSelectedCameras(handleNewSelection(e)),
      filterFunc: (screen) => screen
    }
  ]

  const startDateTime = new Date(
    `${formValues.startDate}T${formValues.startTime}`
  )
  const endDateTime = new Date(`${formValues.endDate}T${formValues.endTime}`)

  useEffect(() => {
    fetchDevices(portal.name)
    fetchUsers(portal.name)
    fetchScreens(portal.name)
  }, [portal.name])

  const loadBlank = () => {
    const startDate = new Date()
    startDate.setMinutes(Math.ceil(startDate.getMinutes() / 30) * 30)
    const startDateString = startDate.toLocaleDateString('en-CA')
    const startTimeString = startDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })

    const endDate = addHours(startDate, 1)
    const endTimeString = endDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })

    setFormValues({
      ...formValues,
      startDate: startDateString,
      startTime: startTimeString,
      endDate: startDateString,
      endTime: endTimeString
    })
  }

  const getMeeting = async () => {
    const meeting = await getScheduledMeeting(callId)

    const startDate = new Date(meeting.data.startDateTime)
    const startDateString = startDate.toLocaleDateString('en-CA')
    const startTimeString = startDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })

    const endDate = new Date(meeting.data.endDateTime)
    const endDateString = endDate.toLocaleDateString('en-CA')
    const endTimeString = endDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })

    const topic = meeting.data.topic
    console.log(topic)

    setFormValues({
      ...formValues,
      topic,
      startDate: startDateString,
      startTime: startTimeString,
      endDate: endDateString,
      endTime: endTimeString
    })
  }

  useEffect(() => {
    if (open) {
      if (callId) {
        clearAll()
        getMeeting()
      } else {
        loadBlank()
      }
    }
  }, [open])

  useEffect(() => {
    if (formValues.startDate) {
      setFormValues({
        ...formValues,
        endDate: formValues.startDate
      })
    }
  }, [formValues.startDate])

  useEffect(() => {
    if (formValues.startTime) {
      const endDate = addHours(startDateTime, 1)
      const endTimeString = endDate.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })

      setFormValues({
        ...formValues,
        endTime: endTimeString
      })
    }
  }, [formValues.startTime])

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div style={modalStyle} className={styles.container}>
          <div className={styles.container__topBar}>
            <p className={styles.container__title}>
              {callId ? t('Edit Meeting') : t('Schedule Meeting')}
            </p>
            <div className={styles.container__closeContainer}>
              <MdCancel
                onClick={handleClose}
                className={styles.container__closeButton}
              />
              {t('Close')}
            </div>
          </div>
          <div className={styles.container__form}>
            <Box className={styles.section} id="topic-section">
              <Typography className={styles.section__title}>
                {t('Topic')}
              </Typography>
              <TextField
                name="topic"
                value={formValues.topic}
                onChange={handleChange}
                size="small"
                fullWidth
                disabled={callId}
              />
            </Box>
            <Divider className={styles.container__divider} />
            <Box className={styles.section} id="date-and-time-section">
              <Typography className={styles.section__title}>
                {t('Date & Time')}
              </Typography>

              <Box className={styles.section__dateAndTime}>
                <TextField
                  name="startDate"
                  type="date"
                  size="small"
                  value={formValues.startDate}
                  onChange={handleChange}
                />
                <TextField
                  name="startTime"
                  type="time"
                  size="small"
                  value={formValues.startTime}
                  onChange={handleChange}
                  style={{ minWidth: '103px' }}
                />

                <span>{t('to')}</span>

                <TextField
                  name="endDate"
                  type="date"
                  size="small"
                  value={formValues.endDate}
                  onChange={handleChange}
                />
                <TextField
                  name="endTime"
                  type="time"
                  size="small"
                  value={formValues.endTime}
                  onChange={handleChange}
                  style={{ minWidth: '103px' }}
                />
              </Box>

              {startDateTime >= endDateTime && (
                <Alert severity="error">
                  {t('Meeting start time is after meeting end time')}
                </Alert>
              )}
            </Box>
            <Divider className={styles.container__divider} />
            {!callId && (
              <>
                <Box className={styles.section} id="invitees-section">
                  <Typography className={styles.section__title}>
                    {t('Invitees')}
                  </Typography>
                  {inviteesDropdowns.map((dropdown) => (
                    <FormControl
                      fullWidth
                      className={styles.dropdown}
                      key={`${dropdown.lblText}-dropdown`}
                    >
                      <InputLabel
                        size="small"
                        id={`${dropdown.lblText}-dropdown-lbl`}
                      >
                        {dropdown.lblText}
                      </InputLabel>
                      <Select
                        labelId={`${dropdown.lblText}-dropdown-lbl`}
                        multiple
                        value={dropdown.value}
                        onChange={dropdown.onChange}
                        size="small"
                        input={<OutlinedInput label={dropdown.lblText} />}
                        renderValue={(selected) => selected.join(', ')}
                      >
                        {dropdown.allOptions
                          .filter(dropdown.filterFunc)
                          .map((option) => (
                            <MenuItem
                              key={`${option.name}-${dropdown.lblText}`}
                              value={option.name}
                            >
                              <Checkbox
                                checked={
                                  dropdown.value.indexOf(option.name) > -1
                                }
                              />
                              <ListItemText primary={option.name} />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  ))}
                </Box>
              </>
            )}
          </div>
          <div className={styles.container__bottomBar}>
            <div className={styles.container__bottomButtons}>
              <Button onClick={handleSave} className={styles.container__button}>
                {callId ? t('Edit') : t('Save')}
              </Button>
              <QRCode
                id="qrCode"
                value={`${process.env.REACT_APP_FRONTEND}/session/?join_session_id=${meetingToken}`}
                size={125}
                className={styles.qrCode}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SchedulingModal
