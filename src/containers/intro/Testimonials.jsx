import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { IntroDatasetStyle } from "styles";

const TestimonialCards = () => {
  const classes = IntroDatasetStyle();

  return (
    <Card variant="outlined" className={classes.testimonialCardsWrapper}>
      <CardContent sx={{ padding: 0 }}>
        <Typography gutterBottom>
          The best things about Exotel are – Click to Call for KYC, IVR
          campaign, App Bazaar, Lite dashboard, which specifically showcases
          call flow monitoring, agent performance monitoring, reporting, easy to
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

const Testimonials = () => {
  const items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      img: "",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: "",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: "",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: "",
    },
  ];

  return (
    <Carousel
      autoPlay={false}
      stopAutoPlayOnHover
      animation="slide"
      navButtonsAlwaysVisible
      duration="900"
      navButtonsProps={{ style: { borderRadius: "50%" } }}
      sx={{
        width: "75%",
        margin: "auto",
        marginTop: "72px",
        height: "auto",
      }}
    >
      {items.map((item, i) => (
        <TestimonialCards key={i} item={item} />
      ))}
    </Carousel>
  );
};

export default Testimonials;
