import React, { useEffect, useState } from "react";
import { IndicTransliterate } from "indic-transliterate";
import { useDispatch, useSelector } from "react-redux";
import { configs, endpoints } from "config";

//Styles
import { ProjectStyle } from "styles";

//Components
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Switch,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import C from "redux/constants";
import { setSubtitles } from "redux/actions";
import { useTheme, useMediaQuery } from '@mui/material';
import Loader from "./Spinner";

const FindAndReplace = (props) => {
  const classes = ProjectStyle();
  const theme = useTheme();

  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { subtitleDataKey, taskType } = { ...props };

  const transliterationLang = useSelector((state) => state.getTaskDetails.data);
  const sourceData = useSelector((state) => state.commonReducer.subtitles);

  const [subtitlesData, setSubtitlesData] = useState();
  const [showFindReplaceModel, setShowFindReplaceModel] = useState(false);
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [foundIndices, setFoundIndices] = useState([]);
  const [currentFound, setCurrentFound] = useState();
  const [replaceFullWord, setReplaceFullWord] = useState(true);
  const [transliterate, setTransliterate] = useState(true);
  const [loading, setLoading] = useState(false);

  const onReplacementDone = (updatedSource) => {
    dispatch(setSubtitles(updatedSource, C.SUBTITLES));
    setTimeout(() => {
      setLoading(false);
      // setShowLoading(false);
    }, 500);
  

  };
  const transliterationLanguage = !taskType?.includes("TRANSCRIPTION")
    ? transliterationLang?.target_language
    : transliterationLang?.src_language;
  useEffect(() => {
    setSubtitlesData(sourceData);
  }, [sourceData, subtitleDataKey]);

  const resetComponentValue = () => {
    setFindValue("");
    setReplaceValue("");
    setFoundIndices([]);
    setCurrentFound();
  };

  const handleCloseModel = () => {
    setShowFindReplaceModel(false);
    resetComponentValue();
  };
  const handleOpenModel = () => {
    setShowFindReplaceModel(true);
  };

  const onFindClick = () => {
    setLoading(true);
    const textToFind = findValue.toLowerCase().trim();
    const indexListInDataOfTextOccurence = [];
    subtitlesData.forEach((item, index) => {
      if (item[subtitleDataKey].toLowerCase().includes(textToFind)) {
        indexListInDataOfTextOccurence.push(index);
      }
    });

    setFoundIndices(indexListInDataOfTextOccurence);

    if (indexListInDataOfTextOccurence?.length > 0) {
      setCurrentFound(0);
    }
    setTimeout(() => {
      setLoading(false);
      // setShowLoading(false);
    }, 500);

  };
  useEffect(() => {
    if (foundIndices.length > 0 && currentFound === 0) {
      const scrollableElement = document.getElementById("subtitle_scroll_view");
      scrollableElement
        ?.querySelector(`#sub_${foundIndices[0]}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentFound, foundIndices]);
  

  const previousOccurenceClick = () => {
    setCurrentFound(currentFound - 1);
    const scrollableElement = document.getElementById("subtitle_scroll_view");
    scrollableElement
      .querySelector(`#sub_${foundIndices[currentFound - 1]}`)
      .scrollIntoView(true, { block: "start" });
  };

  const nextOccurenceClick = () => {
    setCurrentFound(currentFound + 1);
    const scrollableElement = document.getElementById("subtitle_scroll_view");
    scrollableElement
      .querySelector(`#sub_${foundIndices[currentFound + 1]}`)
      .scrollIntoView(true, { block: "start" });
  };

  const onReplaceClick = () => {
    setLoading(true);

    const currentSubtitleSource = [...subtitlesData];
    const updatedSubtitleData = [];

    currentSubtitleSource.forEach((ele, index) => {
      if (foundIndices[currentFound] === index) {
        let textToReplace;

        if (replaceFullWord) {
          if (transliterationLanguage === "en") {
            textToReplace = ele[subtitleDataKey].replace(
              new RegExp(`\\b${findValue.trim()}\\b`, "gi"),
              replaceValue.trim()
            );
          } else {
            textToReplace = ele[subtitleDataKey]
              .split(findValue.trim())
              .join(replaceValue.trim());
          }
        } else {
          textToReplace = ele[subtitleDataKey].replace(
            new RegExp(findValue.trim(), "gi"),
            replaceValue.trim()
          );
        }

        ele[subtitleDataKey] = textToReplace;
      }

      updatedSubtitleData.push(ele);
    });

    setSubtitlesData(updatedSubtitleData);
    onReplacementDone(updatedSubtitleData);
    // handleCloseModel();

  };

  const onReplaceAllClick = () => {
    setLoading(true);

    const currentSubtitleSource = [...subtitlesData];
    const updatedSubtitleData = [];

    currentSubtitleSource.forEach((ele, index) => {
      if (foundIndices?.includes(index)) {
        let textToReplace;

        if (replaceFullWord) {
          if (transliterationLanguage === "en") {
            textToReplace = ele[subtitleDataKey].replace(
              new RegExp(`\\b${findValue.trim()}\\b`, "gi"),
              replaceValue.trim()
            );
          } else {
            textToReplace = ele[subtitleDataKey]
              .split(findValue.trim())
              .join(replaceValue.trim());
          }
        } else {
          textToReplace = ele[subtitleDataKey].replace(
            new RegExp(findValue.trim(), "gi"),
            replaceValue.trim()
          );
        }

        ele[subtitleDataKey] = textToReplace;
      }
      updatedSubtitleData.push(ele);
    });

    setSubtitlesData(updatedSubtitleData);
    onReplacementDone(updatedSubtitleData);
    // handleCloseModel();
  };

  return (
    <>
      <Tooltip title="Find/Replace" placement="bottom">
        <IconButton
          className={classes.findReplaceButton}
          onClick={handleOpenModel}
        >
          <FindReplaceIcon className={classes.rightPanelSvg}/>
        </IconButton>
      </Tooltip>

      <Dialog
        open={showFindReplaceModel}
        onClose={handleCloseModel}
        aria-labelledby="responsive-dialog-title"
        maxWidth={"lg"}
        PaperProps={{ style: { borderRadius: "10px" } }}
      >
        <DialogTitle variant="h4" display="flex" alignItems={"center"}>
          <Typography variant="h4">Find and Replace</Typography>{" "}
          <IconButton
            aria-label="close"
            onClick={handleCloseModel}
            sx={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            // overflow: "hidden",
            position: "unset",
            // overscrollBehavior: "none",
          }}
        >
          <Grid container flexDirection={"flex"} justifyContent="space-around">
            <Grid item md={4} sx={{ margin: 2 }}>
              <Box className={classes.matchTypeSwitch}>
                <Typography variant="body2">Partial Word Replace</Typography>
                <Switch
                  checked={replaceFullWord}
                  onChange={(event) => setReplaceFullWord(event.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <Typography variant="body2">Full Word Replace</Typography>
              </Box>
              <Box className={classes.matchTypeSwitch}>
                <Typography variant="body2">Transliteration: OFF</Typography>
                <Switch
                  checked={transliterate}
                  onChange={() => setTransliterate(!transliterate)}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <Typography variant="body2">ON</Typography>
              </Box>

              <IndicTransliterate
                customApiURL={`${configs.BASE_URL_AUTO}${endpoints.transliteration}`}
                lang={transliterationLanguage}
                value={findValue}
                onChangeText={(text) => setFindValue(text)}
                enabled={transliterate && transliterationLanguage !== "en"}
                className={classes.findReplaceTextbox}
                renderComponent={(props) => (
                  <>
                    <label className={classes.findReplaceTextboxLabel}>
                      Find
                    </label>
                    <div>
                      <input {...props} />
                    </div>
                  </>
                )}
              />
              <Typography
                variant="caption"
                display={"flex"}
                sx={{ justifyContent: "end", paddingTop: 1 }}
              >
                {foundIndices?.length > 0 &&
                  `${currentFound + 1} / ${foundIndices?.length}`}
              </Typography>
              <Grid
                display={"flex"}
                justifyContent={
                  foundIndices?.length > 0 ? "space-between" : "center"
                }
                sx={{ textAlign: foundIndices?.length > 0 ? "center" : "end" }}
                paddingY={3}
              >
                {foundIndices?.length > 0 && (
                  <Button
                    variant="contained"
                    className={classes.findBtn}
                    disabled={currentFound === 0}
                    onClick={previousOccurenceClick}
                  >
                    <ChevronLeft />
                  </Button>
                )}
                <Button
                  variant="contained"
                  className={classes.findBtn}
                  disabled={!findValue}
                  onClick={onFindClick}
                  style={{ width: "auto" }}
                >
                  Find
                </Button>
                {foundIndices?.length > 0 && (
                  <Button
                    variant="contained"
                    className={classes.findBtn}
                    disabled={currentFound === foundIndices.length - 1}
                    onClick={nextOccurenceClick}
                  >
                    <ChevronRight />
                  </Button>
                )}
              </Grid>

              <IndicTransliterate
                customApiURL={`${configs.BASE_URL_AUTO}${endpoints.transliteration}`}
                lang={transliterationLanguage}
                value={replaceValue}
                onChangeText={(text) => setReplaceValue(text)}
                disabled={!(foundIndices?.length > 0)}
                enabled={transliterate && transliterationLanguage !== "en"}
                className={classes.findReplaceTextbox}
                renderComponent={(props) => (
                  <>
                    <label className={classes.findReplaceTextboxLabel}>
                      Replace
                    </label>
                    <div>
                      <input {...props} />
                    </div>
                  </>
                )}
              />

              <Grid
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                paddingY={3}
              >
                <Button
                  variant="contained"
                  className={classes.findBtn}
                  disabled={!replaceValue}
                  onClick={onReplaceClick}
                  style={{ width: "auto" }}
                >
                  {/* {loading ? <CircularProgress size={24} /> : "Replace"} */}
                   Replace
                </Button>
                <Button
                  variant="contained"
                  className={classes.findBtn}
                  disabled={!replaceValue}
                  onClick={onReplaceAllClick}
                  style={{ width: "auto" }}
                >
                {/* {loading ? <CircularProgress size={24} /> : "Replace All"} */}
                 Replace All
                </Button>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={7}
              width={"100%"}
              textAlign={"-webkit-center"}
              height={window.innerHeight * 0.7}
              sx={{ overflowY: "scroll" }}
              paddingBottom={5}
              id={"subtitle_scroll_view"}
              order={isSmallScreen ? 1 : 0}
            >
          {(!subtitlesData || loading) && (
                <div style={{
                  position: 'relative',
                  top: '50%',
                  zIndex: 1,
                  
                }}>
                  <Loader />
                </div>
              )} {!loading &&
                subtitlesData?.map((el, i) => (
                  <Box
                    key={i}
                    id={`sub_${i}`}
                    textAlign={"start"}
                    sx={{
                      marginY: 2,
                      padding: 2,
                      border: "1px solid #000000",
                      borderRadius: 2,
                      width: "75%",
                      backgroundColor: foundIndices.includes(i)
                        ? foundIndices[currentFound] === i
                          ? "yellow"
                          : "black"
                        : "#ffffff",
                      color: foundIndices.includes(i)
                        ? foundIndices[currentFound] === i
                          ? "red"
                          : "#ffffff"
                        : "black",
                    }}
                  >
                    {el[subtitleDataKey]}
                  </Box>
                ))}
            </Grid>
          </Grid>

        </DialogContent>
      </Dialog>
    </>
  );
};

export default FindAndReplace;
