import { Button } from '@mui/material';
import React, { useState } from 'react';
import ProjectStyle from '../styles/ProjectStyle';

const FindAndReplace = () => {
    const classes = ProjectStyle();

    const [showFindReplaceModel, setShowFindReplaceModel] = useState(false);

    return (
        <>
            <Button variant="contained" className={classes.findBtn}>
                Find / Replace
            </Button>
            
        </>

    )
}

export default FindAndReplace