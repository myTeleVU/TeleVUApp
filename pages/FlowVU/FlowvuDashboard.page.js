import React, { useContext, useEffect, useState } from 'react'
import FlowTable from '../../components/FlowVU/FlowTable/FlowTable.component'
import CustomModal from '../../components/FlowVU/CustomModal/CustomModal'
import { FlowVUContext } from '../../context/FlowVU/FlowVU.context'

import { CurrentPortalContext } from '../../context/Shared/CurrentPortal.context'
import TopBar from '../../components/Shared/TopBar/TopBar.component'

const FlowvuDashboard = () => {
  const {
    flowvus,
    setFlowvuDashboardData,
    updateFlowvuStatus,
    deleteFlowvu,
    goToCreateNewWorkFlow
  } = useContext(FlowVUContext)

  const { portal } = useContext(CurrentPortalContext)
  const [showModal, setShowModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState('')
  const modalTitle = 'Please confirm'

  useEffect(() => {
    setFlowvuDashboardData(portal.id)
  }, [portal.id])

  const deleteFlowvuHandler = (e) => {
    e.preventDefault()
    deleteFlowvu(itemToDelete, portal.id)
  }

  const handleStatusBtnClick = (flowID, type) => {
    if (type.trim().toLowerCase() === 'delete') {
      setItemToDelete(flowID)
      setShowModal(true)
    } else {
      const status =
        type.trim().toLowerCase() === 'draft' ? 'draft' : 'published'
      updateFlowvuStatus(flowID, status, portal.id)
    }
  }

  return (
    <div>
      <TopBar openModal={() => goToCreateNewWorkFlow()} />
      <FlowTable
        flowvus={flowvus}
        portalName={portal.name}
        handleStatusBtnClick={handleStatusBtnClick}
      />
      <CustomModal
        showModal={showModal}
        setShowModal={setShowModal}
        onSubmit={(e) => deleteFlowvuHandler(e)}
        modalTitle={modalTitle}
        modalType="deleteConfirmation"
        extraData={itemToDelete}
      />
    </div>
  )
}

export default FlowvuDashboard
