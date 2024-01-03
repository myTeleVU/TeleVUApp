import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef
} from 'react'

import { useEdgesState, addEdge, applyNodeChanges } from 'reactflow'
import { useNavigate, useParams } from 'react-router-dom'

import { v4 as uuidv4 } from 'uuid'

import LogicNode from '../../components/FlowVU/LogicNode/LogicNode'
import { FlowVUContext } from '../../context/FlowVU/FlowVU.context'
import { NotificationContext } from '../../context/Shared/Notification.context'
import Flowvu from '../../components/FlowVU/FlowVU/Flowvu'
import { clone } from '../../utils/clone'
import { useTranslation } from 'react-i18next'

const FlowvuContainer = () => {
  const { flowvuId } = useParams()
  const {
    flowvuName,
    initialNodes,
    initialEdges,
    sidebarContent,
    setFlowvuData,
    setSidebarContent,
    showEditLogicModal,
    setShowEditLogicModal,
    saveFlowvu
  } = useContext(FlowVUContext)
  const { setSnackBarMessage } = useContext(NotificationContext)
  const { t } = useTranslation()
  const reactFlowWrapper = useRef(null)
  const [clickedNode, setClickedNode] = useState([])
  const [clickedEdge, setClickedEdge] = useState([])
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [prevActions, updatePrevActions] = useState([])
  const [showAddLogicModal, setShowAddLogicModal] = useState(false)
  const [startNodeSelected, setStartNodeSelected] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setFlowvuData(flowvuId)
  }, [flowvuId])

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes])

  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges])

  const goBack = () => {
    navigate('/flowvu')
  }

  const handleSave = async (flowvuId, nodes, sidebarContent, edges) => {
    setSaving(true)
    await saveFlowvu(flowvuId, nodes, sidebarContent, edges)
    setSaving(false)
    setSnackBarMessage('FlowVU saved!')
  }

  const onNodesChange = (changes) => {
    if (changes[0].type === 'position' && changes[0].dragging === true) {
      const movingNode = nodes.find((node) => node.id === changes[0].id)
      const newAction = {
        reverse: undoMoveNode,
        params: {
          dragging: true,
          id: changes[0].id,
          position: movingNode.position,
          positionAbsolute: movingNode.position,
          type: 'position'
        }
      }
      updatePrevActions((prevActions) => [...prevActions, newAction])
      if (!movingNode.id.startsWith('logic')) {
        const nodeInSidebar = sidebarContent.find(
          (node) => node.id === movingNode.id
        )
        nodeInSidebar.position = movingNode.position
      }
    }

    setNodes((nds) => applyNodeChanges(changes, nds))
  }

  const onEditLogicFormSubmit = (event, newNodeText) => {
    event.preventDefault()

    const newNode = {
      id: clickedNode[0].id,
      type: 'default',
      position: clickedNode[0].position,
      data: {
        label: (
          <LogicNode
            label={newNodeText}
            onClickHandler={() => {
              setShowEditLogicModal(true)
            }}
          />
        )
      }
    }
    const newAction = {
      reverse: undoEditLogicNode,
      params: {
        newNode,
        oldName: clickedNode[0].data.label.props.label
      }
    }
    updatePrevActions((prevActions) => [...prevActions, newAction])
    setNodes(nodes.filter((node) => node.id !== clickedNode[0].id))
    setNodes((nodes) => [...nodes, newNode])
  }

  const addLogicNodes = (event, count) => {
    event.preventDefault()
    const form = event.target
    for (let i = 0; i < count; i++) {
      const logicData = {
        elementText: form.elements[i].value,
        elementType: 'logic',
        offset: i
      }
      addSingleLogicNode(event, logicData)
    }
  }

  const addSingleLogicNode = (event, logicData) => {
    event.preventDefault()

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
    const position = reactFlowInstance.project({
      x: reactFlowBounds.left + logicData.offset * 150,
      y: reactFlowBounds.top
    })
    const newNode = {
      id: 'logic_' + uuidv4(),
      type: 'default',
      position,
      data: {
        label: (
          <LogicNode
            label={logicData.elementText}
            onClickHandler={() => {
              setShowEditLogicModal(true)
            }}
          />
        )
      }
    }
    const newAction = {
      reverse: undoAddNode,
      params: newNode
    }
    updatePrevActions((prevActions) => [...prevActions, newAction])
    setNodes((nodes) => [...nodes, newNode])
    setClickedNode([])
  }

  const onConnect = useCallback((params) => {
    if (!(params.source.startsWith('logic') && params.target.startsWith('logic'))) {
      setEdges((eds) => addEdge(params, eds))
      const newAction = {
        reverse: undoAddEdge,
        params: [params]
      }
      updatePrevActions((prevActions) => [...prevActions, newAction])
    } else {
      setSnackBarMessage(
        t('Decision node cannot be connected to another decision node')
        , 'error')
    }
  }, [])

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      let type, element, item, itemId, itemLabel, newNode
      if (event && event.dataTransfer) {
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top
        })
        type =
          event &&
          event.dataTransfer &&
          event.dataTransfer.getData('application/reactflow')
        element = JSON.parse(event.dataTransfer.getData('text/plain'))
        if (element.elementType === 'slide') {
          item = sidebarContent[element.elementIndex]
          itemId = item.id
          itemLabel = item.data.label
        }
        newNode = {
          id: item.id,
          type,
          position,
          data: { label: itemLabel }
        }
        const newAction = { reverse: undoAddNode, params: newNode }
        updatePrevActions((prevActions) => [...prevActions, newAction])
        setNodes((nds) => nds.concat(newNode))

        const hiddenPPT = sidebarContent.find((slide) => slide.id === itemId)
        hiddenPPT.hidden = true
        hiddenPPT.position = position
      }
    },
    [reactFlowInstance, sidebarContent]
  )
  /** operation to perform when a node is clicked within the workflow canvas */
  const onClickNode = useCallback((event, node) => {
    // Set the clicked element in local state
    setStartNodeSelected(node.startNode)
    setClickedNode([node])
    setClickedEdge([])
  }, [])

  const onClickEdge = useCallback((event, edge) => {
    setStartNodeSelected(false)

    setClickedEdge([edge])
    setClickedNode([])
  }, [])

  /** operation to perform when a node is deleted from the workflow canvas */
  const onNodesDelete = useCallback(
    (nodeToRemove) => {
      if (nodeToRemove.length === 0 || nodeToRemove[0].startNode === true) {
        return
      }
      const item = nodeToRemove[0]
      if (item.data.label.type === 'img') {
        const itemInSidebar = sidebarContent.find((obj) => {
          return obj.id === item.id
        })
        itemInSidebar.hidden = false
        itemInSidebar.position = null
        itemInSidebar.positionAbsolute = null
        setSidebarContent(sidebarContent)
      }
      const sourceEdges = edges.filter((e) => e.source === item.id)
      const targetEdges = edges.filter((e) => e.target === item.id)
      const deepCopy = clone(item)
      const newAction = {
        reverse: undoDeleteNode,
        params: {
          item: deepCopy,
          edges: sourceEdges.concat(targetEdges)
        }
      }
      item.position.x = null
      item.position.y = null
      updatePrevActions((prevActions) => [...prevActions, newAction])
      setNodes(nodes.filter((n) => n.id !== item.id))
      setEdges(
        edges.filter((e) => e.source !== item.id && e.target !== item.id)
      )
      setClickedNode([])
    },
    [edges, nodes, setEdges, setNodes]
  )

  const onEdgesDelete = useCallback((edgeToRemove) => {
    const item = (edgeToRemove.length && edgeToRemove[0]) || null
    setEdges(edges.filter((e) => e.source !== item.source))
    const newAction = {
      reverse: undoDeleteEdge,
      params: item
    }
    updatePrevActions((prevActions) => [...prevActions, newAction])
    setClickedEdge([])
  })

  /** called when "Delete" icon is pressed from the Controls on the workflow canvas */
  const onClickDelete = useCallback(() => {
    if (clickedNode.length > 0) {
      onNodesDelete([...clickedNode])
    }
    if (clickedEdge.length > 0) {
      onEdgesDelete([...clickedEdge])
    }
  }, [clickedNode, clickedEdge, onNodesDelete, onEdgesDelete])
  /** called when "Copy" icon is pressed from the Controls on the workflow canvas */
  const onClickElementCopy = () => {
    if (clickedNode.length === 0 || clickedNode[0].startNode === true) {
      return
    }
    const item = clickedNode[0]
    if (!item.id.startsWith('logic')) {
      const index = sidebarContent.findIndex((slide) => slide.id === item.id)
      const newItem = {
        id: uuidv4(),
        type: 'slide',
        hidden: false,
        position: {
          x: null,
          y: null
        },
        data: {
          label: (
            <img
              src={item.data.label.props.src}
              datakey={item.data.label.props.datakey}
              className={'img-in-sidebar'}
              alt="draggable presentation file"
            />
          )
        }
      }
      sidebarContent.splice(index, 0, newItem)
      // need to do this to trigger a re-render
      const newSidebarContent = sidebarContent.slice()
      setSidebarContent(newSidebarContent)

      const newAction = {
        reverse: undoCopyNode,
        params: newItem
      }
      updatePrevActions((prevActions) => [...prevActions, newAction])
    }
  }

  const undo = () => {
    if (prevActions.length === 0) {
      return
    }
    const actionToUndo = prevActions.pop()
    actionToUndo.reverse(actionToUndo.params)
    updatePrevActions(prevActions)
  }

  const undoAddEdge = (params) => {
    onEdgesDelete(params)
  }

  const undoDeleteEdge = (params) => {
    const newEdge = {
      source: params.source,
      sourceHandle: params.sourceHandle,
      target: params.target,
      targetHandle: params.targetHandle
    }
    onConnect(newEdge)
  }

  const undoDeleteNode = (params) => {
    const newNode = {
      id: params.item.id,
      type: params.item.type,
      position: params.item.position,
      data: params.item.data
    }
    setNodes((nds) => nds.concat(newNode))
    if (!params.item.id.startsWith('logic_')) {
      const slideToHide = sidebarContent.find(
        (node) => node.id === params.item.id
      )
      slideToHide.hidden = true
      setSidebarContent(sidebarContent)
    }

    params.edges.forEach((edge) => {
      undoDeleteEdge(edge)
    })
  }

  const undoAddNode = (params) => {
    onNodesDelete([params])
  }

  const undoCopyNode = (params) => {
    const index = sidebarContent.findIndex((slide) => slide.id === params.id)
    sidebarContent.splice(index, 1)
    // need to do this to trigger a re-render
    const newSidebarContent = sidebarContent.slice()
    setSidebarContent(newSidebarContent)
  }

  const undoMoveNode = (params) => {
    setNodes((nds) => applyNodeChanges([params], nds))
  }

  const undoEditLogicNode = (params) => {
    const newNode = {
      id: params.newNode.id,
      type: 'default',
      position: params.newNode.position,
      data: {
        label: (
          <LogicNode
            label={params.oldName}
            onClickHandler={() => {
              setShowEditLogicModal(true)
            }}
          />
        )
      }
    }
    setNodes(nodes.filter((node) => node.id !== params.newNode.id))
    setNodes((nodes) => [...nodes, newNode])
  }

  const handleKeyPress = useCallback(
    (event) => {
      if (event.ctrlKey === true && event.key === 'z') {
        undo()
      }
    },
    [prevActions]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <Flowvu
      saving={saving}
      startNodeSelected={startNodeSelected}
      flowvuName={flowvuName}
      flowvuId={flowvuId}
      sidebarContent={sidebarContent}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodesDelete={onNodesDelete}
      onEdgesDelete={onEdgesDelete}
      setReactFlowInstance={setReactFlowInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClickNode={onClickNode}
      onClickEdge={onClickEdge}
      onClickElementCopy={onClickElementCopy}
      onClickDelete={onClickDelete}
      goBack={goBack}
      undo={undo}
      reactFlowWrapper={reactFlowWrapper}
      setShowAddLogicModal={setShowAddLogicModal}
      showAddLogicModal={showAddLogicModal}
      addLogicNodes={addLogicNodes}
      showEditLogicModal={showEditLogicModal}
      setShowEditLogicModal={setShowEditLogicModal}
      onEditLogicFormSubmit={onEditLogicFormSubmit}
      clickedNode={clickedNode}
      handleSave={handleSave}
    />
  )
}
export default FlowvuContainer
