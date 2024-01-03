import React, { createContext, useState } from 'react'
import ReportVUService from '../../services/ReportVU/ReportVU.service'
import { formatAnalytics } from '../../utils/functions'
import PropTypes from 'prop-types'

export const ReportVUContext = createContext()

export const ReportVUContextProvider = (props) => {
  const [allAnalytics, setAllAnalytics] = useState(null)
  const [summaryAnalytics, setSummaryAnalytics] = useState(null)

  const fetchAnalytics = async (portalName) => {
    try {
      const res = await ReportVUService.fetchAnalytics(portalName)
      setAllAnalytics(formatAnalytics(res.data))
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSummaryAnalytics = async (portalName) => {
    try {
      const res = await ReportVUService.fetchSummaryAnalytics(portalName)
      setSummaryAnalytics(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAnalyticsFiltered = async (portalName, from, to, user) => {
    try {
      const res = await ReportVUService.fetchAnalyticsFiltered(
        portalName,
        from,
        to,
        user
      )

      setAllAnalytics(formatAnalytics(res.data))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ReportVUContext.Provider
      value={{
        allAnalytics,
        summaryAnalytics,
        fetchAnalytics,
        fetchSummaryAnalytics,
        fetchAnalyticsFiltered
      }}
    >
      {props.children}
    </ReportVUContext.Provider>
  )
}

ReportVUContextProvider.propTypes = {
  children: PropTypes.object
}
