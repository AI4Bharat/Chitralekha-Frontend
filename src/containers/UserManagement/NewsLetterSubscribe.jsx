import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { validateEmail } from "utils/utils";

const NewsLetter = ({ susbscribeToNewsLetter }) => {
    const [email, setEmail] = useState("");

    const handleClick = () => {
        susbscribeToNewsLetter(email);
    };

    return <Grid container spacing={2}>
        <Grid display="flex"
            justifyContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField placeholder="EmailId@example.com" onChange={(e) => setEmail(e.target.value)} value={email} />
        </Grid>
        <Grid display="flex"
            justifyContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button variant="contained" onClick={handleClick} disabled={!validateEmail(email)}>Subscribe</Button>
        </Grid>
    </Grid>
};

export default NewsLetter;