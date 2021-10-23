import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: '15px',
    height: '100vh',
    backgroundColor: 'white',
    overflowY: 'auto'
  },

  title: {
    display: 'flex',
    justifyContent: 'center',
  },

  wrapper: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 800,
  },

  users: {
    margin: '15px 0',
  },

  addUser: {
    margin: '15px 0',
  },

  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '15px 0',
  },

  user: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },

  roleInput: {
    margin: '0 10px',
  }
}))
