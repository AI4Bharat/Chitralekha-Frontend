import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Container, Box } from "@mui/material";
import { IntroDatasetStyle } from "styles";
import { testimonials } from "config";

const TestimonialCard = ({ index, testimonial }) => {
  const classes = IntroDatasetStyle();

  return (
    <Card
      sx={{ margin: `${index % 2 === 0 ? "0 auto 0 0" : "0 0 0 auto"}` }}
      className={classes.testimonialWrapper}
    >
      <CardContent style={{ padding: "16px" }}>
        <Typography className={classes.testimonialContent} marginBottom="20px">
          "{testimonial.content}"
        </Typography>
        <Typography
          className={classes.testimonialContent2}
          textTransform="uppercase"
          fontWeight="bold"
        >
          {testimonial.name},
        </Typography>
        <Typography className={classes.testimonialContent2} fontStyle="italic">
          {testimonial.role},
        </Typography>
        <Typography className={classes.testimonialContent2} fontStyle="italic">
          {testimonial.organization}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function TestimonialPage() {
  return (
    <Container maxWidth="lg" sx={{ marginTop: "120px" }}>
      {testimonials.map((testimonial, index) => (
        <Box key={testimonial.name} sx={{ mb: 4 }}>
          <TestimonialCard index={index} testimonial={testimonial} />
        </Box>
      ))}
    </Container>
  );
}
