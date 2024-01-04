import React, { useCallback, useEffect, useState } from "react";
import { categoryConfig } from "config";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

//styles
import { LoginStyle } from "styles";

//Components
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { CustomizedSnackbars, UnsubscribeHeader } from "common";

//APIs
import { APITransport, UnSubscribeNewletterFromEmailAPI } from "redux/actions";

const Unsubscribe = () => {
  const classes = LoginStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const email = searchParams.get("email");
  const categoryParam = searchParams.get("categories");
  const category = categoryParam ? categoryParam.split(",") : [];

  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;
    if (!progress) {
      if (success) {
        if (apiType === "UNSUBSCRIBE_FROM_EMAIL") {
          navigate("/login");
        }
      } else {
        if (apiType === "UNSUBSCRIBE_FROM_EMAIL") {
          setSnackbarInfo({
            open: true,
            message: data.message,
            variant: "error",
          });
        }
      }
    }
    // eslint-disable-next-line
  }, [apiStatus]);

  const [selectedCategory, setSelectedCategory] = useState({
    downtime: category.includes("Downtime"),
    release: category.includes("Release"),
    general: category.includes("General"),
  });
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "",
  });

  const handleChange = (event) => {
    setSelectedCategory({
      ...selectedCategory,
      [event.target.name]: event.target.checked,
    });
  };

  const handleUnsubscribe = () => {
    const categories = ["Downtime", "Release", "General"]
      .filter((item) => selectedCategory[item.toLowerCase()])
      .join(",");

    const apiObj = new UnSubscribeNewletterFromEmailAPI(email, categories);
    dispatch(APITransport(apiObj));
  };

  const renderSnackBar = useCallback(() => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={[snackbar.message]}
      />
    );
  }, [snackbar]);

  return (
    <Box className={classes.unsubscribeWrapper}>
      {renderSnackBar()}

      <UnsubscribeHeader />
      <Card className={classes.editProfileParentCard} style={{ width: "75%" }}>
        <Grid className={classes.editProfileParentGrid} container>
          <Grid item xs={12} md={6}>
            <Grid container style={{ padding: "5% 0 0 10%" }}>
              <Grid item xs={12}>
                <Typography variant="h2">Unsubscribe</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", margin: "5% 0" }}
                >
                  Do you want to unsubscribe from this mailing list?
                </Typography>
              </Grid>

              <Grid item xs={12} marginLeft={"5%"}>
                <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                  Please select Categories below.
                </Typography>

                <FormGroup>
                  {categoryConfig.map((item) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedCategory[item.name]}
                            onChange={handleChange}
                            name={item.name}
                            disabled={!category.includes(item.label)}
                          />
                        }
                        className={classes.categoryCheckbox}
                        label={item.label}
                      />
                    );
                  })}
                </FormGroup>
              </Grid>

              <Grid item xs={12} sx={{ padding: "5% 0" }}>
                <Button variant="contained" onClick={handleUnsubscribe}>
                  Unsubscribe
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} display="flex">
            <img
              src="mail.jpg"
              alt="mail"
              style={{ width: "50%", margin: "auto" }}
            />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default Unsubscribe;
