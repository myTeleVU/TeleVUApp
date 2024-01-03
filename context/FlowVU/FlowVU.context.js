import React, { createContext, useState, useEffect } from 'react'
import FlowVUService from '../../services/FlowVU/FlowVU.service'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import LogicNode from '../../components/FlowVU/LogicNode/LogicNode'

export const FlowVUContext = createContext()

export const FlowVUContextProvider = (props) => {
  const [flowvus, setFlowvus] = useState([])
  const [sidebarContent, setSidebarContent] = useState([])
  const [initialNodes, setInitialNodes] = useState([])
  const [initialEdges, setInitialEdges] = useState([])
  const [flowvuName, setFlowvuName] = useState('')

  const [showEditLogicModal, setShowEditLogicModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setFlowvus([])
  }, [location.pathname])

  const createFlowvu = async (slides) => {
    const response = await FlowVUService.createFlowvu(slides)
    return response
  }

  const appendSlidesToExistingFlow = async (slides) => {
    const response = await FlowVUService.appendSlidesToExistingFlow(slides)
    return response
  }

  const getFlowvuOperation = async (flowvuOperationId) => {
    const flowvuStatus = await FlowVUService.getFlowvuOperation(
      flowvuOperationId
    )
    return flowvuStatus
  }

  const setFlowvuDashboardData = async (portalId) => {
    const flowvus = await FlowVUService.listFlowvus(portalId)
    setFlowvus(flowvus.data)
  }

  const updateFlowvuStatus = async (flowvuId, status, portalId) => {
    await FlowVUService.updateFlowvuStatus(flowvuId, status)
    await setFlowvuDashboardData(portalId)
  }

  const saveFlowvu = async (flowvuId, nodes, sidebarContent, edges) => {
    await FlowVUService.saveFlowvu(flowvuId, nodes, sidebarContent, edges)
  }

  const deleteFlowvu = async (flowvuId, portalId) => {
    await FlowVUService.deleteFlowvu(flowvuId)
    await setFlowvuDashboardData(portalId)
  }

  const setFlowvuData = async (flowId) => {
    const flowvu = await FlowVUService.getFlowvu(flowId)
    const nodesInFlowvu = flowvu.data.flowvuNode.filter(
      (node) => node.posX || node.posY
    )
    setInitialNodes(getInitialNodes(nodesInFlowvu))
    setInitialEdges(flowvu.data.flowvuConnector)
    setSidebarContent(getSidebarContent(flowvu.data.flowvuNode))
    setFlowvuName(flowvu.data.name)
  }

  const getInitialNodes = (nodes) => {
    const slideNodes = getInitialSlideNodes(
      nodes.filter((node) => node.nodeType === 'slide')
    )
    const logicNodes = getInitialLogicNodes(
      nodes.filter((node) => node.nodeType === 'logic')
    )
    return slideNodes.concat(logicNodes)
  }

  const getInitialSlideNodes = (slideNodes) => {
    return slideNodes.map((node) => {
      return {
        id: node.id,
        type: 'default',
        position: {
          x: node.posX,
          y: node.posY
        },
        data: {
          label: (
            <img
              src={node.contentUrl}
              datakey={node}
              alt="draggable presentation file"
            />
          )
        }
      }
    })
  }

  const getInitialLogicNodes = (logicNodes) => {
    return logicNodes.map((node) => {
      return {
        id: node.id,
        type: 'default',
        position: {
          x: node.posX,
          y: node.posY
        },
        data: {
          label: (
            <LogicNode
              label={node.displayText}
              onClickHandler={() => {
                setShowEditLogicModal(true)
              }}
            />
          )
        },
        startNode: node.startNode
      }
    })
  }

  const getSidebarContent = (nodes) => {
    const slideNodes = nodes.filter((node) => !node.id.startsWith('logic'))

    return slideNodes.map((node, index) => {
      return {
        id: node.id,
        type: 'slide',
        hidden: isInViewport(node),
        position: { x: node.posX, y: node.posY },
        data: {
          label: (
            <img
              src={node.contentUrl}
              datakey={node}
              className={'img-in-sidebar'}
              alt="draggable presentation file"
            />
          )
        }
      }
    })
  }

  const isInViewport = (node) => {
    return node.posX !== null || node.posY !== null
  }

  const goToCreateNewWorkFlow = () => {
    navigate('/flowvu/create')
  }

  return (
    <FlowVUContext.Provider
      value={{
        sidebarContent,
        setSidebarContent,
        getSidebarContent,
        initialNodes,
        initialEdges,
        flowvus,
        flowvuName,
        setFlowvuDashboardData,
        updateFlowvuStatus,
        deleteFlowvu,
        setFlowvuData,
        goToCreateNewWorkFlow,
        showEditLogicModal,
        setShowEditLogicModal,
        createFlowvu,
        appendSlidesToExistingFlow,
        saveFlowvu,
        getFlowvuOperation
      }}
    >
      {props.children}
    </FlowVUContext.Provider>
  )
}

FlowVUContextProvider.propTypes = {
  children: PropTypes.object
}
