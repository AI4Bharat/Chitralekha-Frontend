import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { validateEmail } from "utils/utils";

const NewsLetter = ({ susbscribeToNewsLetter ,subscribe}) => {
    const [email, setEmail] = useState("");

    const handleClick = () => {
        susbscribeToNewsLetter(email);
    };


    return <Grid container spacing={2}>
         <Grid display="flex"
            justifyContent="Flex-end"   mr="1rem" >
            <TextField placeholder="EmailId@example.com" onChange={(e) => setEmail(e.target.value)} value={email} />
        </Grid>
        <Grid display="flex"
            justifyContent="Flex-end"  mr="5rem" mt="1rem">
            <Button variant="contained" onClick={handleClick}  disabled={!validateEmail(email)} >{subscribe==true?`Subscribe`:`Update`}</Button>
        </Grid>
    </Grid>
};

export default NewsLetter;