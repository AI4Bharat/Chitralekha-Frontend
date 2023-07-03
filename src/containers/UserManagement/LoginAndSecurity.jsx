import React, { useState } from "react";

//Styles
import { LoginStyle } from "styles";

//Components
import {
  Box,
  Card,
  Grid,
  Typography,
} from "@mui/material";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ChangePassword from "./ChangePassword";

const LoginAndSecurity = () => {
  const classes = LoginStyle();

  const [arrowDownRightIcon, setArrowDownRightIcon] = useState({
    email: false,
    phone: false,
    password: false,
  });

  const loginSecurityConfig = [
    // {
    //   title: "Email",
    //   name: "email",
    //   subTitle: "Changes Your Email",
    //   icon: <DraftsIcon fontSize="large" />,
    //   onClick: () =>
    //     setArrowDownRightIcon((prev) => ({
    //       ...prev,
    //       email: !arrowDownRightIcon.email,
    //     })),
    //   component: <></>,
    // },
    // {
    //   title: "Phone Number",
    //   name: "phone",
    //   subTitle: "Change Your Phone Number",
    //   icon: <LocalPhoneIcon fontSize="large" />,
    //   onClick: () =>
    //     setArrowDownRightIcon((prev) => ({
    //       ...prev,
    //       phone: !arrowDownRightIcon.phone,
    //     })),
    //   component: <></>,
    // },
    {
      title: "Change password",
      name: "password",
      subTitle:
        "It's a good idea to use a strong password that you're not using elsewhere",
      icon: (
        <VpnKeyOutlinedIcon
          sx={{ transform: "rotate(-70deg)" }}
          fontSize="large"
        />
      ),
      onClick: () =>
        setArrowDownRightIcon((prev) => ({
          ...prev,
          password: !arrowDownRightIcon.password,
        })),
      component: <ChangePassword />,
    },
  ];

  return (
    <Grid container direction="row">
      <Card className={classes.editProfileParentCard}>
        {loginSecurityConfig.map((item) => {
          return (
            <Grid
              container
              direction="row"
              borderBottom="1px solid rgb(224 224 224)"
              sx={{ p: 5, cursor: "pointer" }}
            >
              <Grid
                display="flex"
                item
                xs={11}
                sm={11}
                md={11}
                lg={11}
                xl={11}
                alignItems="center"
                onClick={item.onClick}
              >
                <Box>{item.icon}</Box>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body1">{item.title}</Typography>
                  <Typography
                    variant="body2"
                    className={classes.ChangePasswordSubText}
                  >
                    {item.subTitle}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={1} sm={1} md={1} lg={1} xl={1} onClick={item.onClick}>
                {arrowDownRightIcon[item.name] ? (
                  <ArrowRightIcon fontSize="large" sx={{ mt: 2 }} />
                ) : (
                  <ArrowDropDownIcon fontSize="large" sx={{ mt: 2 }} />
                )}
              </Grid>

              {arrowDownRightIcon[item.name] && item.component}
            </Grid>
          );
        })}
      </Card>
    </Grid>
  );
};

export default LoginAndSecurity;
