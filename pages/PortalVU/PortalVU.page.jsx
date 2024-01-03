import React, { useState } from 'react'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import PortalTable from '../../components/PortalVU/PortalTable/PortalTable.component'
import AddPortal from '../../components/PortalVU/AddPortal/AddPortal.component'
import EditPortal from '../../components/PortalVU/EditPortal/EditPortal.component'
import TipsTable from '../../components/PortalVU/TipsTable/TipsTable.component'
import { ActiveCalls } from '../../components/PortalVU/ActiveCalls/ActiveCalls.component'
import { PortalVUContextProvider } from '../../context/PortalVU/PortalVU.context'
import { UserTable } from '../../components/PortalVU/UserTable/UserTable.component'
import SettingsTable from '../../components/Settings/SettingsTable'
import './PortalVU.scss'

const PortalVU = () => {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [currentPortalName, setCurrentPortalName] = useState(null)
  const [currentLicenceCount, setCurrentLicenceCount] = useState(null)
  const [currentExpiryDate, setCurrentExpiryDate] = useState(null)

  const editPortal = (
    currentPortalName,
    currentLicenceCount,
    currentExpiryDate
  ) => {
    setCurrentPortalName(currentPortalName)
    setCurrentLicenceCount(currentLicenceCount)
    setCurrentExpiryDate(currentExpiryDate)
    setEditOpen(true)
  }

  return (
    <PortalVUContextProvider>
      <>
        <TopBar openModal={() => setAddOpen(true)} />
        <AddPortal open={addOpen} handleClose={() => setAddOpen(false)} />
        <EditPortal
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          currentPortalName={currentPortalName}
          currentLicenceCount={currentLicenceCount}
          currentExpiryDate={currentExpiryDate}
        />
        <div className="tableContainer">
          <SettingsTable header="Active Calls" content={<ActiveCalls />} />
          <SettingsTable
            header="All PortalVU"
            content={<PortalTable editPortal={editPortal} />}
            isStartOpen={false}
          />
          <SettingsTable
            header="All Users"
            content={<UserTable />}
            isStartOpen={false}
          />
          <SettingsTable
            header="Tips"
            content={<TipsTable />}
            isStartOpen={false}
          />
        </div>
      </>
    </PortalVUContextProvider>
  )
}

export default PortalVU
