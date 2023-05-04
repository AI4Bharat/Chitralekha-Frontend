import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Components
import {
  Card,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Select,
  Chip,
  Checkbox,
  Button,
  TextField,
  InputLabel,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Box } from "@mui/system";
import CustomizedSnackbars from "../../common/Snackbar";

//APIs
import FetchOrganizationDetailsAPI from "../../redux/actions/api/Organization/FetchOrganizationDetails";
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchOrgOwnersAPI from "../../redux/actions/api/Admin/FetchOrgOwners";
import EditOrganizationDetailsAPI from "../../redux/actions/api/Organization/EditOrganizationDetails";
import FetchTranscriptTypesAPI from "../../redux/actions/api/Project/FetchTranscriptTypes";
import FetchTranslationTypesAPI from "../../redux/actions/api/Project/FetchTranslationTypes";
import FetchBulkTaskTypeAPI from "../../redux/actions/api/Project/FetchBulkTaskTypes";
import FetchSupportedLanguagesAPI from "../../redux/actions/api/Project/FetchSupportedLanguages";
import Loader from "../../common/Spinner";
import ToggleCSVUploadAPI from "../../redux/actions/api/Organization/ToggleCSVUpload";

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
  const dispatch = useDispatch();

  const orgInfo = useSelector((state) => state.getOrganizationDetails.data);
  const orgOwnerList = useSelector((state) => state.getOrgOwnerList.data);
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const translationTypes = useSelector(
    (state) => state.getTranslationTypes.data
  );
  const bulkTaskTypes = useSelector((state) => state.getBulkTaskTypes.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );

  const [orgDetails, setOrgDetails] = useState({
    title: "",
    emailDomainName: "",
  });
  const [owner, setOwner] = useState({});
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [transcriptSourceType, setTranscriptSourceType] =
    useState("MACHINE_GENERATED");
  const [translationSourceType, setTranslationSourceType] =
    useState("MACHINE_GENERATED");
  const [defaultTask, setDefaultTask] = useState([]);
  const [translationLanguage, setTranslationLanguage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enableCSVUpload, setEnableCSVUpload] = useState(false);

  useEffect(() => {
    const apiObj = new FetchOrgOwnersAPI(orgId);
    dispatch(APITransport(apiObj));

    const transcriptObj = new FetchTranscriptTypesAPI();
    dispatch(APITransport(transcriptObj));

    const translationObj = new FetchTranslationTypesAPI();
    dispatch(APITransport(translationObj));

    const bulkTaskObj = new FetchBulkTaskTypeAPI();
    dispatch(APITransport(bulkTaskObj));

    const langObj = new FetchSupportedLanguagesAPI();
    dispatch(APITransport(langObj));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setOrgDetails({
      title: orgInfo.title,
      emailDomainName: orgInfo.email_domain_name,
    });
    setEnableCSVUpload(orgInfo.enable_upload);

    if (orgInfo.organization_owner) {
      const items = orgOwnerList.filter(
        (item) => item.id === orgInfo.organization_owner.id
      );

      setOwner(items[0]);
    }

    if (orgInfo.default_task_types) {
      const items = bulkTaskTypes.filter((item) =>
        orgInfo.default_task_types.includes(item.value)
      );
      setDefaultTask(items);
    }

    if (orgInfo.default_target_languages) {
      const items = supportedLanguages.filter((item) =>
        orgInfo.default_target_languages.includes(item.value)
      );
      setTranslationLanguage(items);
    }

    // eslint-disable-next-line
  }, [orgInfo, orgOwnerList]);

  useEffect(() => {
    const apiObj = new FetchOrganizationDetailsAPI(orgId);
    dispatch(APITransport(apiObj));

    // eslint-disable-next-line
  }, []);

  const handleFieldChange = (event) => {
    event.preventDefault();
    setOrgDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleOrgUpdate = async () => {
    setLoading(true);

    const body = {
      title: orgDetails.title,
      email_domain_name: orgDetails.emailDomainName,
      organization_owner: owner?.id,
      default_task_types: defaultTask.map((item) => item.value),
      default_target_languages: translationLanguage.map((item) => item.value),
      default_transcript_type: transcriptSourceType,
      default_translation_type: translationSourceType,
    };

    const userObj = new EditOrganizationDetailsAPI(orgId, body);

    const res = await fetch(userObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(userObj.getBody()),
      headers: userObj.getHeaders().headers,
    });

    const resp = await res.json();

    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      setLoading(false);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
      setLoading(false);
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

  const handleCSVToggle = async () => {
    setEnableCSVUpload(!enableCSVUpload);
    const apiObj = new ToggleCSVUploadAPI(orgId, !enableCSVUpload);
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
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      {renderSnackBar()}
      <Card
        sx={{
          width: "100%",
          minHeight: 500,
          padding: 5,
          border: 0,
        }}
      >
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Typography variant="h3" align="center">
              Edit Organization
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              variant="outlined"
              fullWidth
              label="Title"
              name="title"
              value={orgDetails.title}
              onChange={handleFieldChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Owner</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={owner}
                label="Owner"
                onChange={(event) => setOwner(event.target.value)}
                MenuProps={MenuProps}
                renderValue={(selected) => {
                  return <Chip key={selected.id} label={selected.email} />;
                }}
              >
                {orgOwnerList.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item.email}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              variant="outlined"
              fullWidth
              label="Email Domain Name"
              name="emailDomainName"
              value={orgDetails.emailDomainName}
              onChange={handleFieldChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="translation-source-type">
                Select Transcription Source
              </InputLabel>
              <Select
                labelId="translation-source-type"
                id="translation-source-type_select"
                value={transcriptSourceType}
                label="Select Transcription Source"
                MenuProps={MenuProps}
                onChange={(event) =>
                  setTranscriptSourceType(event.target.value)
                }
              >
                {transcriptTypes.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="translation-source-type">
                Select Translation Source
              </InputLabel>
              <Select
                labelId="translation-source-type"
                id="translation-source-type_select"
                value={translationSourceType}
                label="Select Transcription Source"
                MenuProps={MenuProps}
                onChange={(event) =>
                  setTranslationSourceType(event.target.value)
                }
              >
                {translationTypes.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="default_workflow">Default Workflow</InputLabel>
              <Select
                multiple
                labelId="default_workflow"
                id="default_workflow_select"
                value={defaultTask}
                label="Default Workflow"
                onChange={(event) => setDefaultTask(event.target.value)}
                MenuProps={MenuProps}
                renderValue={(selected) => {
                  selected.sort((a, b) => a.id - b.id);
                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        return <Chip key={value.value} label={value.label} />;
                      })}
                    </Box>
                  );
                }}
              >
                {bulkTaskTypes.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    <Checkbox checked={defaultTask.indexOf(item) > -1} />
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FormControl fullWidth>
              <FormControlLabel
                sx={{ marginRight: "auto", marginLeft: 0 }}
                control={<Switch color="primary" />}
                label="Enable CSV Upload"
                labelPlacement="start"
                checked={enableCSVUpload}
                onChange={() => handleCSVToggle()}
              />
            </FormControl>
          </Grid>

          {defaultTask.filter((item) => item.value.includes("TRANSLATION"))
            .length > 0 && (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <InputLabel id="targetlanguages">
                  Select Translation Language
                </InputLabel>
                <Select
                  multiple
                  labelId="targetlanguages"
                  id="targetlanguages_select"
                  value={translationLanguage}
                  name="targetlanguages"
                  label="Target Languages"
                  onChange={(e) => setTranslationLanguage(e.target.value)}
                  MenuProps={MenuProps}
                  renderValue={(selected) => {
                    return (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          return <Chip key={value.value} label={value.label} />;
                        })}
                      </Box>
                    );
                  }}
                >
                  {supportedLanguages?.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      <Checkbox
                        checked={translationLanguage.indexOf(item) > -1}
                      />
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            style={{ padding: 32 }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleOrgUpdate()}
              style={{ borderRadius: "8px" }}
            >
              Update Organization{" "}
              {loading && (
                <Loader size={20} margin="0 0 0 10px" color="secondary" />
              )}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default EditOrganizationDetails;
