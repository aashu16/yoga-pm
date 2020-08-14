import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const ProjectsListWrapper = styled.div`
  padding: 1rem;
  border: 1px solid palegoldenrod;
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  min-width: 325px;
  max-width: 500px;
  margin: 10rem auto;
`;

const ProjectWrapper = styled.div`
  display: grid;
  grid-template-columns: 7fr 1fr;
  padding: 0.5rem;
`;

const Button = styled.button`
  font-size: 1.1.rem;
  padding: 0.5rem;
  background-color: ${(props) =>
    props.primary ? "blueviolet" : "palevioletred"};
  color: antiquewhite;
  border: none;
  border-radius: 4px;
`;

const MemoProject = React.memo(({ projects }) => (
  <div>
    {projects.map((projectId) => (
      <Project key={`project-${projectId}`} projectId={projectId} />
    ))}
  </div>
));

const Project = ({ projectId }) => {
  const [project, setProject] = React.useState({});

  React.useEffect(() => {
    // GET /projects/:projectId
  }, [projectId]);

  return (
    <ProjectWrapper>
      <Link to={"/p/" + projectId}>
        {project && project.meta && project.meta.name}
      </Link>
      <Button>Delete</Button>
    </ProjectWrapper>
  );
};

const Projects = () => {
  const [projects, setProjects] = React.useState([]);
  const [userId, setUserId] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    // Check for auth status
  }, []);

  React.useEffect(() => {
    // GET /projects
  }, [userId]);

  const createNewProject = () => {
    const newProjectId = uuidv4();
    const newProjects = [...projects, newProjectId];

    // POST /projects

    handleClose();
  };

  return (
    <ProjectsListWrapper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New project</DialogTitle>
        <DialogContent>
          <label htmlFor="name">Enter project name</label>
          <input
            autoFocus
            id="name"
            type="text"
            onChange={(e) => setProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createNewProject} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <MemoProject projects={projects} />
      <Button primary onClick={handleClickOpen}>
        New project
      </Button>
    </ProjectsListWrapper>
  );
};

export default Projects;
