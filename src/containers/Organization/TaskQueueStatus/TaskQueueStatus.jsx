import React, { useState } from "react";

import { DatasetStyle } from "styles";

//Components
import { Box, Card, Grid, Tab, Tabs, Typography } from "@mui/material";
import { TabPanel } from "common";
import QueueStatusTable from "./QueueStatusTable";

const TaskQueueStatus = () => {
  const classes = DatasetStyle();

  const [value, setValue] = useState(0);

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom component="div">
          Task Queue Status
        </Typography>

        <Box>
          <Tabs
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
          >
            <Tab
              label={"Transcription"}
              className={classes.taskQueueStatusTabs}
            />
            <Tab
              label={"Translation"}
              className={classes.taskQueueStatusTabs}
            />
            <Tab
              label={"Voice-Over"}
              className={classes.taskQueueStatusTabs}
            />
            {/* <Tab
              label={"VoiceOver Integration Queue"}
              className={classes.taskQueueStatusTabs}
            /> */}
          </Tabs>
        </Box>

        <TabPanel
          value={value}
          index={0}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <QueueStatusTable queueType={"asr"} />
        </TabPanel>

        <TabPanel
          value={value}
          index={1}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <QueueStatusTable queueType={"nmt"} />
        </TabPanel>

        <TabPanel
          value={value}
          index={2}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <QueueStatusTable queueType={"tts"} />
        </TabPanel>

        {/* <TabPanel
          value={value}
          index={3}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <QueueStatusTable queueType={"integration"} />
        </TabPanel> */}
      </Card>
    </Grid>
  );
};

export default TaskQueueStatus;
