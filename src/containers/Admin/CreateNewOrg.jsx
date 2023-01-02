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
import FetchTranscriptTypesAPI from "../../redux/actions/api/Project/FetchTranscriptTypes";
import FetchTranslationTypesAPI from "../../redux/actions/api/Project/FetchTranslationTypes";
import FetchBulkTaskTypeAPI from "../../redux/actions/api/Project/FetchBulkTaskTypes";
import FetchSupportedLanguagesAPI from "../../redux/actions/api/Project/FetchSupportedLanguages";

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
  const transcriptTypes = useSelector((state) => state.getTranscriptTypes.data);
  const translationTypes = useSelector(
    (state) => state.getTranslationTypes.data
  );
  const bulkTaskTypes = useSelector((state) => state.getBulkTaskTypes.data);
  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );

  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [emailDomainName, setEmailDomainName] = useState("");
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

  useEffect(() => {
    const apiObj = new FetchOrgOwnersAPI();
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

  const handleCreateProject = async () => {
    const reqBody = {
      title,
      email_domain_name: emailDomainName,
      organization_owner: owner,
      default_transcript_type: transcriptSourceType,
      default_translation_type: translationSourceType,
      default_task_types: defaultTask,
      default_target_languages: translationLanguage,
    }

    const apiObj = new CreateNewOrganizationAPI(reqBody);

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
            Default Task
          </Typography>
          <FormControl fullWidth>
            <Select
              multiple
              id="translation-source-type"
              value={defaultTask}
              onChange={(event) => setDefaultTask(event.target.value)}
              MenuProps={MenuProps}
            >
              {bulkTaskTypes.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {defaultTask.filter((item) => item.includes("TRANSLATION")).length >
          0 && (
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
              >
                {supportedLanguages?.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

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
