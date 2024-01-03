import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const ReportsContext = createContext()

export const ReportsContextProvider = (props) => {
  const [inboundAudio, setInboundAudio] = useState(null)
  const [outboundAudio, setoutboundAudio] = useState(null)
  const [inboundVideo, setInboundVideo] = useState(null)
  const [outboundVideo, setOutboundVideo] = useState(null)

  return (
    <ReportsContext.Provider
      value={{
        inboundAudio,
        setInboundAudio,
        outboundAudio,
        setoutboundAudio,
        inboundVideo,
        setInboundVideo,
        outboundVideo,
        setOutboundVideo
      }}
    >
      {props.children}
    </ReportsContext.Provider>
  )
}

ReportsContextProvider.propTypes = {
  children: PropTypes.array
}
