import React, { useEffect, useState, useContext, useCallback } from 'react'
import SideBar from '../components/Shared/SideBar/SideBar.component'
import Socket from '../components/Shared/Socket/Socket.component'
import { useTranslation } from 'react-i18next'
import { pathNameMap } from '../utils/constants'
import IncomingCall from '../components/Shared/IncomingCall/IncomingCall.component'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate, useLocation } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { SideBarContextProvider } from '../context/Shared/SideBar.context'
import { CurrentUserContext } from '../context/Shared/CurrentUser.context'
import { CurrentPortalContext } from '../context/Shared/CurrentPortal.context'
import { trackEvent, getSortedPortals, routify } from '../utils/functions'
import { NotificationContext } from '../context/Shared/Notification.context'
import { theme } from '../styles/theme.style'

// todo: remove incomingcall and incomingaddtocall. One is duplicate.
// todo: move socket functions into socket component

export default function AppRouter () {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const { me, portals } = useContext(CurrentUserContext)
  const [socket, _setSocket] = useState(null)
  const [onlineStatus, _setOnlineStatus] = useState(false)
  const [online, _setOnline] = useState({})
  const [incomingCall, setIncomingCall] = useState(false)
  const [incomingAddToCall, setIncomingAddToCall] = useState(false)
  const [callFrom, setCallFrom] = useState('')
  const { portal, setPortal, currentPortal, handlePortalChange } =
    useContext(CurrentPortalContext)
  const [userBeingCalledId, setUserBeingCalledId] = useState(null)
  const { setSnackBarMessage } = useContext(NotificationContext)

  useEffect(() => {
    if (me != null && currentPortal != null && portals != null) {
      const sortedUserPortals = getSortedPortals(me.portals)
      const allPortals = portals
      const currentPortalId = Number(currentPortal)

      // selected portal by portal id
      const selectedPortal = allPortals.filter(
        (portal) => portal.id === currentPortalId
      )

      // check if user has explicit permission on selected portal
      const foundUserPortal = sortedUserPortals.filter(
        (sortedPortal) => sortedPortal.portalId === currentPortalId
      )

      // if admin, set as super user regardless
      if (me.admin) {
        if (selectedPortal.length > 0) {
          setPortal({
            name: selectedPortal[0].name,
            role: 'Super User',
            hasIseeLicence: true,
            hasFlowVULicence: true,
            id: currentPortalId
          })
        } else {
          setPortal({
            name: sortedUserPortals[0].Portal.name,
            role: 'Super User',
            hasIseeLicence: true,
            hasFlowVULicence: true,
            id: currentPortalId
          })
        }
        return
      }
      // user has explict permission on selected portal
      if (foundUserPortal.length > 0) {
        // portal found
        setPortal({
          name: foundUserPortal[0].Portal.name,
          role: foundUserPortal[0].role,
          hasIseeLicence: foundUserPortal[0].hasIseeLicence,
          hasFlowVULicence: foundUserPortal[0].hasFlowVULicence,
          id: currentPortalId
        })
      } else {
        // was subportal and not directly associated
        if (selectedPortal.length > 0) {
          const mainPortal = sortedUserPortals.filter(
            (sortedPortal) =>
              sortedPortal.portalId === selectedPortal[0].mainPortalId
          )
          if (mainPortal.length > 0) {
            setPortal({
              name: selectedPortal[0].name,
              role: mainPortal[0].role,
              hasIseeLicence: mainPortal[0].hasIseeLicence,
              hasFlowVULicence: mainPortal[0].hasFlowVULicence,
              id: currentPortalId
            })
          }
        } else {
          setPortal({
            name: sortedUserPortals[0].Portal.name,
            role: sortedUserPortals[0].role,
            hasIseeLicence: sortedUserPortals[0].hasIseeLicence,
            hasFlowVULicence: sortedUserPortals[0].hasFlowVULicence,
            id: currentPortalId
          })
        }
      }
    }
  }, [me, portals, currentPortal])

  useEffect(() => {
    return () => {
      disconnectSocket()
    }
  }, [])

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect()
    }
  }

  const setSocket = useCallback(
    (mysocket) => {
      disconnectSocket()
      _setSocket(mysocket)
    },
    [socket]
  )

  const signOut = useCallback(async () => {
    try {
      disconnectSocket()
      navigate('/' + routify(theme.LOGOUT))
    } catch (error) {
      console.error(error)
    }
  }, [socket])

  const acceptCall = useCallback(
    (to) => {
      trackEvent('Call Accepted', {
        portal: portal.name,
        role: portal.role
      })

      const id = uuidv4()
      goToSession(id)
      socket.emit('accept call', {
        id,
        to
      })
    },
    [socket]
  )

  const rejectCall = useCallback(
    (to) => {
      trackEvent('Call Rejected', {
        portal: portal.name,
        role: portal.role
      })

      socket.emit('reject call', {
        to
      })
    },
    [socket]
  )

  const joinCall = useCallback(
    (id) => {
      trackEvent('Call Joined', {
        portal: portal.name,
        role: portal.role
      })

      if (pathNameMap[location.pathname] !== theme.SESSION) {
        setTimeout(() => {
          goToSession(id)
        }, 2000)
      }
    },
    [socket]
  )

  const addRemoteVUToCall = useCallback(
    (to, id) => {
      trackEvent('Add User To Call', {
        portal: portal.name,
        role: portal.role
      })
      setSnackBarMessage(t('Adding user to call'), 'info')
      socket.emit('add to call', {
        id,
        to
      })
    },
    [socket]
  )

  const addGlassVUToCall = useCallback(
    (to, id) => {
      trackEvent('Add Glass To Call', {
        portal: portal.name,
        role: portal.role
      })
      setSnackBarMessage(t('Adding glass to call'), 'info')
      socket.emit('accept call', {
        id,
        to
      })
    },
    [socket]
  )

  const initiateCall = useCallback(
    (to) => {
      trackEvent('Call Initiated', {
        portal: portal.name,
        role: portal.role
      })

      setUserBeingCalledId(to)

      socket.emit('initiate call', {
        to
      })
    },
    [socket]
  )

  const setOnline = useCallback((online) => {
    _setOnline(online)
  }, [])

  const setOnlineStatus = useCallback((onlineStatus) => {
    _setOnlineStatus(onlineStatus)
  }, [])

  const goToSession = useCallback((id) => {
    navigate(`/${routify(theme.SESSION)}/?join_session_id=${id}`)
  }, [])

  const setStatusAsBusy = () => {
    socket?.emit('status busy')
  }

  const setStatusAsFree = () => {
    socket?.emit('status free')
  }

  useEffect(() => {
    if (pathNameMap[location.pathname] !== theme.SESSION) {
      setStatusAsFree()
    } else {
      setStatusAsBusy()
    }
  }, [location.pathname])

  return me && portal.name && portal.role
    ? (
    <>
      <Socket
        socket={socket}
        setSocket={setSocket}
        setOnline={setOnline}
        setOnlineStatus={setOnlineStatus}
        setIncomingCall={setIncomingCall}
        setCallFrom={setCallFrom}
        setIncomingAddToCall={setIncomingAddToCall}
        goToSession={goToSession}
        signOut={signOut}
        pathNameMap={pathNameMap}
        location={location}
        setUserBeingCalledId={setUserBeingCalledId}
      />
      <IncomingCall
        callFrom={callFrom}
        incomingCall={incomingCall}
        setIncomingCall={setIncomingCall}
        acceptCall={acceptCall}
        rejectCall={rejectCall}
        addFlag={false}
      ></IncomingCall>
      <IncomingCall
        callFrom={callFrom}
        incomingCall={incomingAddToCall}
        setIncomingCall={setIncomingAddToCall}
        acceptCall={joinCall}
        rejectCall={rejectCall}
        addFlag={true}
      ></IncomingCall>
      <SideBarContextProvider>
        <SideBar
          onlineStatus={onlineStatus}
          handlePortalChange={handlePortalChange}
          currentPortal={currentPortal}
          signOut={signOut}
        />
        <AppRoutes
          online={online}
          initiateCall={initiateCall}
          userBeingCalledId={userBeingCalledId}
          addRemoteVUToCall={addRemoteVUToCall}
          addGlassVUToCall={addGlassVUToCall}
          signOut={signOut}
          joinCall={joinCall}
          setStatusAsBusy={setStatusAsBusy}
          setStatusAsFree={setStatusAsFree}
        />
      </SideBarContextProvider>
    </>
      )
    : null
}
