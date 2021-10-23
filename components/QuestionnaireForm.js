import { useCallback, useState } from 'react'
import { isEmpty, prop, find, propEq } from 'ramda'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

import { ColorPicker, createColor } from 'material-ui-color'

import QuestionnaireQuestion from 'components/QuestionnaireQuestion'
import Spinner from 'components/Spinner'

import useStyles from 'components/styles/QuestionnaireForm.styles'

import config from '../config'

const QuestionnaireForm = ({
  title,
  info,
  questionnaireType,
  questionnaireTypes = [],
  questions = [],
  allQuestions = [],
  startTime,
  endTime,
  color,
  onDataChange,
  handleQuestionTitleChange,
  handleIsQuestionRequiredChange,
  handleAddQuestion,
  handleRemoveQuestion,
  handleAddRandomQuestions,
  onQuestionnaireTypeChange,
  handleQuestionPositionChange,
  noHeader,
  randomQuestionsLoading,
}) => {
  const classes = useStyles()
  const [questionsAmount, setQuestionsAmount] = useState('')

  const handleQuestionsAmountChange = useCallback(
    (e) => {
      setQuestionsAmount(e.target.value)
    },
    [setQuestionsAmount]
  )

  const handleColorChange = useCallback((value) => {
    const { hex } = value

    if (!hex) return

    onDataChange('color', `#${hex}`)
  }, [onDataChange])

  const handleAddRandomQuestionsButtonClick = useCallback(() => {
    handleAddRandomQuestions(Number(questionsAmount))
  }, [handleAddRandomQuestions, questionsAmount])

  const handleSimpleDataChange = useCallback(
    (e) => {
      const { name, value } = e.target

      onDataChange(name, value)
    },
    [onDataChange]
  )

  const handleTimeChange = useCallback(
    (e) => {
      const { value, name } = prop('target', e)
      const { timeFormat } = config

      onDataChange(name, moment(value, timeFormat).format(timeFormat))
    },
    [onDataChange]
  )

  const moveQuestion = useCallback((dragIndex, hoverIndex) => {
    handleQuestionPositionChange(dragIndex, hoverIndex)
  }, [handleQuestionPositionChange]);

  const questionnaireTypeTitle = prop('title')(find(propEq('id', questionnaireType))(questionnaireTypes))

  return (
    <Box mt={3} width="100%">
      {!noHeader && (
        <Typography variant="h5" align="center">
          Опросник
        </Typography>
      )}
      <Box>
        <Box mt={3}>
          <TextField
            name="title"
            label="Название"
            variant="outlined"
            value={title}
            onChange={handleSimpleDataChange}
            fullWidth
          />
        </Box>

        <Box mt={3}>
          <TextField
            name="info"
            label="Описание"
            variant="outlined"
            value={info}
            onChange={handleSimpleDataChange}
            fullWidth
          />
        </Box>

        <Box mt={3} mb={3}>
          <TextField
            label="Тип"
            id="select-type"
            name="questionnaireType"
            variant="outlined"
            value={questionnaireTypeTitle || ''}
            onChange={onQuestionnaireTypeChange}
            fullWidth
            select
          >
            {questionnaireTypes.map((type, i) => (
              <MenuItem key={i} value={type.title}>
                {type.title}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {!isEmpty(questions) && (
          <>
            <Typography>Вопросы</Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table aria-label="simple table" className={classes.table} size="small">
                <TableBody>
                  {questions.map(
                    (question, index) =>
                      !question.deleted_at && (
                        <QuestionnaireQuestion
                          key={index}
                          id={prop('dragId', question)}
                          className={classes.questionCell}
                          allQuestions={allQuestions}
                          question={question}
                          handleQuestionTitleChange={handleQuestionTitleChange}
                          index={index}
                          handleIsQuestionRequiredChange={handleIsQuestionRequiredChange}
                          handleRemoveQuestion={handleRemoveQuestion}
                          moveQuestion={moveQuestion}
                        />
                      )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      {(questionnaireType || !isEmpty(questions)) && (
        <Box mt={2}>
          <Button onClick={handleAddQuestion} variant="outlined" color="primary">
            Добавить вопрос
          </Button>

          <Box mt={2} display="flex" alignItems="center" className={classes.flexWrap}>
            <Box mr={2} mb={2}>
              <Button variant="outlined" onClick={handleAddRandomQuestionsButtonClick} disabled={randomQuestionsLoading}>
                {randomQuestionsLoading
                  ? <Spinner sm />
                  : 'Добавить случайно'
                }
              </Button>
            </Box>
            <Box mb={2}>
              <TextField
                variant="outlined"
                label="Кол-во вопросов"
                type="number"
                value={questionsAmount}
                onChange={handleQuestionsAmountChange}
                disabled={randomQuestionsLoading}
              />
            </Box>
          </Box>

          <Box display="flex">
            <Box>
              <Typography>Время начала</Typography>
              <TextField name="start_time" onChange={handleTimeChange} value={startTime} type="time" />
            </Box>
            <Box ml={3}>
              <Typography>Время окончания</Typography>
              <TextField name="end_time" onChange={handleTimeChange} value={endTime} type="time" />
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mt={2}>
            <Typography>Цвет</Typography>
            <ColorPicker
              onChange={handleColorChange}
              value={createColor(color)}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default QuestionnaireForm
