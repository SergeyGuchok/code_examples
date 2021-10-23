import { useEffect } from 'react'
import Link from 'next/link'
import { Card, Grid, CardContent, CardActions, Button, Typography } from '@material-ui/core'
import useQuery from 'hooks/useQuery'
import { queryQuestionnaires } from 'gql/queries'
import { compose } from 'ramda'
import withDashboardNavbar from 'hocs/withDashboardNavbar'
import withPageRouter from 'hocs/withPageRouter'
import withCurrentUser from 'hocs/withCurrentUser'
import withUserGroup from 'hocs/withUserGroup'

const Questionnaires = ({ query }) => {
  const [
    getQuestionnaires,
    {
      data: { questionnaires },
    },
  ] = useQuery(queryQuestionnaires)

  useEffect(() => {
    getQuestionnaires()
  }, [])

  return (
    <Grid container spacing={3} direction="row" justifyContent="center" alignItems="center">
      {questionnaires.map((q, k) => (
        <Grid item key={k} xs={3} spacing={3}>
          <Card>
            <CardContent>
              <Typography>{q.title}</Typography>
            </CardContent>
            <CardActions>
              <Button>
                <Link href={`/questionnaire/build/${q.id}`}>Перейти на опросник</Link>
              </Button>
              <Button>
                <Link href={`/user_questionnaire/build/${q.id}`}>Привязать к пользователю</Link>
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default compose(withPageRouter, withCurrentUser, withUserGroup, withDashboardNavbar)(Questionnaires)
