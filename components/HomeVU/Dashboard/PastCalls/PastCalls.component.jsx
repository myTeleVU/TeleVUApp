import React, { useEffect, useContext, useState } from 'react'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import { getSummaryAnalyticsGraph } from '../../../../utils/functions'
import { HomeVUContext } from '../../../../context/HomeVU/HomeVU.context'
import { CurrentPortalContext } from '../../../../context/Shared/CurrentPortal.context'
import { CurrentUserContext } from '../../../../context/Shared/CurrentUser.context'

import styles from './PastCalls.module.scss'

const PastCalls = () => {
  const { t } = useTranslation()
  const { summaryAnalytics, fetchSummaryAnalytics } = useContext(HomeVUContext)
  const [summary, setSummary] = useState(null)
  const [monthlyStats, setMonthlyStats] = useState(null)
  const { portal } = useContext(CurrentPortalContext)
  const { me } = useContext(CurrentUserContext)

  useEffect(() => {
    if (portal.name) {
      fetchSummaryAnalytics(portal.name, me.id)
    }
  }, [portal.name])

  useEffect(() => {
    if (summaryAnalytics) {
      setSummary(summaryAnalytics[summaryAnalytics.length - 1])
      setMonthlyStats(getSummaryAnalyticsGraph(summaryAnalytics))
    }
  }, [summaryAnalytics])

  return (
    <Box className={styles.container}>
      <p className={styles.container__text}>
        {t('Calls this month')}: {summary ? summary.count : t('Not Available')}
      </p>
      {summaryAnalytics?.length && monthlyStats
        ? (
        <Line
          data={monthlyStats}
          options={{
            maintainAspectRatio: false
          }}
        />
          )
        : (
        <p>{t('You have not been in any calls this month!')}</p>
          )}
    </Box>
  )
}

export default PastCalls
