import React, { useContext, useEffect, useState } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button
} from '@mui/material'
import { MdDeleteOutline } from 'react-icons/md'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import QRCode from 'qrcode.react'
import { CurrentPortalContext } from '../../../../context/Shared/CurrentPortal.context'
import { HomeVUContext } from '../../../../context/HomeVU/HomeVU.context'
import { CurrentUserContext } from '../../../../context/Shared/CurrentUser.context'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styles from './UpcomingCalls.module.scss'

const UpcomingCalls = ({ setCallId, setIsOpenScheduleModal }) => {
  const { portal } = useContext(CurrentPortalContext)
  const { me } = useContext(CurrentUserContext)
  const { scheduledMeetings, getScheduledMeetings, deleteScheduledMeeting } =
    useContext(HomeVUContext)

  const [isMeetingDetailsExpandedArr, setIsMeetingDetailsExpandedArr] =
    useState(null)

  const navigate = useNavigate()
  const { t } = useTranslation()

  const formatDate = (dateString) => {
    const date = new Date(dateString)

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }

    return date.toLocaleString('en-US', options)
  }

  const dateHasPassed = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    return date < now
  }

  const openMeetingDetails = (index) => {
    const newIsMeetingDetailsExpandedArr = [...isMeetingDetailsExpandedArr]
    newIsMeetingDetailsExpandedArr[index] =
      !newIsMeetingDetailsExpandedArr[index]
    setIsMeetingDetailsExpandedArr(newIsMeetingDetailsExpandedArr)
  }

  const cancelMeeting = async (id) => {
    await deleteScheduledMeeting(id)
    getScheduledMeetings(portal.name, me.id)
  }

  const editMeeting = (id) => {
    setCallId(id)
    setIsOpenScheduleModal(true)
  }

  useEffect(() => {
    if (portal.name) {
      getScheduledMeetings(portal.name, me.id)
    }
  }, [portal.name])

  useEffect(() => {
    if (scheduledMeetings) {
      setIsMeetingDetailsExpandedArr(
        new Array(scheduledMeetings.length).fill(false)
      )
    }
  }, [scheduledMeetings])

  return (
    <Box className={styles.container}>
      {scheduledMeetings && isMeetingDetailsExpandedArr
        ? (
            scheduledMeetings.map((call, index) => (
          <Accordion
            key={index}
            className={styles.call}
            expanded={isMeetingDetailsExpandedArr[index] || false}
            disableGutters
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{ pointerEvents: 'auto' }}
                  onClick={() => openMeetingDetails(index)}
                />
              }
              className={styles.call__summary}
              sx={{
                '.MuiAccordionSummary-content': {
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }
              }}
            >
              <Box>
                <Typography className={styles.call__name}>
                  {call.topic}
                </Typography>
                <Typography className={styles.call__date}>
                  {formatDate(call.startDateTime)}
                </Typography>
              </Box>
              <Button
                className={
                  dateHasPassed(call.endDateTime)
                    ? styles.call__btn
                    : styles.call__btn__active
                }
                variant="outlined"
                color="inherit"
                onClick={() =>
                  navigate(`/session/?join_session_id=${call.sessionToken}`)
                }
                disabled={dateHasPassed(call.endDateTime)}
                sx={{ height: 'fit-content' }}
              >
                {dateHasPassed(call.endDateTime)
                  ? t('Call Ended')
                  : t('Start Call')}
              </Button>
            </AccordionSummary>
            <AccordionDetails className={styles.call__details}>
              <Box className={styles.invitees}>
                <Typography className={styles.invitees__title}>
                  {t('Invitees')}
                </Typography>
                <Typography className={styles.invitees__subTitle}>
                  {t('GlassVU')}
                </Typography>
                {call.devices.length > 0
                  ? (
                      call.devices.map((d, index) => (
                    <Typography
                      key={`glassvu-${index}`}
                      className={styles.invitees__item}
                    >
                      {d.device.name}
                    </Typography>
                      ))
                    )
                  : (
                  <Typography className={styles.invitees__item}>
                    {t('No GlassVU users were invited to this meeting!')}
                  </Typography>
                    )}

                <Typography className={styles.invitees__subTitle}>
                  {t('RemoteVU')}
                </Typography>
                {call.users.filter((u) => u.user.userType === 'RemoteVU')
                  .length > 0
                  ? (
                      call.users
                        .filter((u) => u.user.userType === 'RemoteVU')
                        .map((u, index) => (
                      <Typography
                        key={`remotevu-${index}`}
                        className={styles.invitees__item}
                      >
                        {u.user.name}
                      </Typography>
                        ))
                    )
                  : (
                  <Typography className={styles.invitees__item}>
                    {t('No RemoteVU users were invited to this meeting!')}
                  </Typography>
                    )}

                <Typography className={styles.invitees__subTitle}>
                  {t('ScreenVU')}
                </Typography>
                {call.users.filter((u) => u.user.userType === 'ScreenVU')
                  .length > 0
                  ? (
                      call.users
                        .filter((u) => u.user.userType === 'ScreenVU')
                        .map((u, index) => (
                      <Typography
                        key={`screenvu-${index}`}
                        className={styles.invitees__item}
                      >
                        {u.user.name}
                      </Typography>
                        ))
                    )
                  : (
                  <Typography className={styles.invitees__item}>
                    {t('No ScreenVU users were invited to this meeting!')}
                  </Typography>
                    )}

                <Typography className={styles.invitees__subTitle}>
                  {t('CamVU')}
                </Typography>

                {call.screens.length > 0
                  ? (
                      call.screens.map((c, index) => (
                    <Typography
                      key={`camvu-${index}`}
                      className={styles.invitees__item}
                    >
                      {c.screen.name}
                    </Typography>
                      ))
                    )
                  : (
                  <Typography className={styles.invitees__item}>
                    {t('No CamVU users were invited to this meeting!')}
                  </Typography>
                    )}
                <Box className={styles.call__actions}>
                  <Button
                    variant="outlined"
                    className={styles.editButton}
                    endIcon={<MdDeleteOutline />}
                    onClick={() => {
                      editMeeting(call.id)
                    }}
                  >
                    {t('Edit')}
                  </Button>
                  <Button
                    variant="outlined"
                    className={styles.deleteButton}
                    endIcon={<MdDeleteOutline />}
                    onClick={() => {
                      cancelMeeting(call.id)
                    }}
                  >
                    {t('Cancel')}
                  </Button>
                </Box>
              </Box>

              <QRCode
                id="qrCode"
                value={`${process.env.REACT_APP_FRONTEND}/session/?join_session_id=${call.sessionToken}`}
                size={100}
                className={styles.qrCode}
              />
            </AccordionDetails>
          </Accordion>
            ))
          )
        : (
        <Typography className={styles.call__noCalls}>
          {t('No upcoming calls')}
        </Typography>
          )}
    </Box>
  )
}

export default UpcomingCalls
