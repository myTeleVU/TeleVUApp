import React from 'react'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import ReportsGraph from '../../components/ReportVU/ReportsGraph/ReportGraph.component'
import ReportsFilter from '../../components/ReportVU/ReportsFilter/ReportsFilter'
import { ReportVUContextProvider } from '../../context/ReportVU/ReportVU.context'
import { GlassVUContextProvider } from '../../context/GlassVU/GlassVU.context'
import { RemoteVUContextProvider } from '../../context/RemoteVU/RemoteVU.context'

const ReportVU = () => {
  return (
    <ReportVUContextProvider>
      <>
        <TopBar />
        <div style={{ padding: '24px' }}>
          <ReportsGraph />
        </div>
        <GlassVUContextProvider>
          <RemoteVUContextProvider>
            <div style={{ padding: '24px' }}>
              <ReportsFilter />
            </div>
          </RemoteVUContextProvider>
        </GlassVUContextProvider>
      </>
    </ReportVUContextProvider>
  )
}

export default ReportVU
