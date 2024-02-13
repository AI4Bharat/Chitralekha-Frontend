import { Card, CardContent, Grid, Typography } from "@mui/material";
import { testimonials } from "config";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router";
import { IntroDatasetStyle } from "styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const TestimonialCards = ({ testimonial }) => {
  const navigate = useNavigate();
  const classes = IntroDatasetStyle();

  return (
    <Card
      variant="outlined"
      className={classes.testimonialCardsWrapper}
      sx={{ cursor: "pointer" }}
      onClick={() => navigate("/testimonials")}
    >
      <CardContent style={{ padding: "32px", backgroundColor: "#CFE2FF" }}>
        <Typography className={classes.testimonialContent} marginBottom="20px">
          "{testimonial.shortContent}"
        </Typography>
        <Typography
          className={classes.testimonialContent2}
          textTransform="uppercase"
          fontWeight="bold"
        >
          {testimonial.name}
        </Typography>
        <Typography className={classes.testimonialContent2}>
          {testimonial.role}
        </Typography>
        <Typography className={classes.testimonialContent2}>
          {testimonial.organization}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const classes = IntroDatasetStyle();

  return (
    <Grid item xs={12} sx={{ my: 10 }}>
      <Typography variant="h4" className={classes.titles}>
        Testimonials
      </Typography>

      <Carousel
        stopAutoPlayOnHover
        animation="slide"
        navButtonsAlwaysVisible
        duration="1200"
        interval="12000"
        fullHeightHover
        navButtonsProps={{
          style: { borderRadius: "50%", width: "75px", height: "75px" },
        }}
        navButtonsWrapperProps={{
          style: { top: "-35px" },
        }}
        NextIcon={<ArrowForwardIosIcon />}
        PrevIcon={<ArrowBackIosNewIcon />}
        sx={{
          width: "50%",
          margin: "auto",
          height: "auto",
        }}
      >
        {testimonials.map((item, i) => (
          <TestimonialCards key={i} testimonial={item} />
        ))}
      </Carousel>
    </Grid>
  );
};

export default Testimonials;
