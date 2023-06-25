import React from "react";
import { Grid, IconButton, Popover, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { onSubtitleChange } from "../utils/subtitleUtils";
import { setSubtitles } from "../redux/actions/Common";
import C from "../redux/constants";
import VideoLandingStyle from "../styles/videoLandingStyles";

const TagsSuggestionList = ({
  tagSuggestionsAnchorEl,
  setTagSuggestionList,
  index,
  filteredSuggestionByInput,
  setTagSuggestionsAnchorEl,
  textWithoutBackslash,
  saveTranscriptHandler,
}) => {
  const dispatch = useDispatch();
  const classes = VideoLandingStyle();

  const handleTagClick = (suggestion) => {
    const modifiedText = `${textWithoutBackslash}[${suggestion}]`;

    const sub = onSubtitleChange(modifiedText, index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    saveTranscriptHandler(false, false, sub);

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
          {filteredSuggestionByInput?.map((suggestion) => {
            return (
              <Typography
                onClick={() => handleTagClick(suggestion)}
                variant="body2"
                className={classes.suggestionListTypography}
              >
                {suggestion}
              </Typography>
            );
          })}
        </Grid>
      </Grid>
    </Popover>
  );
};

export default TagsSuggestionList;
