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
  bottomButtonsAlone: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  header: {
    fontWeight: 'bold'
  },
  callButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      color: '#4CAF50',
      backgroundColor: 'white'
    }
  },
  phoneIcon: {
    color: '#039be5',
    marginRight: '5px',
    fontSize: 20
  },
  flex: {
    display: 'flex'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  alias: {
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
}))
