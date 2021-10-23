import Head from 'next/head'
import { compose, map, prop, find } from 'ramda'

import withCurrentUser from 'hocs/withCurrentUser'
import withDashboardNavbar from 'hocs/withDashboardNavbar'
import withDates from 'hocs/withDates'
import withQueryParams from 'hocs/withQueryParams'
import withQuestionnaires from 'hocs/withQuestionnaires'
import withPageRouter from 'hocs/withPageRouter'
import withUserGroup from 'hocs/withUserGroup'
import withUsers from 'hocs/withUsers'

import Assignment from '@material-ui/icons/Assignment'

import Filters from 'containers/Filters'

import UserQuestionsPreview from 'components/UserQuestionsPreview'

import { dateFilters, dateKeys, questionnaireKeys, userKeys } from 'utils/filters'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import CreateOrUpdateUserSubscription from '../../containers/CreateOrUpdateUserSubscription'
import Dialog from '@material-ui/core/Dialog'
import { useCallback, useState } from 'react'
import AddIcon from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'
import { makeStyles } from '@material-ui/core/styles'

const UserQuestions = ({
  query,
  router,
  activeUsers,
  questionnairesFilter = [],
  currentUserGroup,
  currentUser,
  onChangeFromDate,
  onChangeToDate,
}) => {
  const classes = useStyles()

  const [state, setState] = useState({
    isModalOpen: false,
  })

  const handleModalOpen = useCallback(() => {
    setState({
      ...state,
      isModalOpen: true,
    })
  }, [state, setState])

  const handleModalClose = useCallback(() => {
    setState({
      ...state,
      isModalOpen: false,
    })
  }, [state, setState])

  const handleAfterSubmit = useCallback(() => {
    handleModalClose()
  }, [handleModalClose])

  const { user_uuid } = query
  const { isModalOpen } = state

  const filters = [
    {
      qps: questionnairesFilter,
      values: prop('questionnaire_id'),
      icon: <Assignment />,
    },
    ...dateFilters,
  ]

  const user = user_uuid ? find(({ uuid }) => uuid === user_uuid)(activeUsers) : null

  const users = user
    ? [user]
    : activeUsers || []

  return (
    <>
      <Head>
        <title>Вопросы</title>
      </Head>
      <Filters
        sortItems={[
          { name: 'id', title: 'Айди вопроса' },
          { name: 'title', title: 'Название вопроса' },
        ]}
        groupItems={[
          { name: 'time', title: 'Время' },
          { name: 'type', title: 'Тип' }
        ]}
        router={router}
        currentUser={currentUser}
        onChangeFromDate={onChangeFromDate}
        onChangeToDate={onChangeToDate}
        questionnairesFilter={questionnairesFilter}
        activeUsers={activeUsers}
        query={query}
        currentUserGroup={currentUserGroup}
        filters={filters}
        filterKeys={[...questionnaireKeys, ...dateKeys, ...userKeys]}
        filtersToShow={['date_time', 'questionnaires', 'user_group', 'users', 'clients']}
      />

      <Fab
        color="primary"
        aria-label="add"
        size="medium"
        className={classes.addFormButton}
        onClick={handleModalOpen}
      >
        <AddIcon />
      </Fab>

      {map(
        (user) => (
          <UserQuestionsPreview
            key={`user-${user.id}`}
            user={user}
            query={query}
            isGrouped
          />
        )
      )(users)}

      <Dialog fullScreen open={isModalOpen} onClose={handleModalClose}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleModalClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" style={{ marginLeft: 16 }}>
              Подписки
            </Typography>
          </Toolbar>
        </AppBar>

        <CreateOrUpdateUserSubscription
          users={users}
          currentUserId={prop('id', currentUser)}
          group={currentUserGroup}
          onAfterSubmit={handleAfterSubmit}
        />
      </Dialog>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  addFormButton: {
    position: 'fixed',
    right: 20,
    bottom: 20,
    zIndex: 2,
  },
}))

export default compose(
  withPageRouter,
  withCurrentUser,
  withUsers,
  withUserGroup,
  withDates,
  withQueryParams(['user_uuid'], ['week:current']),
  withDashboardNavbar,
  withQuestionnaires('Все вопросы')
)(UserQuestions)
