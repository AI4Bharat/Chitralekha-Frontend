import React from "react";
import { useDispatch } from "react-redux";
import { onSubtitleChange } from "utils";

//Styles
import { VideoLandingStyle } from "styles";

//Components
import { Grid, IconButton, Popover, Tooltip, Typography } from "@mui/material";

//Icons
import CloseIcon from "@mui/icons-material/Close";

//Redux
import C from "redux/constants";
import { setSubtitles } from "redux/actions";

const TagsSuggestionList = ({
  tagSuggestionsAnchorEl,
  setTagSuggestionList,
  index,
  filteredSuggestionByInput,
  setTagSuggestionsAnchorEl,
  textWithoutBackslash,
  textAfterBackSlash,
  // saveTranscriptHandler,
  setEnableTransliterationSuggestion,
}) => {
  const dispatch = useDispatch();
  const classes = VideoLandingStyle();

  const handleTagClick = (suggestion) => {
    const modifiedText = `${textWithoutBackslash}[${suggestion}] ${textAfterBackSlash}`;

    const sub = onSubtitleChange(modifiedText, index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, false, sub);

    setEnableTransliterationSuggestion(true);
    setTagSuggestionsAnchorEl(null);
  };

  const handleClose = () => {
    setTagSuggestionsAnchorEl(null);
    setTagSuggestionList([]);
  };

  return (
    <Popover
      id={"suggestionList"}
      open={Boolean(tagSuggestionsAnchorEl)}
      anchorEl={tagSuggestionsAnchorEl}
      onClose={() => handleClose()}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <Grid width={200}>
        <Grid className={classes.suggestionListHeader}>
          <Typography variant="body1" sx={{ fontSize: "16px" }}>
            Select Tag
          </Typography>
          <Tooltip title="close suggestions">
            <IconButton onClick={() => setTagSuggestionsAnchorEl(null)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid maxHeight={250}>
          {Object.entries(filteredSuggestionByInput).map(([key, value]) => (
            <Typography
              onClick={() => handleTagClick(value)}
              variant="body2"
              className={classes.suggestionListTypography}
            >
              {key}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Popover>
  );
};

export default TagsSuggestionList;
