import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Container, Box } from "@mui/material";
import { IntroDatasetStyle } from "styles";

const testimonials = [
  {
    name: "CAYLIN WHITE",
    title: "Head Marketing Buff",
    company: "WP Buffs",
    avatar: "url_to_caylin_image",
    testimonial: "I have been in sales and marketing for over 12 years...",
  },
  {
    name: "DOUG DOTTS",
    title: "Director of Client Outcomes",
    company: "Unific",
    avatar: "url_to_doug_image",
    testimonial: "Now that we have Service Hub in addition...",
  },
  {
    name: "DOUG DOTTS",
    title: "Director of Client Outcomes",
    company: "Unific",
    avatar: "url_to_doug_image",
    testimonial: "Now that we have Service Hub in addition...",
  },
  {
    name: "DOUG DOTTS",
    title: "Director of Client Outcomes",
    company: "Unific",
    avatar: "url_to_doug_image",
    testimonial: "Now that we have Service Hub in addition...",
  },
  {
    name: "DOUG DOTTS",
    title: "Director of Client Outcomes",
    company: "Unific",
    avatar: "url_to_doug_image",
    testimonial: "Now that we have Service Hub in addition...",
  },
  
  // ... other testimonials
];

const TestimonialCard = ({ index, testimonial }) => {
  const classes = IntroDatasetStyle();

  return (
    <Card
      sx={{ margin: `${index % 2 === 0 ? "0 auto 0 0" : "0 0 0 auto"}` }}
      className={classes.testimonialWrapper}
    >
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {testimonial.testimonial}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function TestimonialPage() {
  return (
    <Container maxWidth="lg" sx={{ marginTop: "120px" }}>
      {testimonials.map((testimonial, index) => (
        <Box key={testimonial.name} sx={{mb: 4}}>
          <TestimonialCard index={index} testimonial={testimonial} />
          {/* {index < testimonials.length - 1 && <Divider />} */}
        </Box>
      ))}
    </Container>
  );
}
