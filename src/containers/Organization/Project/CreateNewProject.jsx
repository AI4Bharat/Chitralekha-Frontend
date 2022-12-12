import { Card, Divider, Grid, Typography, FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField, } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OutlinedTextField from "../../../common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import Button from "../../../common/Button";
import CreateNewProjectAPI from "../../../redux/actions/api/Project/CreateNewProject";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import CustomizedSnackbars from "../../../common/Snackbar";
import FetchManagerNameAPI from "../../../redux/actions/api/Project/FetchManagerName";
import FetchOrganizatioProjectManagersUserAPI from "../../../redux/actions/api/Organization/FetchOrganizatioProjectManagersUser";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const CreatenewProject = () => {
  const { orgId } = useParams();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const newProjectDetails = useSelector(
    (state) => state.getNewProjectDetails.data
  );
  const managerNames = useSelector(
    (state) => state.getManagerName.data
  );
  const userList = useSelector((state) => state.getOrganizatioProjectManagersUser.data);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [managerUsername, setManagerUsername] = useState([]);
  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerOrgTitle, setManagerOrgTitle] = useState("");
  const [managerOrgEmail, setManagerOrgEmail] = useState("");
  const [creatorUsername, setCreatorUsername] = useState("");
  const [creatorFirstName, setCreatorFirstName] = useState("");
  const [creatorLastName, setCreatorLastName] = useState("");
  const [creatorPhone, setCreatorPhone] = useState("");
  const [creatorOrgTitle, setCreatorOrgTitle] = useState("");
  const [creatorOrgEmail, setCreatorOrgEmail] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  
  const GetManagerName =()=>{
    const apiObj = new FetchManagerNameAPI();
     dispatch(APITransport(apiObj));
  }
  const getOrganizatioUsersList = () => {
    const userObj = new FetchOrganizatioProjectManagersUserAPI(orgId);
    dispatch(APITransport(userObj));
  };
console.log(managerUsername,"userList",userList)
  useEffect(() => {
    GetManagerName()
    getOrganizatioUsersList()
  }, [])

  const handeleselectManager=(event,item) =>{
 
  const {
    target: { value }
  } = event;
  setManagerUsername(
    // On autofill we get a stringified value.
    typeof value === "string" ? value.split(",") : value
  );
  //setManagerUsername(item)
  }

  const handleCreateProject =async () => {
    const selectedMemberIdArr = managerUsername.map((el,i)=>{
      return el.id;
    })
    const newPrjectReqBody = {
      title: title,
     // is_archived: false,
      description: description,
      organization_id: orgId,
      managers_id: managerUsername
      
      // manager: {
      //   username: managerUsername,
      //   // availability_status: 1,
      //   // enable_mail: true,
      //   // first_name: managerFirstName,
      //   // last_name: managerLastName,
      //   // phone: managerPhone,
      //   // organization: {
      //   //   title: managerOrgTitle,
      //   //   email_domain_name: managerOrgEmail,
      //   // },
      // },
      // created_by: {
      //   username: creatorUsername,
      //   availability_status: 1,
      //   enable_mail: true,
      //   first_name: creatorFirstName,
      //   last_name: creatorLastName,
      //   phone: creatorPhone,
      //   organization: {
      //     title: creatorOrgTitle,
      //     email_domain_name: creatorOrgEmail,
      //   },
      // },
    };

    const apiObj = new CreateNewProjectAPI(newPrjectReqBody);
   // dispatch(APITransport(apiObj));
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message:  resp?.message,
        variant: "success",
      })

    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }
  };

  useEffect(() => {
    if (newProjectDetails.id) {
        navigate(`/my-organization/${orgId}/project/${newProjectDetails.id}`, { replace: true });
      }
  }, [newProjectDetails]);

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
       {renderSnackBar()}
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom component="div">
          Create a Project
        </Typography>

        <Box>
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
        <Box sx={{ mt: 3 }}>
        <Typography gutterBottom component="div" label="Required">
            Managers *:
          </Typography>
        <FormControl fullWidth>
            <Select
         // labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={managerUsername}
          onChange={handeleselectManager}
         // input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {userList.map((name) => (
            <MenuItem key={name.id} value={name.id}>
              {name.email}
            </MenuItem>
          ))}
        </Select>
            </FormControl>
        </Box>
        {/* <Divider sx={{ mt: 5 }} /> */}

        {/* <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom component="div">
            Manager Details
          </Typography>
        </Box> */}

        {/* <Box display="flex" sx={{ mt: 3 }}>
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
        </Box> */}

        {/* <Box display="flex" sx={{ mt: 3 }}>
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
        </Box> */}

        <Box sx={{ mt: 3 }}>
          <Button
            style={{ margin: "0px 20px 0px 0px" }}
            label={"Create Project"}
            onClick={() => handleCreateProject()}
            disabled={
              title &&
              managerUsername 
             
                ? false
                : true
            }
          />
          <Button
            label={"Cancel"}
            onClick={() => navigate(`/my-organization/${orgId}`)}
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default CreatenewProject;
