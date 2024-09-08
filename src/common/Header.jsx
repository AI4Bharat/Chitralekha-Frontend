import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Styles
import { headerStyle } from "styles";
import { useTheme } from "@emotion/react";

//Components
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Container,
  Grid,
  useMediaQuery,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MobileNavbar from "./MobileNavbar";
import HelpDialog from "./HelpDialog"
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

//APIs
import C from "redux/constants";
import { APITransport, FetchLoggedInUserDetailsAPI } from "redux/actions";

const Header = () => {
  const classes = headerStyle();
  const dispatch = useDispatch();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElHelp, setAnchorElHelp] = useState(null);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  // const userData = JSON.parse(localStorage.getItem("userData"));
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const fullscreen = useSelector((state) => state.commonReducer.fullscreen);

  const getLoggedInUserData = () => {
    const loggedInUserObj = new FetchLoggedInUserDetailsAPI();
    dispatch(APITransport(loggedInUserObj));
  };

  useEffect(() => {
    getLoggedInUserData();
    // eslint-disable-next-line
  }, []);

  if(localStorage.getItem("source") !== undefined){
    localStorage.setItem("source", "chitralekha-frontend");
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleClickHelp = ()=>{
    setAnchorElUser(null);
    setOpenHelpDialog(true)
    
  }

  const handleClose = () => {
    setOpenHelpDialog(false);
  };

  const handleOpenHelpMenu = (event) => {
    setAnchorElHelp(event.currentTarget);
  };

  const handleCloseHelpMenu = () => {
    setAnchorElHelp(null);
  };

  const HelpMenu = [
    {
      name: "Wiki",
      onClick: () => {
        handleCloseUserMenu();
        window.open("https://github.com/AI4Bharat/Chitralekha/wiki", "blank");
      },
    },
    {
      name: "Help",
      onClick: () => {
        handleClickHelp();
       
      },
    },
  ];

  const SettingsMenu = [
    {
      name: "Settings",
      onClick: () => {
        handleCloseUserMenu();
      },
    },
  ];

  const UserMenu = [
    {
      name: "My Profile",
      onClick: () => {
        handleCloseUserMenu();
        navigate(`/profile/${userData?.id}`);
      },
    },
    {
      name: "My Glossary",
      onClick: () => {
        handleCloseUserMenu();
        navigate(`/profile/${userData?.id}/my-glossary`);
      },
    },
    {
      name: "Bookmarked Segment",
      onClick: () => {
        handleCloseUserMenu();
        let endpoint = "";
        if(userData?.user_history?.task_type.includes("TRANSCRIPTION")){
          endpoint = "transcript";  
        }else if(userData?.user_history?.task_type.includes("VOICEOVER")){
          endpoint = "voiceover";  
        }else{
          endpoint = "translate";
        }
        navigate(`/task/${userData?.user_history?.task_id}/${endpoint}/${userData?.user_history?.offset}/${userData?.user_history?.segment}`);
      },
    },
    {
      name: "Logout",
      onClick: () => {
        handleCloseUserMenu();
        localStorage.clear();
        dispatch({ type: C.LOGOUT });
        navigate("/login");
      },
    },
  ];

  return (
    <Grid container direction="row" style={{ zIndex: 1 }}>
    <Box>
      {isMobile ? (
        <MobileNavbar SettingsMenu={SettingsMenu} UserMenu={UserMenu} userData={userData} />
      ) : (
        <AppBar
          position="fixed"
          sx={
            fullscreen
              ? {
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  visibility: "hidden",
                }
              : { zIndex: (theme) => theme.zIndex.drawer + 1 }
          }
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters className={classes.toolbar}>
              <Box
                display="flex"
                flexDirection="row"
                flexWrap={"wrap"}
                alignItems="center"
                justifyContent="space-evenly"  // Add justifyContent to distribute space between items
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={"Chitralekha_Logo_Transparent.png"}
                  alt="ai4bharat"
                  className={classes.Logo}
                />
                <Typography variant="h4" sx={{ color: "black" }}>
                  Chitralekha
                </Typography>
                <Typography sx={{ fontSize: "0.7rem", fontWeight: "500", color: "#000000", margin: "auto" }}>
                  Powered by EkStep Foundation
                </Typography>
              </Box>



              <Grid
                container
                direction="row"
                justifyContent="center"
                columnGap={2}
                rowGap={2}
              >
  
                <>
                  <Typography variant="body1">
                    <NavLink
                      to={`/my-organization/${userData?.organization?.id}`}
                      className={({ isActive }) =>
                        isActive
                          ? `${classes.highlightedMenu} organizations`
                          : `${classes.headerMenu} organizations`
                      }
                    >
                      Organizations
                    </NavLink>
                  </Typography>
                  <Typography variant="body1">
                  <NavLink
                    to={`/task-list`}
                    className={({ isActive }) =>
                      isActive
                        ? `${classes.highlightedMenu} task-list`
                        : `${classes.headerMenu} task-list`
                    }
                  >
                    Tasks
                  </NavLink>
                </Typography>
                {userData?.role == "ADMIN" && <Typography variant="body1">
                    <NavLink
                      to={`/admin`}
                      className={({ isActive }) =>
                        isActive
                          ? `${classes.highlightedMenu} organizations`
                          : `${classes.headerMenu} organizations`
                      }
                    >
                      Admin
                    </NavLink>
                  </Typography>}
                </>
                {/* <Typography variant="body1">
                  <NavLink
                    to="/projects"
                    className={({ isActive }) =>
                      isActive
                        ? `${classes.highlightedMenu} projects`
                        : `${classes.headerMenu} projects`
                    }
                  >
                    Projects
                  </NavLink>
                </Typography> */}
                {/* <Typography variant="body1">
                  <NavLink
                    to="#"
                    className={`${classes.headerMenu} workspace`}
                  >
                    Analytics
                  </NavLink>
                </Typography> */}
              </Grid>

              <Box className={classes.avatarBox}>
                { userData?.role === "ADMIN" || userData?.role === "ORG_OWNER" || userData?.role === "PROJECT_MANAGER" ? <IconButton
                  onClick={() => navigate('/task-queue-status')}
                  className={`${classes.icon} help`}
                >
                  <Tooltip title="Task Queue Status">                    
                    <HourglassBottomIcon color="primary" className={classes.icon2}/>
                  </Tooltip>
                </IconButton> : "" }

                <IconButton
                  onClick={handleOpenHelpMenu}
                  className={`${classes.icon} help`}
                >
                  <Tooltip title="Help">
                    <HelpOutlineIcon color="primary" className={classes.icon} />
                  </Tooltip>
                </IconButton>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElHelp}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElHelp)}
                  onClose={handleCloseHelpMenu}
                >
                  {HelpMenu.map((item, index) => (
                    <MenuItem key={index} onClick={item.onClick}>
                      <Typography variant="body2" textAlign="center">
                        {item.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>

                {/* <IconButton
                  onClick={handleOpenSettingsMenu}
                  className={`${classes.icon} settings`}
                >
                  <Tooltip title="Settings">
                    <SettingsOutlinedIcon
                      color="primary"
                      className={classes.icon}
                    />
                  </Tooltip>
                </IconButton>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElSettings}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElSettings)}
                  onClose={handleCloseSettingsMenu}
                >
                  {SettingsMenu.map((item, index) => (
                    <MenuItem key={index} onClick={item.onClick}>
                      <Typography variant="body2" textAlign="center">
                        {item.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu> */}

                <IconButton
                  onClick={handleOpenUserMenu}
                  className={`${classes.icon} profile`}
                  sx={{ marginLeft: "20px" }}
                >
                  <Avatar>{userData?.first_name?.charAt(0)}</Avatar>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "rgb(39, 30, 79)",
                      marginLeft: "10px",
                      fontSize: "1.25rem",
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: "400",
                    }}
                  >
                    {userData.first_name} {userData.last_name}
                  </Typography>
                </IconButton>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {UserMenu.map((item, index) => (
                    <MenuItem key={index} onClick={item.onClick}>
                      <Typography variant="body2" textAlign="center">
                        {item.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </Box>
    {openHelpDialog &&
    <HelpDialog
    openHelpDialog={openHelpDialog}
    handleClose={() => handleClose()}
    setOpenHelpDialog= {setOpenHelpDialog}
    />}
    </Grid>
  );
};
export default Header;
