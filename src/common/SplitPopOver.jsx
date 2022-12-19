import { Button, Grid, Popover, Typography } from '@mui/material';
import React from 'react'

const SplitPopOver = ({open, handleClosePopOver, anchorEl, anchorPos, onSplitClick}) => {
    return (
        <Popover
            id={"'simple-popover'"}
            open={open}
            anchorPosition={{left: anchorPos?.positionY, top: anchorPos?.positionX}}
            anchorEl={anchorEl}
            onClose={handleClosePopOver}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            elevation={0}
            PaperProps={{
                style:{border: "none"}
            }}
        >
            <Grid sx={{backgroundColor: "transparent", border: "none", }}>
                <Button 
                    variant="contained" 
                    sx={{borderRadius: 1}}
                    onClick={onSplitClick}
                >Split Subtitle</Button>
            </Grid>
            
        </Popover>
    )
}

export default SplitPopOver;