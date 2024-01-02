import { makeStyles } from '@mui/styles'

export default makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: 500,
    overflow: 'scroll'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1),
      width: '60ch'
    }
  },
  bottomButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  callButton: {
    borderColor: '#4CAF50',
    color: '#4CAF50',
    '&:hover': {
      backgroundColor: '#4CAF50',
      color: 'white'
    }
  },
  deleteButton: {
    borderColor: '#F50057',
    backgroundColor: '#F50057',
    color: 'white',
    '&:hover': {
      color: '#F50057',
      backgroundColor: 'white'
    }
  }
}))
