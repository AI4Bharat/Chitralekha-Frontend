import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FetchVideoDetailsAPI, APITransport } from "redux/actions";

const TaskVideoDialog = ({ videoName, videoUrl, projectId, lang }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const apiObj = new FetchVideoDetailsAPI(
      videoUrl,
      lang,
      projectId
    );
    dispatch(APITransport(apiObj));

    // eslint-disable-next-line
  }, [videoUrl, lang, projectId]);

  const video = useSelector((state) => state.getVideoDetails.data);

  return (
    <>
      <Grid container spacing={2} align="center"justify="center" >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 4 }}>
          <Typography variant="h4" style={{ marginRight: "auto" }}>
            {videoName}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 4 }} >
          <video
            style={{width:"500px",height:"300px"}}
            controls
            src={video.direct_video_url}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TaskVideoDialog;
