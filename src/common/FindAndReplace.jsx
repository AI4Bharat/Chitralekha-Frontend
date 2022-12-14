import { Button } from '@mui/material';
import React, { useState } from 'react';
import ProjectStyle from '../styles/ProjectStyle';

const FindAndReplace = () => {
    const classes = ProjectStyle();

    const [showFindReplaceModel, setShowFindReplaceModel] = useState(false);

    const handleCloseModel = () => {
        setShowFindReplaceModel(false);
    }
    const handleOpenModel = () => {
        setShowFindReplaceModel(true);
    }

    return (
        <>
            <Button 
                variant="contained" 
                className={classes.findBtn}
                onClick={handleOpenModel}
            >
                Find / Replace
            </Button>
            {/* <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={showFindReplaceModel}
                onClose={handleCloseModel}
                aria-labelledby="responsive-dialog-title"
            ></Dialog> */}
        </>

    )
}

export default FindAndReplace