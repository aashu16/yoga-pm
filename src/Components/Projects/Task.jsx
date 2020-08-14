import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const TaskWrapper = styled.div`
  padding: 0.5rem;
  margin: 0.25rem 0;
  border: 1px solid palegoldenrod;
  border-radius: 0.25rem;
  font-size: 1rem;
  color: rgb(100, 100, 100);
  cursor: pointer;
  user-select: none;
  background-color: white;

  &:hover {
    background-color: papayawhip;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 7fr 1fr 1fr;
  grid-gap: 4px;
  text-align: left;
  align-items: center;
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: palevioletred;
  color: antiquewhite;
  border: none;
  border-radius: 4px;
`;

const Task = ({ task, index, projectId, dispatchTasks }) => {
  const [open, setOpen] = React.useState(false);
  const prevContent = task.content;
  const [taskContent, setTaskContent] = React.useState(task.content);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditSubmit = () => {
    dispatchTasks({
      type: "UPDATE_CONTENT",
      payload: {
        id: task.id,
        content: taskContent,
      },
    });

    // Call PUT /tasks/:taskId
    handleClose();
  };

  const handleDelete = () => {
    // Call DELETE /tasks/:taskId
  };

  return (
    <React.Fragment>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <TaskWrapper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}>
            <ContentWrapper>
              <div>{task.content}</div>
              <Button onClick={handleClickOpen}>E</Button>
              <Button onClick={handleDelete}>X</Button>
            </ContentWrapper>
          </TaskWrapper>
        )}
      </Draggable>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit task</DialogTitle>
        <DialogContent>
          <label htmlFor="name">Enter new task</label>
          <input
            autoFocus
            id="name"
            type="text"
            onChange={(e) => setTaskContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Task;
