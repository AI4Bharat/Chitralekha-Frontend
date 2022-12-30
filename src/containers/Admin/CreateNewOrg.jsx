import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Styles
import DatasetStyle from "../../styles/Dataset";

//Components
import {
  Card,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import CustomizedSnackbars from "../../common/Snackbar";
import OutlinedTextField from "../../common/OutlinedTextField";
import Button from "../../common/Button";

//APIs
import CreateNewOrganizationAPI from "../../redux/actions/api/Organization/CreateNewOrganization";
import FetchOrgOwnersAPI from "../../redux/actions/api/Admin/FetchOrgOwners";
import APITransport from "../../redux/actions/apitransport/apitransport";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateNewOrg = () => {
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orgOwnerList = useSelector((state) => state.getOrgOwnerList.data);
  console.log(orgOwnerList, "orgOwnerList");
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [emailDomainName, setEmailDomainName] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    const apiObj = new FetchOrgOwnersAPI();
    dispatch(APITransport(apiObj));
  }, []);

  const handleCreateProject = async () => {
    const apiObj = new CreateNewOrganizationAPI(title, emailDomainName, owner);

    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });

    const resp = await res.json();

    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      navigate(`/admin`, { replace: true });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

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
          Create New Organization
        </Typography>

        <Box>
          <Typography gutterBottom component="div" label="Required">
            Title*
          </Typography>
          <OutlinedTextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Owner
          </Typography>
          <FormControl fullWidth>
            <Select
              id="demo-multiple-name"
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              MenuProps={MenuProps}
            >
              {orgOwnerList.map((item) => {
                return (
                  <MenuItem key={"1"} value={item.id}>
                    {item.username}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required" multiline>
            Email Domain Name
          </Typography>
          <OutlinedTextField
            fullWidth
            value={emailDomainName}
            onChange={(e) => setEmailDomainName(e.target.value)}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            style={{ margin: "0px 20px 0px 0px" }}
            label={"Create Organization"}
            onClick={() => handleCreateProject()}
            disabled={title && owner ? false : true}
          />

          <Button
            buttonVariant="text"
            label={"Cancel"}
            onClick={() => navigate(`/admin`)}
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default CreateNewOrg;
