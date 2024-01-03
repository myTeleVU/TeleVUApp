import React, { useState, useContext, useEffect } from 'react'
import CloudBrowser from '../../components/FileVU/CloudBrowser/CloudBrowser.component'
import VideoViewer from '../../components/FileVU/VideoViewer/VideoViewer.component'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import { CurrentPortalContext } from '../../context/Shared/CurrentPortal.context'
import { FileVUContext } from '../../context/FileVU/FileVU.context'
import { useSearchParams } from 'react-router-dom'

const FileVU = () => {
  const [video, setVideo] = useState(false)
  const [fileKey, setFileKey] = useState('')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const { viewFile, allFiles, fetchFiles, viewFileById } =
    useContext(FileVUContext)
  const { portal } = useContext(CurrentPortalContext)
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()
  const [videoId, setVideoId] = useState(null)

  const getUrl = async (key) => {
    try {
      const response = await viewFile(portal.name, key)
      setFileKey(key)
      setUrl(response.data.url)
      setNote(response.data.note)
      setVideo(true)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (portal.name) {
      fetchFiles(portal.name)
    }
  }, [portal.name, video])

  const viewVideo = () => {
    const foundVideoId = searchParams.get('video_id')
    if (foundVideoId) {
      setVideoId(foundVideoId)
      // searchParams.delete('video_id')
      // setSearchParams(searchParams)
    }
  }

  useEffect(() => {
    viewVideo()
  }, [])

  const getUrlById = async (videoId) => {
    try {
      const response = await viewFileById(portal.name, videoId)
      setUrl(response.data.url)
      setVideo(true)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (videoId) {
      getUrlById(videoId)
    }
  }, [videoId])

  return (
    <>
      <TopBar />
      {!video
        ? (
        <CloudBrowser allFiles={allFiles} getUrl={getUrl} />
          )
        : (
        <VideoViewer
          setVideo={setVideo}
          url={url}
          fileKey={fileKey}
          note={note}
        />
          )}
    </>
  )
}

export default FileVU
