/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { Typography, Box, Button } from '@mui/material'
import { CurrentPortalContext } from '../../../../context/Shared/CurrentPortal.context'
import { CurrentUserContext } from '../../../../context/Shared/CurrentUser.context'
import { useTranslation } from 'react-i18next'
import { deviceTypes } from '../../../../utils/constants'

import styles from './CurrentlyOnline.module.scss'

const CurrentlyOnline = ({ onlineUsers, initiateCall }) => {
  const { portal } = useContext(CurrentPortalContext)
  const { me } = useContext(CurrentUserContext)
  const { t } = useTranslation()
  const [flattenedOnlineUsers, setFlattenedOnlineUsers] = useState([])

  useEffect(() => {
    if (onlineUsers && Object.keys(onlineUsers).length > 0) {
      setFlattenedOnlineUsers([
        ...onlineUsers[portal?.name]?.Device,
        ...onlineUsers[portal?.name]?.Operator.filter(
          (user) => user.userId !== me?.email
        ),
        ...onlineUsers[portal?.name]?.ScreenVU
      ])
    }
  }, [onlineUsers])

  return (
    <>
      {flattenedOnlineUsers.length > 0
        ? (
            flattenedOnlineUsers.map((user, i) => (
          <Box key={`user-${i}`} className={styles.userContainer}>
            <Box className={styles.user}>
              <Typography className={styles.user__name}>
                {user.name || user.userId}
              </Typography>
              <Typography className={styles.user__type}>
                {user.userType === 'Device'
                  ? user.userSubType
                    ? deviceTypes[user.userSubType]
                    : deviceTypes[user.userType]
                  : deviceTypes[user.userType]}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              className={styles.user__callButton}
              onClick={() => initiateCall(user?.socketId)}
            >
              {t('Call')}
            </Button>
          </Box>
            ))
          )
        : (
        <Typography className={styles.noUsers}>
          {t('No one is currently online!')}
        </Typography>
          )}
    </>
  )
}

export default CurrentlyOnline
