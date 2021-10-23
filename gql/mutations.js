import { merge } from 'ramda'
import { insertOneMutation, insertMultipleMutation, updateWhereMutation } from 'utils/database'
import moment from 'moment'

import config from '../config'

const execute = ({ struct, variables, type }) => merge(type(struct, variables()), { variables })

export const insertUserQuestionnaire = execute({
  type: insertOneMutation,
  struct: 'user_questionnaires',
  variables: (id, questionnaire_id, user_id, records, shouldComplete, group_id) => ({
    object: {
      is_completed: shouldComplete,
      id,
      group_id,
      questionnaire_id,
      user_id,
      user_questions: {
        data: records,
        on_conflict: {
          constraint: 'user_questions_pkey',
          update_columns: ['answer', 'goal']
        },
      }
    },
    on_conflict: {
      constraint: 'user_questionnaires_pkey',
      update_columns: ['is_completed']
    },
  }),
})

export const insertNewUserQuestionnaire = execute({
  type: insertOneMutation,
  struct: 'user_questionnaires',
  variables: (object) => ({
    object,
    on_conflict: {
      constraint: 'user_questionnaires_pkey',
      update_columns: ['questionnaire_id']
    }
  })
})

export const insertUser = execute({
  type: insertOneMutation,
  struct: 'users',
  variables: (name, telegram, chat_tgid) => ({
    object: {
      name,
      telegram,
      // avatar_url,
      chat_tgid,
      is_send_notifications: true,
    },
    on_conflict: {
      constraint: 'users_telegram_key',
      update_columns: ['chat_tgid', 'avatar_url']
    },
  }),
})

export const insertUserMessages = execute({
  type: insertMultipleMutation,
  struct: 'user_messages',
  variables: (objects) => ({
    objects,
    on_conflict: {
      constraint: 'user_messages_user_id_message_template_id_date_table_row_id_key',
      update_columns: [],
    },
  }),
})

export const updateUserMessagesIsSent = execute({
  type: insertMultipleMutation,
  struct: 'user_messages',
  variables: (objects) => ({
    objects,
    on_conflict: {
      constraint: 'user_messages_pkey',
      update_columns: ['is_sent'],
    },
  }),
})

export const insertUserQuestionnaires = execute({
  type: insertMultipleMutation,
  struct: 'user_questionnaires',
  variables: (objects) => ({
    objects,
    on_conflict: {
      constraint: 'user_questionnaires_pkey',
      update_columns: ['questionnaire_id'],
    },
  }),
})
