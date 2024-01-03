import React, { memo } from 'react'
import GroupTable from '../../components/GroupVU/GroupTable/GroupTable.component'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import AddGroup from '../../components/GroupVU/AddGroup/AddGroup.component'
import { GlassVUContextProvider } from '../../context/GlassVU/GlassVU.context'
import { RemoteVUContextProvider } from '../../context/RemoteVU/RemoteVU.context'
import { GroupVUContextProvider } from '../../context/GroupVU/GroupVU.context'
import PropTypes from 'prop-types'

const GroupVU = ({
  online,
  userBeingCalledId,
  joinCall,
  addGlassVUToCall,
  addRemoteVUToCall
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <GlassVUContextProvider>
      <RemoteVUContextProvider>
        <GroupVUContextProvider>
          <>
            <TopBar openModal={() => setOpen(true)} />
            <GroupTable
              online={online}
              joinCall={joinCall}
              userBeingCalledId={userBeingCalledId}
              addGlassVUToCall={addGlassVUToCall}
              addRemoteVUToCall={addRemoteVUToCall}
            />
            <AddGroup open={open} handleClose={() => setOpen(false)} />
          </>
        </GroupVUContextProvider>
      </RemoteVUContextProvider>
    </GlassVUContextProvider>
  )
}

GroupVU.propTypes = {
  online: PropTypes.object,
  joinCall: PropTypes.func,
  userBeingCalledId: PropTypes.string,
  addGlassVUToCall: PropTypes.func,
  addRemoteVUToCall: PropTypes.func
}

export default memo(GroupVU)
