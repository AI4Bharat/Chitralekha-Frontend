import { Button, Dialog, DialogContent, DialogTitle, Grid, Box, Typography, Tooltip, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProjectStyle from '../styles/projectStyle';
import OutlinedTextField from './OutlinedTextField';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { IndicTransliterate } from '@ai4bharat/indic-transliterate';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import { useDispatch, useSelector } from 'react-redux';
import { setSubtitles } from '../redux/actions/Common';
import C from "../redux/constants";

const FindAndReplace = (props) => {
    const classes = ProjectStyle();
    const dispatch = useDispatch();

    const {
        subtitleDataKey,
    } = { ...props }

    const transliterationLang = useSelector((state) => state.getTaskDetails.data?.src_language)
    const sourceData = useSelector((state) => state.commonReducer.subtitles);

    const [subtitlesData, setSubtitlesData] = useState();
    const [showFindReplaceModel, setShowFindReplaceModel] = useState(false);
    const [findValue, setFindValue] = useState("");
    const [replaceValue, setReplaceValue] = useState("");
    const [foundIndices, setFoundIndices] = useState([]);
    const [currentFound, setCurrentFound] = useState();

    const onReplacementDone = (updatedSource) => {
        dispatch(setSubtitles(updatedSource, C.SUBTITLES));
      };

    useEffect(() => {
        setSubtitlesData(sourceData);
    }, [sourceData, subtitleDataKey])

    const resetComponentValue = () => {
        setFindValue("");
        setReplaceValue("");
        setFoundIndices([]);
        setCurrentFound()
    }

    const handleCloseModel = () => {
        setShowFindReplaceModel(false);
        resetComponentValue()
    }
    const handleOpenModel = () => {
        setShowFindReplaceModel(true);
    }

    const onFindClick = () => {
        const textToFind = findValue.toLowerCase().trim()
        const indexListInDataOfTextOccurence = [];
        subtitlesData.forEach((item, index) => {
            if (item[subtitleDataKey].toLowerCase().includes(textToFind)) {
                indexListInDataOfTextOccurence.push(index);
            }
        });

        setFoundIndices(indexListInDataOfTextOccurence);

        if (indexListInDataOfTextOccurence?.length > 0) {
            setCurrentFound(0)
        }
    }

    const previousOccurenceClick = () => {
        setCurrentFound(currentFound - 1);
        const scrollableElement = document.getElementById("subtitle_scroll_view");
        scrollableElement.querySelector(`#sub_${foundIndices[currentFound - 1]}`).scrollIntoView(true, { block: "start" });
    }

    const nextOccurenceClick = () => {
        setCurrentFound(currentFound + 1);
        const scrollableElement = document.getElementById("subtitle_scroll_view");
        scrollableElement.querySelector(`#sub_${foundIndices[currentFound + 1]}`).scrollIntoView(true, { block: "start" });
    }

    const onReplaceClick = () => {
        const currentSubtitleSource = [...subtitlesData];
        const updatedSubtitleData = [];
        currentSubtitleSource.forEach((ele, index) => {
            if (foundIndices[currentFound] === index) {
                const textToReplace = ele[subtitleDataKey].replace(new RegExp(findValue, 'gi'), replaceValue);
                ele[subtitleDataKey] = textToReplace;
            }

            updatedSubtitleData.push(ele);
        })
        setSubtitlesData(updatedSubtitleData);
        onReplacementDone(updatedSubtitleData);
        // handleCloseModel();
    }

    const onReplaceAllClick = () => {
        const currentSubtitleSource = [...subtitlesData];
        const updatedSubtitleData = [];
        currentSubtitleSource.forEach((ele, index) => {
            if (foundIndices?.includes(index)) {
                const textToReplace = ele[subtitleDataKey].replace(new RegExp(findValue, 'gi'), replaceValue);
                ele[subtitleDataKey] = textToReplace;
            }
            updatedSubtitleData.push(ele);
        })
        setSubtitlesData(updatedSubtitleData);
        onReplacementDone(updatedSubtitleData);
        // handleCloseModel();
    }

    return (
        <>
            <Tooltip title="Find/Replace" placement="bottom">
                <IconButton
                    sx={{
                        backgroundColor: "#2C2799",
                        marginX: "5px",
                        borderRadius: "50%",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#271e4f",
                        },
                    }}
                    onClick={handleOpenModel}
                >
                    <FindReplaceIcon />
                </IconButton>
            </Tooltip>

            <Dialog
                open={showFindReplaceModel}
                onClose={handleCloseModel}
                aria-labelledby="responsive-dialog-title"
                maxWidth={"lg"}
                PaperProps={{ style: { borderRadius: "10px" } }}
                >
                     <DialogTitle variant="h4" display="flex" alignItems={"center"}>
                        <Typography variant="h4">Find and Replace</Typography>{" "}
                        <IconButton
                        aria-label="close"
                        onClick={handleCloseModel}
                        sx={{ marginLeft: "auto" }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                <DialogContent
                    sx={{ overflow: "hidden", position: "unset", overscrollBehavior: "none" }}
                >

                    <Grid
                        container
                        flexDirection={"flex"}
                        justifyContent="space-around"
                    >
                        <Grid
                            item
                            md={4}
                            sx={{ margin: 2 }}
                        >
                            {transliterationLang !== "en" ? (
                                <IndicTransliterate
                                    lang={transliterationLang}
                                    value={findValue}
                                    onChangeText={(text) => {
                                        setFindValue(text);
                                    }}
                                    style={{
                                        width: "-webkit-fill-available",
                                        height: 50,
                                        paddingInline: 10,
                                        font: "inherit",
                                        fontSize: "1.25rem"
                                    }}
                                    renderComponent={(props) => (
                                        <>
                                            <label style={{backgroundColor: "white", position: "absolute", left: 10, top: -10, paddingInline: 5}}>Find</label>
                                            <div>
                                        <input
                                            {...props}
                                        />
                                             </div>
                                         </>
                                    )}
                                />
                            ) :
                                (<OutlinedTextField
                                    autoFocus
                                    value={findValue}
                                    onChange={e => setFindValue(e.target.value)}
                                    margin="dense"
                                    id="name"
                                    label="Find"
                                    type="Find"
                                    fullWidth
                                    variant="standard"
                                />)
                            }


                            <Typography variant="caption" display={"flex"} sx={{ justifyContent: "end", paddingTop: 1 }}>{foundIndices?.length > 0 && `${currentFound + 1} / ${foundIndices?.length}`}</Typography>
                            <Grid
                                display={"flex"}
                                justifyContent={foundIndices?.length > 0 ?  "space-between" : "center"}
                                sx={{ textAlign: foundIndices?.length > 0 ? "center" : "end" }}
                                paddingY={3}
                            >
                                {foundIndices?.length > 0 && <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={currentFound === 0}
                                    onClick={previousOccurenceClick}
                                >
                                    <ChevronLeft />
                                </Button>}
                                <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={!findValue}
                                    onClick={onFindClick}
                                    style={{ width: "auto" }}
                                >
                                    Find
                                </Button>
                                {foundIndices?.length > 0 && <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={currentFound === foundIndices.length - 1}
                                    onClick={nextOccurenceClick}
                                >
                                    <ChevronRight />
                                </Button>}
                            </Grid>
                            {transliterationLang !== "en" ? (
                                <IndicTransliterate
                                    lang={transliterationLang}
                                    value={replaceValue}
                                    onChangeText={(text) => {
                                        setReplaceValue(text);
                                    }}
                                    disabled={!(foundIndices?.length > 0)}
                                    style={{
                                        width: "-webkit-fill-available",
                                        height: 50,
                                        paddingInline: 10,
                                        font: "inherit",
                                        fontSize: "1.25rem"
                                    }}
                                    renderComponent={(props) => (
                                        <>
                                            <label style={{backgroundColor: "white", position: "absolute", left: 10, top: -10, paddingInline: 5}}>Replace</label>
                                            <div>
                                        <input
                                            {...props}
                                        />
                                             </div>
                                         </>
                                    )}
                                />
                            ) :
                            (<OutlinedTextField
                                value={replaceValue}
                                onChange={e => setReplaceValue(e.target.value)}
                                margin="dense"
                                id="name"
                                label="Replace"
                                type="Replace"
                                fullWidth
                                variant="standard"
                                disabled={!(foundIndices?.length > 0)}
                            />)}
                            <Grid
                                display={"flex"}
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                paddingY={3}
                            >
                                <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={!replaceValue}
                                    onClick={onReplaceClick}
                                    style={{ width: "auto" }}
                                >
                                    Replace
                                </Button>
                                <Button
                                    variant="contained"
                                    className={classes.findBtn}
                                    disabled={!replaceValue}
                                    onClick={onReplaceAllClick}
                                    style={{ width: "auto" }}
                                >
                                    Replace All
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            md={7}
                            width={"100%"}
                            textAlign={"-webkit-center"}
                            height={window.innerHeight * 0.7}
                            sx={{ overflowY: "scroll" }}
                            paddingBottom={5}
                            id={"subtitle_scroll_view"}
                        >
                            {subtitlesData?.map((el, i) => {
                                return (
                                    <Box
                                        key={i}
                                        id={`sub_${i}`}
                                        textAlign={"start"}
                                        sx={{
                                            marginY: 2, padding: 2, border: "1px solid #000000", borderRadius: 2, width: "75%",
                                            backgroundColor: foundIndices.includes(i) ? foundIndices[currentFound] === i ? "yellow" : "black" : "#ffffff",
                                            color: foundIndices.includes(i) ? foundIndices[currentFound] === i ? "red" : "#ffffff" : "black",
                                        }}
                                    >
                                        {el[subtitleDataKey]}
                                    </Box>
                                )
                            })}
                        </Grid>
                    </Grid>

                </DialogContent>
            </Dialog>
        </>

    )
}

export default FindAndReplace