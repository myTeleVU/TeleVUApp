/* eslint-disable no-unused-vars */

import React, { useState, memo } from 'react'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import Dashboard from '../../components/HomeVU/Dashboard/Dashboard.component'
import { HomeVUContextProvider } from '../../context/HomeVU/HomeVU.context'

const HomeVU = ({ onlineUsers, initiateCall }) => {
  const [open, setOpen] = useState(false)

  return (
    <HomeVUContextProvider>
      <>
        <TopBar openModal={() => setOpen(true)} />
        <Dashboard onlineUsers={onlineUsers} initiateCall={initiateCall} />
      </>
    </HomeVUContextProvider>
  )
}

export default memo(HomeVU)
