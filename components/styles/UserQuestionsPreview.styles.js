import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  container: {
    padding: '16px 16px 40px 16px',
  },
  block: {
    margin: 'auto auto 20px auto',
  },
  userName: {
    fontSize: '1.1rem',
    fontWeight: 600,
    lineHeight: 'normal',
  },
  userAvatar: {
    backgroundColor: 'transparent',
    marginRight: 16,
  },
  flexColumn: {
    display: 'flex',
    margin: '10px 0'
  },
  badgeElement: {
    border: '1px solid grey',
    boxSizing: 'border-box',
    margin: '5px',
    cursor: 'pointer',
    '& .MuiBadge-anchorOriginTopLeftRectangle': {
      left: 15,
    },
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    margin: '20px 0',

    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
    },

    '& .MuiSvgIcon-root': {
      marginRight: 4,
    },
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',

    paddingRight: '8px',
  },
}))
