import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import * as firebase from "firebase/app";
import "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

import Task from "./Task";
import { db } from "./ServerStuff";
import { insert } from "./LexoRank";

const ColumnContainer = styled.div`
  box-sizing: border-box;
  height: 90vh;
  max-height: 90vh;
  max-width: 350px;
  min-width: 350px;
  width: 100%;
  margin: 1rem;
  border: 1px solid peachpuff;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`;
const ColumnName = styled.div`
  padding: 0.5rem;
  font-size: 1.25rem;
  color: palevioletred;
`;

const TaskList = styled.div`
  height: calc(100% - 8rem);
  overflow-y: scroll;
  margin: 2rem 0.5rem 1rem;
  padding: 0.5rem;
  border: 1px solid peachpuff;
  border-radius: 0.5rem;

  ::-webkit-scrollbar {
    width: 0;
  }
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: palevioletred;
  color: antiquewhite;
  border: none;
  border-radius: 4px;
`;

const Column = ({ projectId, column, tasks, getTask, dispatchTasks }) => {
  tasks.sort((a, b) => (getTask(a).rank > getTask(b).rank ? 1 : -1));

  const [open, setOpen] = React.useState(false);
  const [newTaskContent, setNewTaskContent] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const newId = uuidv4();
    const lastTask = getTask(tasks[tasks.length - 1]);
    const lastTaskRank = lastTask ? lastTask.rank : "";
    console.log(lastTaskRank);

    const user = firebase.auth().currentUser;

    const nextRank = insert(lastTaskRank, "");

    if (nextRank[1]) {
      db.collection("projects")
        .doc(projectId)
        .collection("tasks")
        .doc(newId)
        .set({
          id: newId,
          content: newTaskContent,
          column: "todo",
          rank: nextRank[0],
          created: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: user ? user.uid : "unknown",
        })
        .then((newTask) => {
          dispatchTasks({
            type: "ADD_TASK",
            payload: {
              taskId: newId,
              task: {
                id: newId,
                content: newTaskContent,
                column: "todo",
                rank: nextRank[0],
              },
            },
          });

          return newTask;
        })
        .catch((error) => {
          console.log("Cannot add task to Firebase");
        });
    }
    handleClose();
  };

  return (
    <ColumnContainer>
      <ColumnHeader>
        <ColumnName>{column.name}</ColumnName>
        {column.id && column.id === "todo" && (
          <Button onClick={handleClickOpen}>Add task</Button>
        )}
      </ColumnHeader>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <TaskList ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((taskId, index) => (
              <Task
                projectId={projectId}
                key={taskId}
                task={getTask(taskId)}
                index={index}
                dispatchTasks={dispatchTasks}
              />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add new task</DialogTitle>
        <DialogContent>
          <label htmlFor="name">Enter new task</label>
          <input
            autoFocus
            id="name"
            type="text"
            onChange={(e) => setNewTaskContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </ColumnContainer>
  );
};

export default Column;
