import Head from 'next/head'
import { compose, map, flatten, uniq, prop, groupBy as ramdaGroupBy, evolve, path, keys, merge, pick, append } from 'ramda'
import moment from 'moment'

import GradeIcon from '@material-ui/icons/Grade'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import DotsMenu from 'components/DotsMenu'
import DataPreviewCard from 'components/DataPreviewCard'

import { sort } from 'utils/strings'

import useStyles from './styles/UserQuestionsPreview.styles'

import config from '../config'
import { buildPath } from '../utils/pushQp'

const options = {
  night: moment('00:00:00', config.timeFormat).hour(),
  morning: moment('06:00:00', config.timeFormat).hour(),
  day: moment('12:00:00', config.timeFormat).hour(),
  evening: moment('18:00:00', config.timeFormat).hour(),
}

const groupByTime = (userQuestionnaire) => {
  const { start_time } = userQuestionnaire
  const time = moment(start_time, config.timeFormat).hour()

  if (time >= options.night && time < options.morning) return 'night'
  if (time >= options.morning && time < options.day) return 'morning'
  if (time >= options.day && time < options.evening) return 'day'
  if (time >= options.evening) return 'evening'
}

const groupByType = (question) => path(['question', 'question_type', 'title'])(question)

const UserQuestionsPreview = ({ user, query }) => {
  const classes = useStyles()

  const { avatar_url, defaultAvatar, name, user_questionnaires, uuid } = user
  const { sortBy, sortType, groupBy } = query

  const sortOptionProp = sortBy && sortType
    ? prop(sortBy)
    : prop('title')

  const composition = compose(
    sort(sortOptionProp, sortType || 'asc'),
    uniq,
    flatten,
    map((questionnaire) => compose(
      map((user_question) => ({
        ...pick(['question', 'answer', 'answer_2', 'answer_3'])(user_question),
        is_completed: prop('is_completed', questionnaire)
      })),
      prop('user_questions')
    )(questionnaire))
  )

  const transformations = {
    morning: composition,
    day: composition,
    evening: composition,
    night: composition
  }

  const questions = groupBy
    ? groupBy === 'time'
      ? compose(
        evolve(transformations),
        ramdaGroupBy(groupByTime)
      )(user_questionnaires)
      : ramdaGroupBy(groupByType)(composition(user_questionnaires))
    : composition(user_questionnaires)

  const href = buildPath(null, `/user_questionnaires`)(merge(query, { user_uuid: uuid }))
  const hrefProgress = buildPath(null, `/user/[user_uuid]/progress`)(merge(query, { user_uuid: uuid }))
  const hrefQuestions = buildPath(null, '/user_questions')(merge(query, { user_uuid: uuid }))

  const renderQuestions = (questions) => map(
    ({ question: { title }, answer_3, answer_2, answer, is_completed }) => (
      <Grid key={`${title}-${is_completed}`} item xs={12} sm={6} md={4} lg={3}>
        <DataPreviewCard
          title={title}
          subtitle={!prop('loading', user_questionnaires[0]) &&
            [answer, answer_2, answer_3].filter((el) => !!el).join(',')
          }
          is_completed={is_completed}
        />
      </Grid>
  ))(questions)

  return (
    <>
      <Head>
        <title>Вопросы пользователя</title>
      </Head>
      <div className={classes.container}>
        <div className={classes.block}>
          <div className={classes.rating}>
            <GradeIcon />
            <Typography>13/14 баллов</Typography>
          </div>
          <div className={classes.userInfo}>
            <Avatar alt="avatar" src={avatar_url} className={classes.userAvatar}>
              <Avatar src={defaultAvatar} />
            </Avatar>
            <Typography variant="h6" className={classes.userName}>
              {name}
            </Typography>

            <DotsMenu href={href} hrefProgress={hrefProgress} hrefQuestions={hrefQuestions} marginRight />
          </div>
        </div>
        {!groupBy && (
          <Grid container justifyContent="flex-start" spacing={2}>
            {renderQuestions(questions)}
          </Grid>
        )}

        {groupBy && (
          <Grid container spacing={2}>
            {map((key) => (
              <Grid item xs={12 / keys(questions).length} key={key}>
                <Box mt={2} mb={2}>
                  <Typography variant="h4">{key}</Typography>
                </Box>
                <Grid container justifyContent="flex-start" spacing={2}>
                  {renderQuestions(questions[key])}
                </Grid>
              </Grid>
            ))(keys(questions))}
          </Grid>
        )}
      </div>
    </>
  )
}

export default UserQuestionsPreview
