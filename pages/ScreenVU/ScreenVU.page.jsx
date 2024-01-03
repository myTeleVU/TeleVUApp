import React, { useState, memo } from 'react'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import UserTable from '../../components/ScreenVU/UserTable/UserTable.component'
import { RemoteVUContextProvider } from '../../context/RemoteVU/RemoteVU.context'
import AddUser from '../../components/ScreenVU/AddUser/AddUser.component'
import PropTypes from 'prop-types'

const ScreenVU = ({ initiateCall, online, userBeingCalledId }) => {
  const [open, setOpen] = useState(false)
  return (
    <RemoteVUContextProvider>
      <>
        <TopBar openModal={() => setOpen(true)} />
        <UserTable
          initiateCall={initiateCall}
          online={online}
          userBeingCalledId={userBeingCalledId}
        />
        <AddUser open={open} handleClose={() => setOpen(false)} />
      </>
    </RemoteVUContextProvider>
  )
}

ScreenVU.propTypes = {
  initiateCall: PropTypes.func,
  online: PropTypes.object,
  userBeingCalledId: PropTypes.string
}

export default memo(ScreenVU)
