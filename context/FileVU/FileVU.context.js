import React, { useState, createContext } from 'react'
import FileVUService from '../../services/FileVU/FileVU.service'
import PropTypes from 'prop-types'
import { trackEvent } from '../../utils/functions'

export const FileVUContext = createContext()

export const FileVUContextProvider = (props) => {
  const [allFiles, setAllFiles] = useState({})

  const sortbyDate = (a, b) => {
    return new Date(b.LastModified) - new Date(a.LastModified)
  }

  const fetchFiles = async (portalName) => {
    try {
      const res = await FileVUService.fetchFiles(portalName)

      const keys = res.data.Contents
      keys?.sort(sortbyDate)
      const objects = {}
      keys?.forEach((key) => {
        const items = key.Key.split('/')
        if (items.length > 1) {
          if (items[0] in objects) {
            objects[items[0]].push(key)
          } else {
            objects[items[0]] = [key]
          }
        }
      })
      setAllFiles(objects)
    } catch (error) {
      console.log(error)
    }
  }
  const viewFile = async (portalName, key) => {
    try {
      trackEvent('Viewed Recorded Video')
      return await FileVUService.viewFile(portalName, key)
    } catch (error) {
      console.log(error)
    }
  }

  const viewFileById = async (portalName, id) => {
    try {
      trackEvent('Viewed Recorded Video')
      return await FileVUService.viewFileById(portalName, id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <FileVUContext.Provider
      value={{ allFiles, fetchFiles, viewFile, viewFileById }}
    >
      {props.children}
    </FileVUContext.Provider>
  )
}

FileVUContextProvider.propTypes = {
  children: PropTypes.object
}
