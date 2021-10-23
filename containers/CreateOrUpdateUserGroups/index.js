import { useCallback, useEffect, useState, useRef } from 'react'
import { adjust, merge, prop, map, addIndex, path, set, lensProp, remove, isEmpty, equals, find, pick } from 'ramda'
import moment from 'moment'
import omitEmpty from 'omit-empty'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

import { Autocomplete } from '@material-ui/lab'

import DeleteIcon from '@material-ui/icons/Delete'

import { queryGroupsWithUserGroups, queryRoles, queryUserGroups } from 'gql/queries'
import { insertGroups } from 'gql/mutations'
import useQuery from 'hooks/useQuery'
import useMutation from 'hooks/useMutation'

import useStyles from './styles'
import { Typography } from '@material-ui/core'

const mapIndex = addIndex(map)
const roleProp = lensProp('role')
const deletedAtProp = lensProp('deleted_at')

const CreateOrUpdateUserGroups = ({ closeModal, isEdit = false, currentUserGroup }) => {
  const initialUserGroups = useRef(false)
  const classes = useStyles()
  const [getGroups, { data: { groups }, loading: groupsLoading }] = useQuery(queryGroupsWithUserGroups)
  const [getUserGroups, { data: { user_groups }, loading: userGroupsLoading }] = useQuery(queryUserGroups)
  const [getRoles, { data: { roles }, loading: rolesLoading }] = useQuery(queryRoles)
  const [saveGroup, { loading: saving }] = useMutation(insertGroups)

  const [state, setState] = useState({
    chosenUsers: [],
    title: '',
  })

  useEffect(() => {
    isEdit && getGroups()

    getRoles()
    getUserGroups()
  }, [])

  useEffect(() => {
    if (!isEdit && prop('loading', groups)) return

    const group = find(({ id }) => id === prop('group_id', currentUserGroup))(groups)

    if (!group) return

    initialUserGroups.current = prop('user_groups', group)

    setState({
      chosenUsers: prop('user_groups', group),
      title: prop('title', group)
    })

  }, [groups, currentUserGroup, isEdit])

  const handleSimpleDataChange = useCallback((e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }, [setState, state])

  const handleUserInputChange = useCallback((index, value) => {
    const { chosenUsers } = state
    const usersArray = adjust(index, merge(value), chosenUsers)

    setState({
      ...state,
      chosenUsers: usersArray,
    })
  }, [setState, state])

  const handleRoleChange = useCallback((index, value) => {
    const { chosenUsers } = state
    const usersArray = adjust(index, set(roleProp, value), chosenUsers)

    setState({
      ...state,
      chosenUsers: usersArray,
    })
  }, [setState, state])

  const addUserInput = useCallback(() => {
    const { chosenUsers } = state

    setState({
      ...state,
      chosenUsers: [...chosenUsers, {}]
    })
  }, [setState, state])

  const handleRemoveUser = useCallback((index) => {
    const { chosenUsers } = state

    setState({
      ...state,
      chosenUsers: !isEdit
        ? remove(index, 1, chosenUsers)
        : adjust(index, set(deletedAtProp, moment().format()), chosenUsers)
    })
  }, [setState, state])

  const handleSubmit = useCallback(() => {
    const { chosenUsers, title } = state

    if (!title) return

    const objects = [
      omitEmpty({
        id: isEdit ? prop('group_id', currentUserGroup) : null,
        title,
        group_type_id: isEdit ? path(['group', 'group_type_id'], currentUserGroup) : 1,
        user_groups: {
          data: map((userGroup) => {
            const group = find(({ id }) => prop('id', userGroup) === id)(initialUserGroups.current)

            if (!group) return pick(['user_id', 'role'])(userGroup)

            return pick(['id', 'user_id', 'role', 'deleted_at'])(userGroup)
          })(chosenUsers),
          on_conflict: {
            constraint: 'user_group_pkey',
            update_columns: ['role', 'deleted_at'],
          }
        },
      })
    ]

    saveGroup(objects, {
      constraint: 'group_pkey',
      update_columns: ['title', 'group_type_id']
    })
  }, [state, user_groups, saveGroup])

  const { chosenUsers, title } = state

  if (groupsLoading || userGroupsLoading || rolesLoading) return (
    <Box className={classes.container}>
      <Box className={classes.wrapper}>
        <Box mb={3} className={classes.title}>
          <Typography>Загрузка</Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box className={classes.container}>
      <Box className={classes.wrapper}>
        <Box mb={3} className={classes.title}>
          <TextField
            label="Название группы"
            value={title}
            name="title"
            onChange={handleSimpleDataChange}
          />
        </Box>
        <Box className={classes.users}>
          {chosenUsers.map((userGroup, index) => !prop('deleted_at')(userGroup) && (
            <Box key={index} className={classes.user}>
              <Autocomplete
                fullWidth
                options={user_groups}
                value={path(['user', 'name'])(userGroup) || ''}
                onChange={(e, value) => handleUserInputChange(index, value)}
                getOptionLabel={(option) => typeof option === 'string'
                  ? option
                  : path(['user', 'name'], option)}
                getOptionSelected={(option) => prop('name', option)}
                disabled={isEdit && path(['user', 'name'])(userGroup)}
                renderInput={(params) => (
                  <TextField {...params} label="Имя пользователя" variant="outlined" />
                )}/>
              <TextField
                className={classes.roleInput}
                id="select-role"
                name="questionnaireType"
                variant="outlined"
                label="Роль"
                value={prop('role', userGroup) || ''}
                onChange={(e) => handleRoleChange(index, e.target.value)}
                fullWidth
                select
              >
                {mapIndex(
                  ({ name }, index) => (
                    <MenuItem key={index} value={name}>{name}</MenuItem>
                  )
                )(roles)}
              </TextField>
              <Button onClick={() => handleRemoveUser(index)}>
                <DeleteIcon />
              </Button>
            </Box>
          ))}
        </Box>
        <Box className={classes.addUser}>
          <Button variant="outlined" onClick={addUserInput}>Добавить пользователя</Button>
        </Box>
        <Box className={classes.controls}>
          <Button variant="outlined" onClick={closeModal} disabled={saving}>Отменить</Button>
          <Button variant="outlined" onClick={handleSubmit} disabled={isEmpty(chosenUsers) || saving}>Сохранить</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CreateOrUpdateUserGroups
