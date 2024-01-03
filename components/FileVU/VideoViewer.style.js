import { makeStyles } from '@mui/styles'

export default makeStyles(() => ({
  root: {},
  content: {
    padding: '16px'
  },
  line: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  video: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20
  },
  videoplayer: {
    maxWidth: '100%'
  },
  cloudPlayers: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, auto)',
    gridGap: '20px'
  }
}))
