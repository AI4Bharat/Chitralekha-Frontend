import React, { useState } from "react";

//Components
import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import OutlinedTextField from "../../../common/OutlinedTextField";
import Button from "../../../common/Button";

//APIs
import EditProjectDetailsAPI from "../../../redux/actions/api/Project/EditProjectDetails";
import APITransport from "../../../redux/actions/apitransport/apitransport";

//Utils
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ArchiveProjectAPI from "../../../redux/actions/api/Project/ArchiveProject";

const ProjectSettings = ({ projectInfo }) => {
  const { orgId, projectId } = useParams();
  const dispatch = useDispatch();

  const [title, setTitle] = useState(projectInfo.title);
  const [description, setDescription] = useState(projectInfo.description);
  const [managerUsername, setManagerUsername] = useState(
    projectInfo.manager?.username
  );
  const [managerFirstName, setManagerFirstName] = useState(
    projectInfo.manager?.first_name
  );
  const [managerLastName, setManagerLastName] = useState(
    projectInfo.manager?.last_name
  );
  const [managerPhone, setManagerPhone] = useState(projectInfo.manager?.phone);
  const [managerOrgTitle, setManagerOrgTitle] = useState(
    projectInfo.manager?.organization?.title
  );
  const [managerOrgEmail, setManagerOrgEmail] = useState(
    projectInfo.manager?.organization?.email_domain_name
  );
  const [creatorUsername, setCreatorUsername] = useState(
    projectInfo.created_by?.username
  );
  const [creatorFirstName, setCreatorFirstName] = useState(
    projectInfo.created_by?.first_name
  );
  const [creatorLastName, setCreatorLastName] = useState(
    projectInfo.created_by?.last_name
  );
  const [creatorPhone, setCreatorPhone] = useState(
    projectInfo.created_by?.phone
  );
  const [creatorOrgTitle, setCreatorOrgTitle] = useState(
    projectInfo.created_by?.organization?.title
  );
  const [creatorOrgEmail, setCreatorOrgEmail] = useState(
    projectInfo.created_by?.organization?.email_domain_name
  );
  const [isDisabled, setIsDisabled] = useState(projectInfo.is_archived);

  const handleProjectUpdate = () => {
    const updateProjectReqBody = {
      title: title,
      is_archived: false,
      description: description,
      organization_id: orgId,
      manager: {
        username: managerUsername,
        availability_status: 1,
        enable_mail: true,
        first_name: managerFirstName,
        last_name: managerLastName,
        phone: managerPhone,
        organization: {
          title: managerOrgTitle,
          email_domain_name: managerOrgEmail,
        },
      },
      created_by: {
        username: creatorUsername,
        availability_status: 1,
        enable_mail: true,
        first_name: creatorFirstName,
        last_name: creatorLastName,
        phone: creatorPhone,
        organization: {
          title: creatorOrgTitle,
          email_domain_name: creatorOrgEmail,
        },
      },
    };

    const apiObj = new EditProjectDetailsAPI(updateProjectReqBody, projectId);
    dispatch(APITransport(apiObj));
  };

  const handleProjectArchive = () => {
    const apiObj = new ArchiveProjectAPI(projectId);
    dispatch(APITransport(apiObj));
    setIsDisabled(true);
  };

  return (
    <Box>
      <Typography variant="h3">Edit Project</Typography>

      <Box sx={{ mt: 3 }}>
        <Typography gutterBottom component="div" label="Required">
          Title*:
        </Typography>
        <OutlinedTextField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography gutterBottom component="div" label="Required" multiline>
          Description:
        </Typography>
        <OutlinedTextField
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>

      <Divider sx={{ mt: 5 }} />

      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom component="div">
          Manager Details
        </Typography>
      </Box>

      <Box display="flex" sx={{ mt: 3 }}>
        <Box width="100%" marginRight="5%">
          <Typography gutterBottom component="div" label="Required">
            Username*:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={managerUsername}
            onChange={(e) => setManagerUsername(e.target.value)}
          />
        </Box>
        <Box width="100%">
          <Typography gutterBottom component="div" label="Required">
            Phone:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={managerPhone}
            onChange={(e) => setManagerPhone(e.target.value)}
          />
        </Box>
      </Box>

      <Box display="flex" sx={{ mt: 3 }}>
        <Box width="100%" marginRight="5%">
          <Typography gutterBottom component="div" label="Required">
            First Name:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={managerFirstName}
            onChange={(e) => setManagerFirstName(e.target.value)}
          />
        </Box>
        <Box width="100%">
          <Typography gutterBottom component="div" label="Required">
            Last Name:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={managerLastName}
            onChange={(e) => setManagerLastName(e.target.value)}
          />
        </Box>
      </Box>

      <Box display="flex" sx={{ mt: 3 }}>
        <Box width="100%" marginRight="5%">
          <Typography gutterBottom component="div" label="Required">
            Organization Title*:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={managerOrgTitle}
            onChange={(e) => setManagerOrgTitle(e.target.value)}
          />
        </Box>
        <Box width="100%">
          <Typography gutterBottom component="div" label="Required">
            Organization Domain Email:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={managerOrgEmail}
            onChange={(e) => setManagerOrgEmail(e.target.value)}
          />
        </Box>
      </Box>

      <Divider sx={{ mt: 5 }} />

      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom component="div">
          Creator Details
        </Typography>
      </Box>

      <Box display="flex" sx={{ mt: 3 }}>
        <Box width="100%" marginRight="5%">
          <Typography gutterBottom component="div" label="Required">
            Username*:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={creatorUsername}
            onChange={(e) => setCreatorUsername(e.target.value)}
          />
        </Box>
        <Box width="100%">
          <Typography gutterBottom component="div" label="Required">
            Phone:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={creatorPhone}
            onChange={(e) => setCreatorPhone(e.target.value)}
          />
        </Box>
      </Box>

      <Box display="flex" sx={{ mt: 3 }}>
        <Box width="100%" marginRight="5%">
          <Typography gutterBottom component="div" label="Required">
            First Name:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={creatorFirstName}
            onChange={(e) => setCreatorFirstName(e.target.value)}
          />
        </Box>
        <Box width="100%">
          <Typography gutterBottom component="div" label="Required">
            Last Name:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={creatorLastName}
            onChange={(e) => setCreatorLastName(e.target.value)}
          />
        </Box>
      </Box>

      <Box display="flex" sx={{ mt: 3 }}>
        <Box width="100%" marginRight="5%">
          <Typography gutterBottom component="div" label="Required">
            Organization Title*:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={creatorOrgTitle}
            onChange={(e) => setCreatorOrgTitle(e.target.value)}
          />
        </Box>
        <Box width="100%">
          <Typography gutterBottom component="div" label="Required">
            Organization Domain Email:
          </Typography>
          <OutlinedTextField
            fullWidth
            value={creatorOrgEmail}
            onChange={(e) => setCreatorOrgEmail(e.target.value)}
          />
        </Box>
      </Box>

      <Button
        label={"Change"}
        disabled={
          title &&
          managerUsername &&
          managerOrgTitle &&
          creatorUsername &&
          creatorOrgTitle
            ? false
            : true
        }
        onClick={() => handleProjectUpdate()}
        sx={{ mt: 5, width: "100%" }}
      />
      <Button
        label={"Archive Project"}
        onClick={() => handleProjectArchive()}
        disabled={isDisabled}
        sx={{ mt: 5, width: "100%", background: "rgb(207, 89, 89)" }}
      />
    </Box>
  );
};

export default ProjectSettings;
