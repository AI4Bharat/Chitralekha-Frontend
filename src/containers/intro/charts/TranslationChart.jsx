import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  LabelList,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";
import { ChartStyles } from "styles";
import { APITransport, FetchSupportedLanguagesAPI } from "redux/actions";

const colors = [
  "188efc",
  "7a47a4",
  "b93e94",
  "1fc6a4",
  "f46154",
  "d088fd",
  "f3447d",
  "188efc",
  "f48734",
  "189ac9",
  "0e67bd",
];

const TranslationChart = ({ chartData, loading }) => {
  const classes = ChartStyles();
  const dispatch = useDispatch();

  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.translationLanguages
  );

  const [orgList, setOrgList] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [count, setCount] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedSourceLang, setSelectedSourceLang] = useState("English");
  const [asPer, setAsPer] = useState("Count");
  const [sourceData, setSourceData] = useState([]);
  const [countPerOrgLang, setCountPerOrgLang] = useState(0);
  const [durationPerOrgLang, setDurationPerOrgLang] = useState(0);
  const [axisValue] = useState({
    yAxis: "Number of Translations",
    xAxis: "Language",
  });

  useEffect(() => {
    let arr2 = [];
    let orgCount = 0;
    let orgDuration = 0;

    chartData.forEach((item) => {
      let taskCount = 0;
      let taskDuration = 0;

      item.data.forEach((value) => {
        taskCount = taskCount + value.transcripts_translated.value;
        taskDuration = taskDuration + value.translation_duration.value;
      });

      orgCount += taskCount;
      orgDuration += taskDuration;

      arr2.push(item.org);
    });

    setSelectedOrg(arr2[0]);
    setOrgList(arr2);
    setCount(orgCount);
    setDuration(orgDuration);
  }, [chartData]);

  useEffect(() => {
    let totalCountByOrgLang = 0;
    let totalDurationByOrgLang = 0;

    const filteredData = chartData.filter((item) => {
      return item.org === selectedOrg;
    });

    const res = filteredData[0]?.data.filter(
      (item) => item.src_language.value === selectedSourceLang
    );

    if (asPer === "Count") {
      res?.sort(
        (a, b) =>
          b.transcripts_translated.value - a.transcripts_translated.value
      );
    } else {
      res?.sort(
        (a, b) => b.translation_duration.value - a.translation_duration.value
      );
    }

    let arr = [];

    res?.forEach((item) => {
      const { tgt_language, transcripts_translated, translation_duration } =
        item;

      totalCountByOrgLang += transcripts_translated.value;
      totalDurationByOrgLang += translation_duration.value;

      if (asPer === "Count") {
        arr.push({
          [tgt_language.label]: tgt_language.value,
          [transcripts_translated.label]: transcripts_translated.value,
        });
      } else {
        arr.push({
          [tgt_language.label]: tgt_language.value,
          [translation_duration.label]: translation_duration.value,
        });
      }
    });

    setCountPerOrgLang(totalCountByOrgLang);
    setDurationPerOrgLang(totalDurationByOrgLang.toFixed(2));
    setSourceData(arr);
  }, [chartData, selectedSourceLang, selectedOrg, asPer]);

  useEffect(() => {
    const apiObj = new FetchSupportedLanguagesAPI("TRANSLATION");
    dispatch(APITransport(apiObj));

    //eslint-disable-next-line
  }, []);

  const CustomizedAxisTick = (props) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-35)"
        >
          {payload.value &&
            payload.value.substr(0, 14) +
              (payload.value.length > 14 ? "..." : "")}
        </text>
      </g>
    );
  };

  return (
    <Box className={classes.modelChartSection}>
      <Box>
        <Typography variant="h4" className={classes.heading}>
          Translations Report
          <Typography variant="body1">
            Total count of completed Subtitle Translation Tasks for a given
            language
          </Typography>
        </Typography>

        <Typography variant="body2">
          Note : The translation is done on top of the transcript which is in
          the language of the video
        </Typography>
      </Box>

      <Paper>
        <Box className={classes.topBar}>
          <Box className={classes.topBarInnerBox}>
            <Typography
              style={{ fontSize: "1rem", fontWeight: "600", padding: "16px 0" }}
            >
              Translations Dashboard
            </Typography>
          </Box>
          {asPer === "Count" ? (
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total count of completed Translation Tasks
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {sourceData ? new Intl.NumberFormat("en").format(count) : 0}
              </Typography>
            </Box>
          ) : (
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total duration of completed Translation Tasks
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {sourceData
                  ? new Intl.NumberFormat("en").format(duration.toFixed(2))
                  : 0}{" "}
                Hours
              </Typography>
            </Box>
          )}
        </Box>

        <Grid
          container
          direction="row"
          alignItems={"center"}
          sx={{ textAlign: "left", margin: { xs: 2, md: 5 } }}
        >
          <Typography variant="h6">
            Number of Translations per language in
          </Typography>

          <Box>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
              <Select
                id="sourcel-language-select"
                value={selectedOrg}
                label="Source Language"
                onChange={(event) => setSelectedOrg(event.target.value)}
                sx={{
                  textAlign: "left",
                  border: "0px solid transparent",
                }}
              >
                {orgList?.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <Typography variant="h6">with</Typography>

          <Box>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
              <Select
                id="sourcel-language-select"
                value={selectedSourceLang}
                label="Source Language"
                onChange={(event) => setSelectedSourceLang(event.target.value)}
                sx={{
                  textAlign: "left",
                  border: "0px solid transparent",
                }}
              >
                {supportedLanguages?.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.label}>
                      {item.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <Typography variant="h6">as per</Typography>

          <Box>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
              <Select
                id="type-select"
                value={asPer}
                onChange={(event) => setAsPer(event.target.value)}
                sx={{
                  textAlign: "left",
                  border: "0px solid transparent",
                }}
              >
                <MenuItem value="Count">Count</MenuItem>
                <MenuItem value="Duration">Duration</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Typography
            style={{
              fontSize: "1.125rem",
              fontWeight: "400",
              marginRight: "10px",
            }}
          >
            (
            {asPer === "Count"
              ? countPerOrgLang
              : `${durationPerOrgLang} Hours`}
            )
          </Typography>
        </Grid>

        <Box style={{ margin: "20px" }}>
          {!loading ? (
            <ResponsiveContainer width={"100%"} height={600}>
              <BarChart
                width={900}
                height={400}
                data={sourceData}
                fontSize="14px"
                fontFamily="Roboto"
                maxBarSize={100}
              >
                <XAxis
                  dataKey="Target Language"
                  textAnchor={"end"}
                  tick={<CustomizedAxisTick />}
                  height={100}
                  interval={0}
                  position="insideLeft"
                  type="category"
                >
                  <Label
                    value={axisValue.xAxis}
                    position="insideBottom"
                    fontWeight="bold"
                    fontSize={16}
                  ></Label>
                </XAxis>

                <YAxis
                  padding={{ top: 80 }}
                  tickInterval={10}
                  allowDecimals={false}
                  type="number"
                  dx={0}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en", { notation: "compact" }).format(
                      value
                    )
                  }
                >
                  <Label
                    value={axisValue.yAxis}
                    angle={-90}
                    position="insideLeft"
                    fontWeight="bold"
                    fontSize={16}
                  ></Label>
                </YAxis>

                <Tooltip
                  contentStyle={{ fontFamily: "Roboto", fontSize: "14px" }}
                  formatter={(value) =>
                    new Intl.NumberFormat("en").format(value)
                  }
                  cursor={{ fill: "none" }}
                />

                <Bar
                  margin={{ top: 140, left: 20, right: 20, bottom: 20 }}
                  dataKey={
                    asPer === "Count"
                      ? "Translation Tasks Count"
                      : "Translated Duration (Hours)"
                  }
                  cursor="pointer"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={65}
                  isAnimationActive={true}
                >
                  <LabelList
                    formatter={(value) =>
                      new Intl.NumberFormat("en").format(value)
                    }
                    cursor={{ fill: "none" }}
                    position="top"
                    dataKey="value"
                    fill="black"
                    style={{ textAnchor: "start" }}
                    angle={-30}
                    clockWise={4}
                  />
                  {sourceData?.length > 0 &&
                    sourceData?.map((entry, index) => {
                      const color = colors[index < 9 ? index : index % 10];
                      return <Cell key={index} fill={`#${color}`} />;
                    })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box display="flex" justifyContent="center">
              <CircularProgress
                color="primary"
                size={50}
                style={{ margin: "20%" }}
              />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TranslationChart;
