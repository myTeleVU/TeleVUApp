import React, { Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { SideBarContext } from '../context/Shared/SideBar.context'
import { FlowVUContextProvider } from '../context/FlowVU/FlowVU.context'
import { FileVUContextProvider } from '../context/FileVU/FileVU.context'
import { SignOut } from '../pages/SignOut/SignOut.page'
import PropTypes from 'prop-types'
import './AppRouter.style.scss'
import { theme } from '../styles/theme.style'
import { routify } from '../utils/functions'

const HomeVU = lazy(() => import('../pages/HomeVU/HomeVU.page'))
const GlassVU = lazy(() => import('../pages/GlassVU/GlassVU.page'))
const RemoteVU = lazy(() => import('../pages/RemoteVU/RemoteVU.page'))
const ScreenVU = lazy(() => import('../pages/ScreenVU/ScreenVU.page'))
const CamVU = lazy(() => import('../pages/CamVU/CamVU.page'))
const GroupVU = lazy(() => import('../pages/GroupVU/GroupVU.page'))
const FileVU = lazy(() => import('../pages/FileVU/FileVU.page'))
const ReportVU = lazy(() => import('../pages/ReportVU/ReportVU.page'))
const SettingsPage = lazy(() => import('../pages/Settings/Settings.page'))
const PortalVU = lazy(() => import('../pages/PortalVU/PortalVU.page'))
const Session = lazy(() => import('../pages/Session/Session.page'))
const FlowvuDashboard = lazy(() =>
  import('../pages/FlowVU/FlowvuDashboard.page')
)
const Flowvu = lazy(() => import('../pages/FlowVU/FlowvuContainer.page.js'))
const CreateFlowvu = lazy(() => import('../pages/FlowVU/CreateFlowvu.page'))

const AppRoutes = ({
  online,
  initiateCall,
  addRemoteVUToCall,
  openSnackBar,
  addGlassVUToCall,
  userBeingCalledId,
  joinCall
}) => {
  const isRTL = document.body.dir === 'rtl'
  const { sideBarVisibility } = React.useContext(SideBarContext)
  return (
    <div
      className={
        sideBarVisibility
          ? isRTL
            ? 'routesContainerSidebarRight'
            : 'routesContainerSideBarLeft'
          : 'routesContainer'
      }
    >
      <Routes>
        <Route
          path="/"
          exact
          element={<Navigate replace to={routify(theme.HOMEVU)} />}
        ></Route>
        <Route
          path={'/' + routify(theme.HOMEVU)}
          element={
            <Suspense fallback={<>...</>}>
              <HomeVU onlineUsers={online} initiateCall={initiateCall} />
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.GLASSVU)}
          element={
            <Suspense fallback={<>...</>}>
              <GlassVU
                online={online}
                initiateCall={initiateCall}
                userBeingCalledId={userBeingCalledId}
              />
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.REMOTEVU)}
          element={
            <Suspense fallback={<>...</>}>
              <RemoteVU
                online={online}
                initiateCall={initiateCall}
                userBeingCalledId={userBeingCalledId}
              />
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.SCREENVU)}
          element={
            <Suspense fallback={<>...</>}>
              <ScreenVU
                online={online}
                initiateCall={initiateCall}
                userBeingCalledId={userBeingCalledId}
              />
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.CAMVU)}
          element={
            <Suspense fallback={<>...</>}>
              <CamVU online={online} />
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.GROUPVU)}
          element={
            <Suspense fallback={<>...</>}>
              <GroupVU
                online={online}
                userBeingCalledId={userBeingCalledId}
                joinCall={joinCall}
                addGlassVUToCall={addGlassVUToCall}
                addRemoteVUToCall={addRemoteVUToCall}
              />
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.FILEVU)}
          element={
            <Suspense fallback={<>...</>}>
              <FileVUContextProvider>
                <FileVU />
              </FileVUContextProvider>
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.REPORTVU)}
          element={
            <Suspense fallback={<>...</>}>
              <ReportVU />
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.PORTALVU)}
          element={
            <Suspense fallback={<>...</>}>
              <PortalVU />
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.FLOWVU)}
          exact
          element={
            <Suspense fallback={<>...</>}>
              <FlowVUContextProvider>
                <FlowvuDashboard />
              </FlowVUContextProvider>
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.FLOWVU) + '/create'}
          exact
          element={
            <Suspense fallback={<>...</>}>
              <FlowVUContextProvider>
                <CreateFlowvu />
              </FlowVUContextProvider>
            </Suspense>
          }
        />
        <Route
          path="/flowvu/:flowvuId"
          element={
            <Suspense fallback={<>...</>}>
              <FlowVUContextProvider>
                <Flowvu />
              </FlowVUContextProvider>
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.SETTINGS)}
          element={
            <Suspense fallback={<>...</>}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route
          path={'/' + routify(theme.SESSION)}
          element={
            <Suspense fallback={<>...</>}>
              <Session
                online={online}
                addRemoteVUToCall={addRemoteVUToCall}
                openSnackBar={openSnackBar}
                addGlassVUToCall={addGlassVUToCall}
              />
            </Suspense>
          }
        />
        <Route path={'/' + theme.LOGOUT} exact element={<SignOut />}></Route>
      </Routes>
    </div>
  )
}

AppRoutes.propTypes = {
  online: PropTypes.object,
  initiateCall: PropTypes.func,
  addRemoteVUToCall: PropTypes.func,
  openSnackBar: PropTypes.func,
  addGlassVUToCall: PropTypes.func,
  userBeingCalledId: PropTypes.string,
  joinCall: PropTypes.func
}

export default React.memo(AppRoutes)
