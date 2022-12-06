import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import FetchVideoDetailsAPI from "../redux/actions/api/Project/FetchVideoDetails";
import APITransport from "../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";

const TaskVideoDialog = ({ videoName, videoUrl, projectId, lang }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const apiObj = new FetchVideoDetailsAPI(
      videoUrl,
      lang,
      projectId
    );
    dispatch(APITransport(apiObj));
  }, [videoUrl, lang, projectId]);

  const video = useSelector((state) => state.getVideoDetails.data);

  return (
    <>
      <Grid container spacing={2} align="center" justify="center" >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 4 }}>
          <Typography variant="h4" style={{ marginRight: "auto" }}>
            {videoName}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 4 }}>
          <video
            controls
            src={video.direct_video_url}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TaskVideoDialog;
