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
  Chip,
  Checkbox,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import CustomizedSnackbars from "../../common/Snackbar";
import OutlinedTextField from "../../common/OutlinedTextField";
import CustomButton from "../../common/Button";

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
  }, []);

  useEffect(() => {
    setOrgDetails({
      title: orgInfo.title,
      emailDomainName: orgInfo.email_domain_name,
    });

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
  }, [orgInfo, orgOwnerList]);

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
              value={owner}
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
          <Typography gutterBottom component="div" label="Required">
            Select Transcription Source
          </Typography>
          <FormControl fullWidth>
            <Select
              id="transcript-source-type"
              value={transcriptSourceType}
              onChange={(event) => setTranscriptSourceType(event.target.value)}
              MenuProps={MenuProps}
            >
              {transcriptTypes.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Select Translation Source
          </Typography>
          <FormControl fullWidth>
            <Select
              id="translation-source-type"
              value={translationSourceType}
              onChange={(event) => setTranslationSourceType(event.target.value)}
              MenuProps={MenuProps}
            >
              {translationTypes.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom component="div" label="Required">
            Default Workflow
          </Typography>
          <FormControl fullWidth>
            <Select
              multiple
              id="translation-source-type"
              value={defaultTask}
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
        </Box>

        {defaultTask.filter((item) => item.value.includes("TRANSLATION"))
          .length > 0 && (
          <Box width={"100%"} sx={{ mt: 3 }}>
            <Typography gutterBottom component="div" label="Required">
              Select Translation Language
            </Typography>
            <FormControl fullWidth>
              <Select
                fullWidth
                multiple
                value={translationLanguage}
                onChange={(event) => setTranslationLanguage(event.target.value)}
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
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
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Button
            color="primary"
            variant="contained"
            style={{ borderRadius: 6, margin: "0px 20px 0px 0px" }}
            onClick={() => handleOrgUpdate()}
            disabled={orgDetails.title && owner ? false : true}
          >
            Update Organization{" "}
            {loading && (
              <Loader size={20} margin="0 0 0 10px" color="secondary" />
            )}
          </Button>

          <CustomButton
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
