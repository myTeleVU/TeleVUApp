import React from 'react'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import useStyles from './AddToCall.style'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useTranslation } from 'react-i18next'
import { MdCancel, MdOutlineCall } from 'react-icons/md'
import { HiPhoneMissedCall } from 'react-icons/hi'
import { getModalStyle } from '../../../utils/functions'
import { BsLink } from 'react-icons/bs'
import PropTypes from 'prop-types'
import './AddToCall.style.scss'
import { theme } from '../../../styles/theme.style'

export default function AddToCall ({
  open,
  handleClose,
  addToCall,
  mySessionId,
  isOnline,
  getToken,
  allDevicesArray,
  title,
  copyLink
}) {
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle)
  const { t } = useTranslation()

  const body = (
    <div style={modalStyle} className="addToCallBody">
      <div className="addToCallBody__topBar">
        <p className="addToCallBody__title">
          {t('Add')} {title}
        </p>
        <div className="addToCallBody__closeContainer">
          <MdCancel
            onClick={handleClose}
            className="addToCallBody__closeButton"
          />
          {t('Close')}
        </div>
      </div>
      <div
        className="addToCallBody__addToContent"
        style={{ height: 250, overflow: 'scroll' }}
      >
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.header}></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allDevicesArray.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <div className={classes.flex}>
                      <div className={classes.flexColumn}>
                        <div>{row.name}</div>
                        <div>
                          {[theme.REMOTEVU, theme.SCREENVU].includes(title) &&
                            row.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {isOnline(row.name) || isOnline(row.email)
                      ? (
                      <Button
                        variant="contained"
                        endIcon={<MdOutlineCall />}
                        className="addToCallBody__callButton"
                        onClick={() => addToCall(getToken(row), mySessionId)}
                      >
                        {t('Add')}
                      </Button>
                        )
                      : (
                      <Button
                        disabled
                        variant="text"
                        endIcon={<HiPhoneMissedCall />}
                      >
                        {t('N/A')}
                      </Button>
                        )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="addToCallBody__bottomBar">
        {title === theme.REMOTEVU
          ? (
          <div
            className="addToCallBody__bottomBar__meetingLink"
            onClick={copyLink}
          >
            <BsLink /> {t('Copy Meeting Link')}
          </div>
            )
          : (
              '&nbsp;'
            )}
      </div>
    </div>
  )

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  )
}

AddToCall.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  online: PropTypes.object,
  addToCall: PropTypes.func,
  mySessionId: PropTypes.string,
  isOnline: PropTypes.func,
  getToken: PropTypes.func,
  allDevicesArray: PropTypes.array,
  title: PropTypes.string,
  copyLink: PropTypes.func
}
