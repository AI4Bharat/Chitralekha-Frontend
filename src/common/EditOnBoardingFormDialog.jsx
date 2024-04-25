import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { MenuProps, validatePhone } from "utils";
import { validateEmail } from "utils/utils";
import { orgTypeList } from "config";
import { APITransport, UpdateOnboardingFormAPI } from "redux/actions";
import { useDispatch } from "react-redux";

const initialState = {
  orgName: "",
  orgPortal: "",
  phone: "",
  email: "",
  orgType: "",
};

const initialErrorState = {
  email: false,
  phone: false,
};

const EditOnBoardingFormDialog = ({ open, handleClose, formData }) => {
  const dispatch = useDispatch();

  const [formFields, setFormFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrorState);

  useEffect(() => {
    const fields = {
      orgName: formData.orgname,
      orgPortal: formData.org_portal,
      phone: formData.phone,
      email: formData.email,
      orgType: formData.org_type,
    };

    setFormFields(fields);
  }, [formData]);

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

  const handleClear = () => {
    setFormFields(initialState);
    setErrors(initialErrorState);
  };

  const handleSubmit = () => {
    const payload = {
      orgname: formFields.orgName,
      org_portal: formFields.orgPortal,
      email: formFields.phone,
      org_type: formFields.email,
      phone: formFields.orgType,
    };

    const apiObj = new UpdateOnboardingFormAPI(formData.id, payload);
    dispatch(APITransport(apiObj));
  };

  const disableForm = () => {
    const { orgName, orgPortal, email, phone } = formFields;

    if (orgName === "" || orgPortal === "" || email === "" || phone === "") {
      return true;
    }

    return false;
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={"md"}
        PaperProps={{ style: { borderRadius: "10px" } }}
      >
        <DialogTitle variant="h4" display="flex" alignItems={"center"}>
          <Typography variant="h4">Edit Form</Typography>

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
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditOnBoardingFormDialog;
