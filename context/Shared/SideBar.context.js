import React, { useState, useEffect, createContext } from 'react'
import { useLocation } from 'react-router-dom'
import { pathNameMap } from '../../utils/constants'
import PropTypes from 'prop-types'
import { theme } from '../../styles/theme.style'

export const SideBarContext = createContext()

export const SideBarContextProvider = (props) => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const [sideBarVisibility, setSideBarVisibility] = useState(true)
  const [viewPort, setViewPort] = useState('')
  const [isPortrait, setIsPortrait] = useState(width > height)
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const location = useLocation()

  const handleWindowResize = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  useEffect(() => {
    if (width > theme.SCREEN_XLG) {
      setViewPort('xl')
    } else if (width > theme.SCREEN_LG) {
      setViewPort('lg')
    } else if (width > theme.SCREEN_MD) {
      setViewPort('md')
    } else if (width > theme.SCREEN_SM) {
      setViewPort('sm')
    } else {
      setViewPort('xs')
    }
    width < theme.SCREEN_LG
      ? setIsTabletOrMobile(true)
      : setIsTabletOrMobile(false)
    width < theme.SCREEN_SM ? setIsMobile(true) : setIsMobile(false)
    setIsPortrait(width > height)
  }, [width, height])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  useEffect(() => {
    handleWindowResize()
  }, [viewPort, isPortrait, location.pathname])

  useEffect(() => {
    if (pathNameMap[location.pathname] === theme.SESSION) {
      setSideBarVisibility(false)
    } else {
      if (isTabletOrMobile) {
        setSideBarVisibility(false)
      } else {
        setSideBarVisibility(true)
      }
    }
  }, [location.pathname, isTabletOrMobile, location.key])

  return (
    <SideBarContext.Provider
      value={{
        sideBarVisibility,
        setSideBarVisibility,
        viewPort,
        isPortrait,
        isTabletOrMobile,
        isMobile
      }}
    >
      {props.children}
    </SideBarContext.Provider>
  )
}

SideBarContextProvider.propTypes = {
  children: PropTypes.array
}
