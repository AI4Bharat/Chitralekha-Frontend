import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";

const TutorialTooltip = ({
  index,
  step,
  tooltipProps,
  primaryProps,
  backProps,
  size,
  skipProps,
}) => {
  return (
    <Card {...tooltipProps} sx={{ padding: "15px", borderRadius: "10px" }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {step.title}
        </Typography>
        <Typography variant="body2">{step.content}</Typography>
      </CardContent>
      <CardActions>
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