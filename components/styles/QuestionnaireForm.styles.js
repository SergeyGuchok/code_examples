import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  table: {
    '& .MuiTableCell-root': {
      borderBottom: 'none',
      padding: '6px',

      [theme.breakpoints.down('sm')]: {
        padding: '6px 0px',
      },
    },
  },
  questionCell: {
    width: '100%',
    minWidth: '220px',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
}))
