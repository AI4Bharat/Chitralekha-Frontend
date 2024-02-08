import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Divider, Container, Box } from '@mui/material';

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
  // ... other testimonials
];

const TestimonialCard = ({ testimonial }) => (
  <Card sx={{ mb: 2 }}>
    <CardHeader
      avatar={<Avatar src={testimonial.avatar} alt={testimonial.name} />}
      title={testimonial.name}
      subheader={`${testimonial.title}, ${testimonial.company}`}
      titleTypographyProps={{ fontWeight: 'bold' }}
      subheaderTypographyProps={{ color: 'text.secondary' }}
    />
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {testimonial.testimonial}
      </Typography>
    </CardContent>
  </Card>
);

export default function TestimonialPage() {
  return (
    <Container maxWidth="md" sx={{marginTop: "120px"}}>
      {testimonials.map((testimonial, index) => (
        <Box key={testimonial.name}>
          <TestimonialCard testimonial={testimonial} />
          {index < testimonials.length - 1 && <Divider />}
        </Box>
      ))}
    </Container>
  );
}
