import React from "react";

//Components
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setTipsOff } from "redux/actions";

const TutorialTooltip = ({
  index,
  step,
  tooltipProps,
  primaryProps,
  backProps,
  size,
  skipProps,
}) => {
  const dispatch = useDispatch();
  const tipsOff = useSelector((state) => state.commonReducer.tips);

  return (
    <Card {...tooltipProps} sx={{ padding: "15px", borderRadius: "10px" }}>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {step.title}
        </Typography>
        <Typography variant="body2">{step.content}</Typography>

        <FormGroup sx={{ marginTop: "20px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tipsOff}
                onChange={(event) => dispatch(setTipsOff(event.target.checked))}
              />
            }
            label="Do not show this again!"
          />
        </FormGroup>
      </CardContent>

      <CardActions sx={{ paddingTop: 0 }}>
        <Button
          {...skipProps}
          sx={{
            backgroundColor: "transparent",
            color: "#000",
            boxShadow: "none",
            marginRight: "auto",
            "&:hover": { backgroundColor: "transparent", boxShadow: "none" },
          }}
        >
          Skip
        </Button>

        {index > 0 && (
          <Button
            {...backProps}
            sx={{
              backgroundColor: "transparent",
              color: "#000",
              boxShadow: "none",
              "&:hover": { backgroundColor: "transparent", boxShadow: "none" },
            }}
          >
            Back
          </Button>
        )}
        <Button {...primaryProps} sx={{ borderRadius: 2 }} variant="contained">
          {`Next (${index + 1}/${size})`}
        </Button>
      </CardActions>
    </Card>
  );
};

export default TutorialTooltip;
