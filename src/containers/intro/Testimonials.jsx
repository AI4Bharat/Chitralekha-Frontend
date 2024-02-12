import { Card, CardContent, Typography } from "@mui/material";
import { testimonials } from "config";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { IntroDatasetStyle } from "styles";

const TestimonialCards = ({ testimonial }) => {
  const classes = IntroDatasetStyle();

  return (
    <Card variant="outlined" className={classes.testimonialCardsWrapper}>
      <CardContent style={{ padding: "32px" }}>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="left"
          marginBottom="20px"
        >
          "{testimonial.content}"
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          textAlign="right"
          textTransform="uppercase"
          fontWeight="bold"
        >
          {testimonial.name},
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="right"
          fontStyle="italic"
        >
          {testimonial.role},
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="right"
          fontStyle="italic"
        >
          {testimonial.organization}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  const classes = IntroDatasetStyle();

  return (
    <>
      <Typography variant="h4" className={classes.titles} marginTop="72px">
        Testimonials
      </Typography>

      <Carousel
        stopAutoPlayOnHover
        animation="slide"
        navButtonsAlwaysVisible
        duration="900"
        navButtonsProps={{ style: { borderRadius: "50%" } }}
        sx={{
          width: "75%",
          margin: "auto",
          height: "auto",
        }}
      >
        {testimonials.map((item, i) => (
          <TestimonialCards key={i} testimonial={item} />
        ))}
      </Carousel>
    </>
  );
};

export default Testimonials;
