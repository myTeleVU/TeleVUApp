import React, { useState, memo } from 'react'
import GlassTable from '../../components/GlassVU/GlassTable/GlassTable.component'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import AddDevice from '../../components/GlassVU/AddDevice/AddDevice.component'
import { GlassVUContextProvider } from '../../context/GlassVU/GlassVU.context'
import PropTypes from 'prop-types'

const GlassVU = ({ initiateCall, online, userBeingCalledId }) => {
  const [open, setOpen] = useState(false)

  return (
    <GlassVUContextProvider>
      <>
        <TopBar openModal={() => setOpen(true)} />
        <GlassTable
          online={online}
          initiateCall={initiateCall}
          userBeingCalledId={userBeingCalledId}
        />
        <AddDevice open={open} handleClose={() => setOpen(false)} />
      </>
    </GlassVUContextProvider>
  )
}

GlassVU.propTypes = {
  initiateCall: PropTypes.func,
  online: PropTypes.object,
  userBeingCalledId: PropTypes.string
}

export default memo(GlassVU)
