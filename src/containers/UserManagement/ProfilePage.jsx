import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
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
import EditIcon from "@mui/icons-material/Edit";
import { getProfile } from "../../utils/utils";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);

  const userData = useSelector((state) => state.getUserDetails.data);
  const loggedInUser = useSelector(
    (state) => state.getLoggedInUserDetails.data
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

  useEffect(() => {
    if (userDetails) {
      const temp = getProfile(userDetails);
      setProfile(temp);
    }
  }, [userDetails]);

  const renderProfileCard = () => {
    if (!userDetails || userDetails.length <= 0)
      return <Spinner margin={"100px 0 "} />;

    return (
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
      </CardContent>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{ p: 2 }}>
        <Card sx={{ borderRadius: "5px" }}>{renderProfileCard()}</Card>
      </Grid>

      <Grid item xs={12} sm={12} md={8} lg={8} xl={8} sx={{ p: 2 }}>
        <Card sx={{ minWidth: 275, borderRadius: "5px", mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ paddingBottom: "10px" }}
            >
              <Typography variant="h4">Profile</Typography>

              {(loggedInUser.id === +id || loggedInUser.role === "ADMIN") && (
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "5px",
                    lineHeight: "1px",
                    fontSize: "16px",
                  }}
                  onClick={() => navigate(`/edit-profile/${id}`)}
                >
                  <EditIcon style={{ width: "15px", marginRight: "5px" }} />
                  Edit
                </Button>
              )}
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              paddingTop="10px"
            >
              {profile.map((item) => {
                return (
                  <Box width="30%" padding="10px 10px 20px 10px">
                    <Typography
                      variant="body1"
                      color="rgba(0, 0, 0, 0.54)"
                      fontWeight="500"
                      fontSize="18px"
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      fontSize="18px"
                    >
                      {item.value}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
