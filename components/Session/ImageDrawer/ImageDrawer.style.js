import { makeStyles } from '@mui/styles'

export default makeStyles(() => ({
  img: {
    objectFit: 'contain'
  },
  row: {
    display: 'flex',
    alignItems: 'center'
  },
  box: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    border: '1px black solid',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 10,
    marginBottom: 10
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  clear: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'space-around'
  },
  delete: {
    marginLeft: 0,
    width: 100
  },
  download: {
    marginLeft: 0,
    width: 100
  },
  edit: {
    marginLeft: 50,
    width: 100
  },
  send: {
    marginLeft: 50,
    width: 100
  },
  save: {
    marginLeft: 50,
    width: 100
  },
  left: {
    marginTop: 10,
    marginBottom: 10
  },
  input: {
    display: 'none'
  }
}))
