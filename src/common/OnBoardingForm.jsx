import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { MenuProps, validatePhone } from "utils";
import { domains, usageList } from "config";
import {
  APITransport,
  FetchSupportedLanguagesAPI,
  OnBoardingAPI,
  setSnackBar,
} from "redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "utils/utils";
import { orgTypeList } from "config";
import CustomizedSnackbars from "./Snackbar";
import Loader from "./Spinner";

const initialState = {
  orgName: "",
  orgPortal: "",
  phone: "",
  email: "",
  orgType: "",
  domain: "",
  purpose: "",
  source: "",
  usage: {
    transcription: false,
    translation: false,
    voiceOver: false,
  },
  srcLanguage: "",
  tgtLanguage: "",
};

const initialErrorState = {
  email: false,
  phone: false,
};

const OnBoardingForm = ({ openOnboardingForm, handleClose }) => {
  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrorState);
  const [loading, setLoading] = useState(false);

  const snackbar = useSelector((state) => state.commonReducer.snackbar);
  const transcriptionLanguages = useSelector(
    (state) => state.getSupportedLanguages.transcriptionLanguage
  );
  const translationLanguages = useSelector(
    (state) => state.getSupportedLanguages.translationLanguage
  );

  useEffect(() => {
    const langObj = new FetchSupportedLanguagesAPI("TRANSCRIPTION");
    dispatch(APITransport(langObj));

    const translationlangObj = new FetchSupportedLanguagesAPI("TRANSLATION");
    dispatch(APITransport(translationlangObj));
    // eslint-disable-next-line
  }, []);

  const handleChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      const emailValidation = validateEmail(value);
      setErrors((prev) => {
        return {
          ...prev,
          [name]: !emailValidation,
        };
      });
    }

    if (name === "phone") {
      const phoneValidation = validatePhone(value);
      setErrors((prev) => {
        return {
          ...prev,
          [name]: !phoneValidation,
        };
      });
    }

    setFormFields((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCheckboxChange = (event) => {
    const {
      target: { name, checked },
    } = event;

    setFormFields((prev) => {
      return {
        ...prev,
        usage: {
          ...prev.usage,
          [name]: checked,
        },
      };
    });
  };

  const handleClear = () => {
    setFormFields(initialState);
    setErrors(initialErrorState);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const apiObj = new OnBoardingAPI(formFields);

    const response = await fetch(apiObj.endpoint);
    const data = await response.json();

    if (response.status === 200) {
      setLoading(false);
      dispatch(
        setSnackBar({ open: true, message: data.message, variant: "success" })
      );
      handleClose();
    } else {
      setLoading(false);
      dispatch(
        setSnackBar({ open: true, message: data.message, variant: "success" })
      );
      handleClose();
    }
  };

  const disableForm = () => {
    const { orgName, orgPortal, email, phone, usage, srcLanguage, tgtLanguage } = formFields;
    const usageSelected = Object.values(usage).includes(true)

    if (orgName === "" || orgPortal === "" || email === "" || phone === "" || usageSelected === false) {
      return true;
    }

    if (usage["translation"] === true) {
      if (srcLanguage === "" || tgtLanguage === "") {
        return true;
      }
    }

    if (loading) {
      return true;
    }

    return false;
  };

  const renderSnackBar = useCallback(() => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          dispatch(setSnackBar({ open: false, message: "", variant: "" }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={[snackbar.message]}
      />
    );

    //eslint-disable-next-line
  }, [snackbar]);

  return (
    <>
      {renderSnackBar()}
      <Dialog
        open={openOnboardingForm}
        onClose={handleClose}
        fullWidth
        maxWidth={"md"}
        PaperProps={{ style: { borderRadius: "10px" } }}
      >
        <DialogTitle variant="h4" display="flex" alignItems={"center"}>
          <Typography variant="h4">
            Request for Onboarding to Chitralekha
          </Typography>{" "}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ paddingTop: "20px" }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="orgName"
                label="Organization Name*"
                onChange={handleChange}
                value={formFields.orgName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="orgPortal"
                label="Organization Portal*"
                onChange={handleChange}
                value={formFields.orgPortal}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="email"
                label="Email Id*"
                onChange={handleChange}
                value={formFields.email}
                error={errors.email}
                helperText={errors.email ? "Invalid email" : ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="phone"
                label="Phone*"
                onChange={handleChange}
                value={formFields.phone}
                error={errors.phone}
                helperText={errors.phone ? "Invalid Phone Number" : ""}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="organization-type-select">
                  Organization Type
                </InputLabel>
                <Select
                  fullWidth
                  labelId="organization-type-select"
                  label="Organization Type"
                  name="orgType"
                  value={formFields.orgType}
                  onChange={handleChange}
                  MenuProps={MenuProps}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {orgTypeList.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="domain-select">Domain</InputLabel>
                <Select
                  fullWidth
                  labelId="domain-select"
                  label="Domain"
                  name="domain"
                  value={formFields.domain}
                  onChange={handleChange}
                  MenuProps={MenuProps}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {domains.map((item, index) => (
                    <MenuItem key={index} value={item.code}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12} style={{ paddingLeft: 0 }}>
              <FormControl
                sx={{ m: 3 }}
                component="fieldset"
                variant="standard"
              >
                <FormLabel component="legend">
                  What are you interested in using the tool for?*
                </FormLabel>
                <FormGroup row>
                  {usageList.map((item) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formFields.usage[item.value]}
                            onChange={handleCheckboxChange}
                            name={item.value}
                          />
                        }
                        label={item.label}
                      />
                    );
                  })}
                </FormGroup>
              </FormControl>
            </Grid>

            {formFields.usage.translation === true && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="src-lang-select">
                      Source Language
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="src-lang-select"
                      label="Source Language"
                      name="srcLanguage"
                      value={formFields.srcLanguage}
                      onChange={handleChange}
                      MenuProps={MenuProps}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      {transcriptionLanguages.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="tgt-lang-select">
                      Target Language
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="tgt-lang-select"
                      label="Target Language"
                      name="tgtLanguage"
                      value={formFields.tgtLanguage}
                      onChange={handleChange}
                      MenuProps={MenuProps}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      {translationLanguages.map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                label="How are you planning to use Chitralekha?"
                name="purpose"
                value={formFields.purpose}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                label="How did you come to know about Chitralekha?"
                name="source"
                value={formFields.source}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: "20px" }}>
          <Button
            variant="text"
            onClick={handleClear}
            sx={{ lineHeight: "1", borderRadius: "6px" }}
          >
            Clear
          </Button>

          <Button
            autoFocus
            variant="contained"
            sx={{ lineHeight: "1", marginLeft: "10px", borderRadius: "8px" }}
            onClick={handleSubmit}
            disabled={disableForm()}
          >
            Request{" "}
            {loading && (
              <Loader size={20} margin="0 0 0 10px" color="secondary" />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OnBoardingForm;
