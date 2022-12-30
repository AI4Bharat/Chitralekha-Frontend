import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import FetchOrganizationDetailsAPI from "../../redux/actions/api/Organization/FetchOrganizationDetails";
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchOrgOwnersAPI from "../../redux/actions/api/Admin/FetchOrgOwners";

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

const EditOrganizationDetails = () => {
  const { orgId } = useParams();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orgInfo = useSelector((state) => state.getOrganizationDetails.data);
  const orgOwnerList = useSelector((state) => state.getOrgOwnerList.data);

  const [orgDetails, setOrgDetails] = useState({
    title: "",
    owner: "",
    emailDomainName: "",
  });
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    const apiObj = new FetchOrgOwnersAPI();
    dispatch(APITransport(apiObj));
  }, []);

  useEffect(() => {
    setOrgDetails({
      title: orgInfo.title,
      owner: orgInfo.organization_owner,
      emailDomainName: orgInfo.email_domain_name,
    });
  }, [orgInfo]);

  useEffect(() => {
    const apiObj = new FetchOrganizationDetailsAPI(orgId);
    dispatch(APITransport(apiObj));
  }, []);

  const handleFieldChange = (event) => {
    event.preventDefault();
    setOrgDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleOrgUpdate = () => {};

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
          Edit Organization
        </Typography>

        <Box>
          <Typography gutterBottom component="div" label="Required">
            Title*
          </Typography>
          <OutlinedTextField
            fullWidth
            value={orgDetails.title}
            name={"title"}
            onChange={(e) => handleFieldChange(e)}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Owner
          </Typography>
          <FormControl fullWidth>
            <Select
              id="demo-multiple-name"
              name={"owner"}
              value={orgDetails.owner}
              onChange={(event) => handleFieldChange(event)}
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
            name={"emailDomainName"}
            value={orgDetails.emailDomainName}
            onChange={(e) => handleFieldChange(e)}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            style={{ margin: "0px 20px 0px 0px" }}
            label={"Update Organization"}
            onClick={() => handleOrgUpdate()}
            disabled={orgDetails.title && orgDetails.owner ? false : true}
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

export default EditOrganizationDetails;
