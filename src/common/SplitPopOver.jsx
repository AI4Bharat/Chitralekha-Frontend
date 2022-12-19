import { Popover, Typography } from '@mui/material';
import React from 'react'

const SplitPopOver = ({open, handleClosePopOver, anchorEl}) => {
    return (
        <Popover
            id={"'simple-popover'"}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopOver}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            
        </Popover>
    )
}

export default SplitPopOver;