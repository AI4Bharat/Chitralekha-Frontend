import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import CustomButton from "../../common/Button";
import Spinner from "../../common/Spinner";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchUserDetailsAPI from "../../redux/actions/api/User/FetchUserDetails";
import { roles } from "../../utils/utils";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const userData = useSelector((state) => state.getUserDetails.data);
  const loggedInUserId = useSelector(
    (state) => state.getLoggedInUserDetails.data.id
  );

  const getUserData = () => {
    const userObj = new FetchUserDetailsAPI(id);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getUserData();
  }, [id]);

  useEffect(() => {
    if (userData) {
      setUserDetails(userData);
      setLoading(false);
    }
  }, [userData]);

  return (
    <Grid container spacing={2}>
      {loading && <Spinner />}
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{ p: 2 }}>
        <Card sx={{ borderRadius: "5px" }}>
          <CardContent>
            <Avatar
              alt="user_profile_pic"
              variant="contained"
              sx={{
                color: "#FFFFFF !important",
                bgcolor: "#2A61AD !important",
                width: 96,
                height: 96,
                mb: 2,
                fontSize: "3.25rem",
              }}
            >
              {userDetails?.first_name?.charAt(0)}
            </Avatar>
            <Typography variant="h3">
              {userDetails?.first_name} {userDetails?.last_name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {userDetails?.username}
            </Typography>
            <Typography
              variant="body1"
              sx={{ display: "flex", gap: "5px", alignItems: "center" }}
            >
              <MailOutlineIcon />
              {userDetails?.email}
            </Typography>
            {userDetails?.phone && (
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <PhoneOutlinedIcon />
                {userDetails?.phone}
              </Typography>
            )}

            {loggedInUserId == id && (
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <FormGroup>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Daily Mails"
                    labelPlacement="start"
                    sx={{ mt: 2 }}
                  />
                </FormGroup>
                <CustomButton
                  label="Edit Profile"
                  sx={{ mt: 2, ml: 6 }}
                  onClick={() => navigate("/edit-profile")}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={8} lg={8} xl={8} sx={{ p: 2 }}>
        <Card sx={{ minWidth: 275, borderRadius: "5px", mb: 2 }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {userDetails?.organization?.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                p: 1,
                backgroundColor: "rgb(56, 158, 13,0.2)",
                color: "rgb(56, 158, 13)",
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {roles.map((value) =>
                value.value === userDetails?.role ? value.label : ""
              )}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
