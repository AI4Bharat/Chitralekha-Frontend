import { Button, Grid, Popover, Typography } from '@mui/material';
import React from 'react'

const SplitPopOver = ({open, handleClosePopOver, anchorEl, anchorPosition, onSplitClick}) => {
    return (
        <Popover
            id={"'simple-popover'"}
            open={open}
            onClose={handleClosePopOver}
            anchorReference="anchorPosition"
            anchorPosition={{ top: anchorPosition.positionY+15, left: anchorPosition.positionX }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
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