import { flowvuInstance } from '../axiosService'

class FlowVUService {
  async listFlowvus (portalId) {
    return flowvuInstance.get(`/portals/${portalId}`)
  }

  async updateFlowvuStatus (flowvuId, status) {
    return flowvuInstance.patch(`/flowvus/${flowvuId}`, { status })
  }

  async deleteFlowvu (flowvuId) {
    return flowvuInstance.delete(`/flowvus/${flowvuId}`)
  }

  async saveFlowvu (flowvuId, nodes, sidebarContent, edges) {
    const logicNodes = nodes.filter((node) => node.id.startsWith('logic'))
    const formattedLogicNodes = this.formatLogicNodes(logicNodes, flowvuId)

    const formattedSlideNodes = this.formatSlideNodes(sidebarContent, flowvuId)

    const formattedEdges = this.formatEdges(edges, flowvuId)
    const result = await flowvuInstance.put(`/flowvus/${flowvuId}`, {
      logicNodes: formattedLogicNodes,
      slideNodes: formattedSlideNodes,
      edges: formattedEdges
    })
    return result
  }

  formatLogicNodes (logicNodes, flowvuId) {
    const formattedLogicNodes = []
    for (const node of logicNodes) {
      formattedLogicNodes.push({
        id: node.id,
        nodeType: 'logic',
        startNode: node.startNode,
        posX: Math.round(node.position.x * 100) / 100,
        posY: Math.round(node.position.y * 100) / 100,
        displayText: node.data.label.props.label,
        flowvuId
      })
    }
    return formattedLogicNodes
  }

  formatSlideNodes (slideNodes, flowvuId) {
    const formattedSlideNodes = []
    for (const node of slideNodes) {
      const contentUrl = node.data.label.props.src.startsWith('https')
        ? this.getTrimmedContentUrl(node.data.label.props.src)
        : node.data.label.props.src
      const formattedPosX = node.position?.x
        ? Math.round(node.position.x * 100) / 100
        : null
      const formattedPosY = node.position?.y
        ? Math.round(node.position.y * 100) / 100
        : null

      formattedSlideNodes.push({
        id: node.id,
        nodeType: 'slide',
        startNode: false,
        contentUrl,
        posX: formattedPosX,
        posY: formattedPosY,
        flowvuId
      })
    }
    return formattedSlideNodes
  }

  getTrimmedContentUrl = (fullUrl) => {
    const prefixEnding = fullUrl.indexOf('static/')
    const suffixBeginning = fullUrl.indexOf('.png')
    return fullUrl.slice(prefixEnding, suffixBeginning + '.png'.length)
  }

  formatEdges (edges, flowvuId) {
    const formattedEdges = []
    for (const edge of edges) {
      formattedEdges.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        flowvuId
      })
    }
    return formattedEdges
  }

  async getFlowvuOperation (flowvuOperationId) {
    return await flowvuInstance.get(
      `/flowvus/flowvuoperations/${flowvuOperationId}`
    )
  }

  async createFlowvu (data) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return flowvuInstance.post('/flowvus/create', data, config)
  }

  async getFlowvu (flowId) {
    return flowvuInstance.get(`/flowvus/${flowId}`)
  }

  async appendSlidesToExistingFlow (data) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return flowvuInstance.patch('/flowvus/append', data, config)
  }
}

export default new FlowVUService()
