import { merge } from 'ramda'
import { queryWhereQuery } from 'utils/database'

import config from '../config'

const execute = ({ struct, variables, type, mandatoryVariables }) => merge(type(struct, variables()), { variables, mandatoryVariables })

export const queryUserQuestionnairesByUserUuidAndQuestionnaireId = execute({
  type: queryWhereQuery,
  struct: {
    user_questionnaires: [
      'questionnaire',
      { user_questions: [
        { question: [
          'question_type',
          'questionnaire_questions'
        ] }
      ] }
    ],
  },
  variables: (fromDate, toDate, questionnaire_id, uuid) => ({
    where: {
      _and: [{date: {_gte: fromDate}}, {date: {_lte: toDate}}],
      user: { uuid: { _eq: uuid }},
      questionnaire_id: { _eq: questionnaire_id },
      deleted_at: { _is_null: true },
    },
    order_by: [{date: 'asc'}],
    where_user_questions: {
      deleted_at: { _is_null: true },
    },
    where_question: {
      deleted_at: { _is_null: true },
    },
    where_questionnaire_questions: {
      deleted_at: { _is_null: true }
    }
  }),
  mandatoryVariables: 2,
})

export const queryQuestionnaireTypes = execute({
  type: queryWhereQuery,
  struct: 'questionnaire_types',
  variables: () => ({
    where: {}
  })
})

export const queryUserQuestionnairesByUuid = execute({
  type: queryWhereQuery,
  struct: {
    user_questionnaires: [
      'questionnaire',
      'user',
      { user_questions: [
        { question: [
          'question_type',
          'questionnaire_questions'
        ] }
      ] }
    ],
  },
  variables: (uuid) => ({
    where: {
      uuid: { _eq: uuid },
      is_completed: { _eq: false },
      deleted_at: { _is_null: true },
      questionnaire: {
        is_client_visible: { _eq: true },
      },
      user_questions: {
        deleted_at: { _is_null: true },
        question: {
          is_client_visible: { _eq: true }, // nested condition not working
          deleted_at: { _is_null: true },
        },
      },
    },
    where_questionnaire_questions: {
      deleted_at: { _is_null: true }
    }
  }),
})
