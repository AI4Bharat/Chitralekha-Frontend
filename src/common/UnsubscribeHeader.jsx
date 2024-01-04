import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { headerStyle } from "styles";

const UnsubscribeHeader = () => {
  const classes = headerStyle();
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters className={classes.toolbar}>
          <Box
            className={classes.logoContainer}
            onClick={() => navigate("/login")}
          >
            <Box className={classes.imageBox}>
              <img
                src={"Chitralekha_Logo_Transparent.png"}
                alt="ai4bharat"
                className={classes.Logo}
              />
              <Typography variant="h4" sx={{ color: "black" }}>
                Chitralekha
              </Typography>
            </Box>
            <Box>
              <Typography className={classes.poweredByText}>
                Powered by EkStep Foundation
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default UnsubscribeHeader;
