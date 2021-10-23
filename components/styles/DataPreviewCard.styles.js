import { makeStyles } from '@material-ui/core/styles'

export default makeStyles((theme) => ({
  headerIcon: {
    marginRight: 8,
  },
  container: {
    backgroundColor: 'transparent',
    width: '100%',
    padding: 0,

    '& .MuiAccordionSummary-root': {
      padding: 8,
    },
    '& .MuiAccordionSummary-content': {
      margin: 0,
      maxWidth: '100%',
    },
    '& .MuiAccordionDetails-root': {
      padding: 0,
      '& > div': {
        margin: 0,
        width: '100%',
      },
    },
  },
}))
