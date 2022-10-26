import { Button, Card, Grid, Typography } from "@mui/material";
import React from "react";
import { Link, useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { id } = useParams();

  const projectData = {
    id,
    title: "test1",
    type: "video",
    mode: "test1",
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            width: "100%",
            padding: 5,
          }}
        >
          <Typography variant="h3">{projectData.title}</Typography>
          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"
            sx={{
              paddingTop: 2,
            }}
          >
            <Typography variant="body2" fontWeight="700" pr={1}>
              Project ID :
            </Typography>
            <Typography variant="body2">{projectData.id}</Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"
            sx={{
              paddingTop: 2,
            }}
          >
            <Typography variant="body2" fontWeight="700" pr={1}>
              Description :
            </Typography>
            <Typography variant="body2">{projectData.description}</Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"
            sx={{
              paddingTop: 2,
            }}
          >
            <Typography variant="body2" fontWeight="700" pr={1}>
              Project Type :
            </Typography>
            <Typography variant="body2">{projectData.type}</Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"
            sx={{
              paddingTop: 2,
            }}
          >
            <Typography variant="body2" fontWeight="700" pr={1}>
              Mode :
            </Typography>
            <Typography variant="body2">{projectData.mode}</Typography>
          </Grid>
          <Link to={""} style={{ textDecoration: "none" }}>
            <Button
              sx={{
                marginTop: 2,
                marginBottom: 2,
                padding: 1,
                backgroundColor: "primary.main",
                borderRadius: 2,
              }}
              variant="contained"
            >
              <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
                Show Project Settings
              </Typography>
            </Button>
          </Link>
        </Card>
      </Grid>
    </>
  );
};

export default ProjectDetails;
