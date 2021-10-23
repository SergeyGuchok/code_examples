import { useState, useCallback } from 'react'

import Head from 'next/head'
import { compose, prop, map } from 'ramda'

import { dateFilters, questionnaireKeys, dateKeys, userKeys } from 'utils/filters'

import CreateOrUpdateUserSubscription from 'containers/CreateOrUpdateUserSubscription'
import Filters from 'containers/Filters'
import UserQuestionnairesList from 'containers/UserQuestionnairesList'

import Fab from '@material-ui/core/Fab'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import Assignment from '@material-ui/icons/Assignment'
import AppsIcon from '@material-ui/icons/Apps'
import ListIcon from '@material-ui/icons/List'
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter'
import HeightIcon from '@material-ui/icons/Height'

import withDashboardNavbar from 'hocs/withDashboardNavbar'
import withPageRouter from 'hocs/withPageRouter'
import withCurrentUser from 'hocs/withCurrentUser'
import withQueryParams from 'hocs/withQueryParams'
import withQuestionnaires from 'hocs/withQuestionnaires'
import withDates from 'hocs/withDates'
import withUserGroup from 'hocs/withUserGroup'
import withUsers from 'hocs/withUsers'

import { makeStyles } from '@material-ui/core/styles'

const Questionnaires = ({
  query,
  currentUserGroup,
  currentUser,
  activeUsers,
  questionnairesFilter,
  router,
  onChangeFromDate,
  onChangeToDate,
}) => {
  const classes = useStyles()
  const { user_uuid } = query
  const [state, setState] = useState({
    isModalOpen: false,
    isExpanded: false,
    isShowGrid: false,
  })

  const users =
    user_uuid && !prop('loading', activeUsers[0]) ? activeUsers.filter(({ uuid }) => uuid === user_uuid) : activeUsers

  const handleModalClose = useCallback(() => {
    setState({
      ...state,
      isModalOpen: false,
    })
  }, [state, setState])

  const handleModalOpen = useCallback(() => {
    setState({
      ...state,
      isModalOpen: true,
    })
  }, [state, setState])

  const handleAfterSubmit = useCallback(() => {
    handleModalClose()
  }, [handleModalClose])

  const handleSetShowGrid = useCallback(() => {
    setState({
      ...state,
      isShowGrid: true,
    })
  }, [state, setState])

  const handleSetShowDefault = useCallback(() => {
    setState({
      ...state,
      isShowGrid: false,
    })
  }, [state, setState])

  const handleExpandList = useCallback(() => {
    setState(({ isExpanded }) => ({
      ...state,
      isExpanded: !isExpanded,
    }))
  }, [state, setState])

  const { isModalOpen, isExpanded, isShowGrid } = state

  const filters = [
    {
      qps: questionnairesFilter,
      values: prop('questionnaire_id'),
      icon: <Assignment />,
    },
    ...dateFilters,
  ]

  return (
    <>
      <Head>
        <title>Опросники</title>
      </Head>
      <Filters
        sortItems={[
          { name: 'id', title: 'Айди опросника' },
          { name: 'title', title: 'Название опросника' },
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
      <Fab color="primary" aria-label="add" size="medium" className={classes.addFormButton} onClick={handleModalOpen}>
        <AddIcon />
      </Fab>

      <div className={classes.block}>
        <div className={classes.userOptions}>
          <div className={classes.controls}>
            <ButtonGroup variant="text" ria-label="text button group">
              <IconButton aria-label="grid" onClick={handleSetShowGrid} color={isShowGrid ? 'primary' : 'default'}>
                <AppsIcon />
              </IconButton>
              <IconButton aria-label="list" onClick={handleSetShowDefault} color={isShowGrid ? 'default' : 'primary'}>
                <ListIcon />
              </IconButton>
            </ButtonGroup>
            {!isShowGrid && (
              <IconButton onClick={handleExpandList} aria-controls="expand-list" aria-haspopup="false">
                {isExpanded ? <VerticalAlignCenterIcon /> : <HeightIcon />}
              </IconButton>
            )}
          </div>
        </div>
      </div>

      {map((user) => (
        <UserQuestionnairesList
          key={`user-${user.id}`}
          user={user}
          query={query}
          currentUserGroup={currentUserGroup}
          currentUserId={prop('id', currentUser)}
          // handleModalOpen={handleEditModalOpen}
          isExpanded={state.isExpanded}
          isShowGrid={state.isShowGrid}
        />
      ))(users)}

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
  block: {
    margin: 'auto auto 20px auto',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userOptions: {
    display: 'flex',
    justifyContent: 'flex-end',
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
  withQuestionnaires('Все опросники')
)(Questionnaires)
