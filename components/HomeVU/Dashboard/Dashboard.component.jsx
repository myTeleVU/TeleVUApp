/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react'
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DidYouKnow from './DidYouKnow/DidYouKnow.component'
import PastCalls from './PastCalls/PastCalls.component'
import UpcomingCalls from './UpcomingCalls/UpcomingCalls.component'
import FilesAndRecordings from './FilesAndRecordings/FilesAndRecordings.components'
import CurrentlyOnline from './CurrentlyOnline/CurrentlyOnline.component'
import SchedulingModal from './SchedulingModal/SchedulingModal.component'
import { useTranslation } from 'react-i18next'
import { NotificationContext } from '../../../context/Shared/Notification.context'

import styles from './Dashboard.module.scss'

const Dashboard = ({ onlineUsers, initiateCall }) => {
  const [isOpenDidYouKnow, setIsOpenDidYouKnow] = useState(true)
  const [isOpenFiles, setIsOpenFiles] = useState(true)
  const [isOpenUpcomingCalls, setIsOpenUpcomingCalls] = useState(true)
  const [isOpenPastCalls, setIsOpenPastCalls] = useState(true)
  const [isOpenCurrentlyOnline, setIsOpenCurrentlyOnline] = useState(true)
  const [isOpenScheduleModal, setIsOpenScheduleModal] = useState(false)
  const [callId, setCallId] = useState(null)
  const { setSnackBarMessage } = useContext(NotificationContext)

  const { t } = useTranslation()

  const dashboardItems = [
    {
      title: t('Did You Know?'),
      isOpen: isOpenDidYouKnow,
      setIsOpen: setIsOpenDidYouKnow,
      component: <DidYouKnow />
    },
    {
      title: t('Your Files and Recordings'),
      isOpen: isOpenFiles,
      setIsOpen: setIsOpenFiles,
      component: <FilesAndRecordings />
    },
    {
      title: t('Upcoming Calls'),
      isOpen: isOpenUpcomingCalls,
      setIsOpen: setIsOpenUpcomingCalls,
      component: (
        <UpcomingCalls
          setIsOpenScheduleModal={setIsOpenScheduleModal}
          setCallId={setCallId}
        />
      ),
      isUpComingCalls: true
    },
    {
      title: t('Currently Online'),
      isOpen: isOpenCurrentlyOnline,
      setIsOpen: setIsOpenCurrentlyOnline,
      component: (
        <CurrentlyOnline
          onlineUsers={onlineUsers}
          initiateCall={initiateCall}
        />
      )
    },
    {
      title: t('Past Calls'),
      isOpen: isOpenPastCalls,
      setIsOpen: setIsOpenPastCalls,
      component: <PastCalls />,
      isLarge: true
    }
  ]

  const openSchedule = () => {
    setCallId(null)
    setIsOpenScheduleModal(true)
  }

  return (
    <Box className={styles.dashboard}>
      <Grid container spacing={2}>
        {dashboardItems.map((item, idx) => (
          <Grid
            item
            xs={12}
            md={item.isLarge ? 12 : 6}
            key={`dashboard-${idx}`}
            className={styles.dashboardItem}
          >
            <Accordion expanded={item.isOpen}>
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{ pointerEvents: 'auto' }}
                    onClick={() => item.setIsOpen(!item.isOpen)}
                  />
                }
                className={styles.dashboardItem__summary}
              >
                <Typography variant="h6">{item.title}</Typography>
                {item.isUpComingCalls && (
                  <Button
                    variant="contained"
                    className={styles.dashboardItem__btn}
                    size="large"
                    onClick={() => openSchedule()}
                  >
                    {t('Schedule')}
                  </Button>
                )}
              </AccordionSummary>
              <AccordionDetails
                className={styles.dashboardItem__details}
                sx={{ padding: 0 }}
              >
                {item.component}
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
      <SchedulingModal
        open={isOpenScheduleModal}
        setOpen={setIsOpenScheduleModal}
        callId={callId}
      />
    </Box>
  )
}

export default Dashboard
