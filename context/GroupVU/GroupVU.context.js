import React from 'react'
import GroupVUService from '../../services/GroupVU/GroupVU.service'
import PropTypes from 'prop-types'

export const GroupVUContext = React.createContext()

export const GroupVUContextProvider = (props) => {
  const [allGroups, setAllGroups] = React.useState([])

  const fetchGroups = (portalName) => {
    GroupVUService.fetchGroups(portalName).then((res) => {
      setAllGroups(res.data)
    })
  }

  const addGroup = async (groupName, portalName, devices, users) => {
    return await GroupVUService.addGroup(groupName, portalName, devices, users)
  }

  const removeGroup = async (groupId) => {
    return await GroupVUService.removeGroup(groupId)
  }

  return (
    <GroupVUContext.Provider
      value={{
        allGroups,
        fetchGroups,
        addGroup,
        removeGroup
      }}
    >
      {props.children}
    </GroupVUContext.Provider>
  )
}

GroupVUContextProvider.propTypes = {
  children: PropTypes.object
}
