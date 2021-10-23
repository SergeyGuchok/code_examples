import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  selectWrap: {
    width: '100%',
  },
  wrapper: {
    display: 'flex',
  },
  icon: {
    margin: '0 5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '4px',

    '&:hover': {
      backgroundColor: 'lightgray'
    }
  }
}))
