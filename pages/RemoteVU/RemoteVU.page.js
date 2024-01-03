import React from 'react'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import UserTable from '../../components/RemoteVU/UserTable/UserTable.component'
import { RemoteVUContextProvider } from '../../context/RemoteVU/RemoteVU.context'
import AddUser from '../../components/RemoteVU/AddUser/AddUser.component'
import PropTypes from 'prop-types'

const RemoteVU = ({ initiateCall, online, userBeingCalledId }) => {
  const [open, setOpen] = React.useState(false)
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

RemoteVU.propTypes = {
  initiateCall: PropTypes.func,
  online: PropTypes.object,
  userBeingCalledId: PropTypes.string
}

export default React.memo(RemoteVU)
