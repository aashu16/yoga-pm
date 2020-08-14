import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import * as firebase from "firebase/app";
import "firebase/auth";

import { db } from "./ServerStuff";
import Column from "./Column";
import { insert } from "./LexoRank";
import AddUsersToProject from "./AddUsersToProject";

const BoardWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const initialColumns = {
  todo: {
    id: "todo",
    name: "To do",
  },
  progress: {
    id: "progress",
    name: "In progress",
  },
  done: {
    id: "done",
    name: "Done",
  },
};

const initialColumnOrder = ["todo", "progress", "done"];

const TaskReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, [action.payload.taskId]: action.payload.task };
    case "UPDATE_CONTENT":
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          content: action.payload.content,
        },
      };
    case "SET_POSITION":
      return {
        ...state,
        [action.payload.taskId]: {
          ...state[action.payload.taskId],
          rank: action.payload.rank,
          column: action.payload.column,
        },
      };
    case "DELETE_TASK":
      const { [action.payload.id]: deletedState, ...remainingState } = state;
      return remainingState;
    default:
      return state;
  }
};

const ColumnReducer = (state = initialColumns, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const ColumnOrderReducer = (state = initialColumnOrder, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const getTasksByColumnId = (state, columnId) =>
  Object.getOwnPropertyNames(state).filter((taskId) => {
    // console.log(state[taskId]);
    return getTask(state, taskId).column === columnId;
  });

const getOrderedTasksByColumnId = (state, columnId) => {
  const tasks = getTasksByColumnId(state, columnId);
  return tasks.sort((a, b) => (state[a].rank > state[b].rank ? 1 : -1));
};

const getTask = (state, id) =>
  Object.prototype.hasOwnProperty.call(state, id) ? state[id] : undefined;

const getColumn = (state, id) =>
  Object.prototype.hasOwnProperty.call(state, id) ? state[id] : undefined;

export const AuthUserContext = React.createContext();

const BoardContainer = ({ projectId }) => {
  const [userId, setUserId] = React.useState();
  const [tasks, dispatchTasks] = React.useReducer(TaskReducer, {});
  const [columns, dispatchColumns] = React.useReducer(
    ColumnReducer,
    initialColumns,
  );
  const [columnOrder, dispatchColumnOrder] = React.useReducer(
    ColumnOrderReducer,
    initialColumnOrder,
  );

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
  }, []);

  React.useEffect(() => {
    db.collection("projects")
      .doc(projectId)
      .collection("tasks")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const taskData = doc.data();
          dispatchTasks({
            type: "ADD_TASK",
            payload: { taskId: doc.id, task: taskData },
          });
        });
      });
  }, [projectId]);

  const getTaskFromTasks = (taskId) => getTask(tasks, taskId);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    const prevRank = getTask(tasks, draggableId).rank;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const column = columns[destination.droppableId];
    const destinationTaskIds =
      getOrderedTasksByColumnId(tasks, column.id) || [];

    let newRank, success;

    // if (destination.droppableId === source.droppableId) {
    if (destinationTaskIds.length === 0) {
      [newRank, success] = ["a", true];
    } else if (destinationTaskIds[destination.index] == null) {
      [newRank, success] = insert(
        getTask(tasks, destinationTaskIds[destination.index - 1]).rank,
        "",
      );
    } else if (destination.index === 0) {
      [newRank, success] = insert(
        "",
        getTask(tasks, destinationTaskIds[destination.index]).rank,
      );
    } else if (destination.index === destinationTaskIds.length - 1) {
      [newRank, success] = insert(
        getTask(tasks, destinationTaskIds[destination.index]).rank,
        "",
      );
    } else if (destination.index < 0 || destination.index > column.length - 1) {
      throw new Error("Invalid destination index");
    } else {
      if (destination.index > source.index) {
        [newRank, success] = insert(
          getTask(tasks, destinationTaskIds[destination.index]).rank,
          getTask(tasks, destinationTaskIds[destination.index + 1]).rank,
        );
      } else if (destination.index < source.index) {
        [newRank, success] = insert(
          getTask(tasks, destinationTaskIds[destination.index - 1]).rank,
          getTask(tasks, destinationTaskIds[destination.index]).rank,
        );
      }
    }
    // }

    if (!success) {
      return;
    } else {
      dispatchTasks({
        type: "SET_POSITION",
        payload: {
          taskId: draggableId,
          rank: newRank,
          column: destination.droppableId,
        },
      });

      db.collection("projects")
        .doc(projectId)
        .collection("tasks")
        .doc(draggableId)
        .update({ rank: newRank, column: destination.droppableId })
        .catch((error) => {
          dispatchTasks({
            type: "SET_POSITION",
            payload: {
              taskId: draggableId,
              rank: prevRank,
              column: source.droppableId,
            },
          });
          console.log("Cannot update task rank in Firebase");
        });
    }
  };

  const onDragUpdate = (result) => {};

  return (
    <React.Fragment>
      <AuthUserContext.Provider value={userId}>
        <AddUsersToProject projectId={projectId} />
        <BoardWrapper>
          <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
            {columnOrder.map((columnId) => (
              <Column
                key={columnId}
                projectId={projectId}
                column={columns[columnId]}
                tasks={getTasksByColumnId(tasks, columnId) || []}
                getTask={getTaskFromTasks}
                dispatchTasks={dispatchTasks}
              />
            ))}
          </DragDropContext>
        </BoardWrapper>
      </AuthUserContext.Provider>
    </React.Fragment>
  );
};

export default BoardContainer;
