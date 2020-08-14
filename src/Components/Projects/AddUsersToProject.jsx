import React from "react";
import styled from "styled-components";

import { AuthUserContext } from "./Board";

const Button = styled.button`
  font-size: 1.1.rem;
  padding: 0.5rem;
  background-color: ${(props) =>
    props.primary ? "blueviolet" : "palevioletred"};
  color: antiquewhite;
  border: none;
  border-radius: 4px;
`;

const AddUsersToProject = React.memo(({ projectId }) => {
  const [isOwner, setIsOwner] = React.useState(false);
  const currentUserFromContext = React.useContext(AuthUserContext);

  React.useEffect(() => {
    // TODO
  });

  const [newUser, setNewUser] = React.useState("");
  const [newUserId, setNewUserId] = React.useState(null);
  const [newUserProjects, setNewUserProjects] = React.useState();
  const [newProjectUsers, setNewProjectUsers] = React.useState();
  // let newUserProjects, newProjectUsers;

  const addNewUserToProject = () => {};

  React.useEffect(() => {
    if (newUserId) {
      // TODO
    }
  }, [newProjectUsers, newUserId, newUserProjects, projectId]);

  if (isOwner) {
    return (
      <React.Fragment>
        <label htmlFor="name">
          Enter email address of the user you want to add
        </label>
        <input
          autoFocus
          value={newUser}
          id="name"
          type="text"
          onChange={(e) => setNewUser(e.target.value)}
        />
        <Button onClick={addNewUserToProject} color="primary">
          Create
        </Button>
      </React.Fragment>
    );
  } else {
    return <React.Fragment />;
  }
});

export default AddUsersToProject;
