import {
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import CustomButton from "./Button";

export const TutorialTooltip = ({
  index,
  step,
  tooltipProps,
  primaryProps,
  backProps,
  size,
  skipProps,
}) => {
  return (
    <Card {...tooltipProps} sx={{padding: "15px", borderRadius: "10px"}}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {step.title}
        </Typography>
        <Typography variant="body2">{step.content}</Typography>
      </CardContent>
      <CardActions>
        <CustomButton
          {...skipProps}
          sx={{
            backgroundColor: "transparent",
            color: "#000",
            boxShadow: "none",
            marginRight: "auto",
            "&:hover": { backgroundColor: "transparent", boxShadow: "none" },
          }}
          label="Skip"
        />
        {index > 0 && (
          <CustomButton
            {...backProps}
            sx={{
              backgroundColor: "transparent",
              color: "#000",
              boxShadow: "none",
              "&:hover": { backgroundColor: "transparent", boxShadow: "none" },
            }}
            label="Back"
          />
        )}
        <CustomButton
          {...primaryProps}
          sx={{ borderRadius: 2 }}
          label={`Next (${index + 1}/${size})`}
        />
      </CardActions>
    </Card>
  );
};
