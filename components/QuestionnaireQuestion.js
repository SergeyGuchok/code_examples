import { useRef } from 'react'
import { equals, find, prop, propEq } from 'ramda'
import { useDrop, useDrag } from 'react-dnd'

import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'

import Autocomplete from '@material-ui/lab/Autocomplete'

import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import DeleteIcon from '@material-ui/icons/Delete'

const QuestionnaireQuestion = ({
  className,
  allQuestions,
  question,
  handleQuestionTitleChange,
  index,
  handleIsQuestionRequiredChange,
  handleRemoveQuestion,
  id,
  moveQuestion
}) => {
  const ref = useRef(null)
  const [{ handlerId }, drop] = useDrop({
    accept: 'question',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveQuestion(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })
  const [, drag] = useDrag({
    type: 'question',
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <TableRow ref={ref} data-handler-id={handlerId}>
      <TableCell className={className}>
        <Autocomplete
          fullWidth
          options={allQuestions}
          value={
            prop('title')(find(propEq('id', prop('question_id', question)))(allQuestions)) || ''
          }
          onChange={(e, value) => handleQuestionTitleChange(index, value)}
          getOptionLabel={(option) => (typeof option === 'string' ? option : prop('title', option))}
          getOptionSelected={(op, val) => (op ? equals(prop('title', op), val) : false)}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
      </TableCell>
      <TableCell align="center">
        <Checkbox
          checked={question.is_required}
          onChange={(e) => handleIsQuestionRequiredChange(e, index)}
          color="primary"
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <IconButton size="small">
          <DragIndicatorIcon />
        </IconButton>
      </TableCell>
      <TableCell align="center">
        <IconButton onClick={() => handleRemoveQuestion(index)} color="secondary" size="small">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default QuestionnaireQuestion
