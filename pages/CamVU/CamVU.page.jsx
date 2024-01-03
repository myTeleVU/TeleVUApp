import React, { useState } from 'react'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import CamTable from '../../components/CamVU/CamTable/CamTable.component'
import { CamVUContextProvider } from '../../context/CamVU/CamVU.context'
import AddCam from '../../components/CamVU/AddCam/AddCam.component'
import PropTypes from 'prop-types'

const CamVU = ({ initiateCall, online }) => {
  const [open, setOpen] = useState(false)
  return (
    <CamVUContextProvider>
      <>
        <TopBar openModal={() => setOpen(true)} />
        <CamTable initiateCall={initiateCall} online={online} />
        <AddCam open={open} handleClose={() => setOpen(false)} />
      </>
    </CamVUContextProvider>
  )
}

CamVU.propTypes = {
  initiateCall: PropTypes.func,
  online: PropTypes.object
}

export default CamVU
