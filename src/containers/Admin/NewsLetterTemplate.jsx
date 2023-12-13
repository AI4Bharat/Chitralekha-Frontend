import { Grid, Select, MenuItem, FormControl, InputLabel, Box, IconButton,TextField, Button } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APITransport, NewsletterTemplate } from "redux/actions";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import NewsletterPreview from "redux/actions/api/Admin/NewsLetterPreview";
import clearTemplatePreview from "redux/actions/api/Admin/ClearTemplatePreview";
import { makeStyles } from '@mui/styles';
import CustomizedSnackbars from "../../common/Snackbar";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import getLocalStorageData from "utils/getLocalStorageData";
import{
  setSnackBar
} from "../../redux/actions/Common"

const useStyles = makeStyles((theme) => ({
  customStyles: {
    width: '230px',
    height: '52px',
    fontSize: '20px',
    fontFamily: 'Roboto',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    outline: 'none',
    borderRadius:"4px",
    lineHeight: '52px',
    border: '1px solid #bdbdbd',
    '&:focus': {
      border: '2px solid #002984',
    },
    '&::placeholder': {
      color: '#bdbdbd',
    },
  },

}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const NewsLetter = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "",
  });

  const [templateInfo, setTemplateInfo] = useState({
    1: null,
    2: null,
    3: null
  })
  const dispatch = useDispatch();
  const classes = useStyles();


  const { html } = useSelector(state => state.newsletterPreviewReducer);

  const handleTemplateChange = (e) => {
    setTemplateInfo((prev) => ({
      ...prev,
      1: null,
      2: null,
      3: null
    }))
    setSelectedTemplate(e.target.value);
    
  };

  const handleTemplateSubmit = () => {
    const templateContent = templateInfo?.[selectedTemplate] || {};
    const additionalFieldsContent = templateContent.additionalFields || [];
    if(selectedTemplate==3){
      var content = {html:templateContent.html || ''}
  }
  else{
    var content =  [
      {
        image: templateContent.image || '',
        youtube_url: templateContent.youtube_url || '',
        header: templateContent.header || '',
        paragraph: templateContent.paragraph || '',
        html: templateContent.html || '',
      },
      ...additionalFieldsContent,
    ]
  }
    const payload = {
      submitter_id: getLocalStorageData("userData").id,
      content: content,
      category: "NEW_FEATURE",
      template_id: selectedTemplate
    }
    const templateOneObj = new NewsletterTemplate(payload, selectedTemplate);
    dispatch(APITransport(templateOneObj));
  };

  const handleTemplatePreview = () => {
    const templateContent = templateInfo?.[selectedTemplate] || {};
    const additionalFieldsContent = templateContent.additionalFields || [];
    if(selectedTemplate==3){
        var content = {html:templateContent.html || ''}
    }
    else{
      var content =  [
        {
          image: templateContent.image || '',
          youtube_url: templateContent.youtube_url || '',
          header: templateContent.header || '',
          paragraph: templateContent.paragraph || '',
        },
        ...additionalFieldsContent,
      ]
    }
  
    const payload = {
      submitter_id: getLocalStorageData("userData").id,
      content: content,
      category: "NEW_FEATURE",
      template_id: selectedTemplate
    }
    const templateOneObj = new NewsletterPreview(payload, selectedTemplate);
    dispatch(APITransport(templateOneObj));
  };

  const handleChange = (field, value, index) => {
    setTemplateInfo((prevTemplateInfo) => {
      const updatedTemplateInfo = { ...prevTemplateInfo };
  
      if (index === 0) {
        updatedTemplateInfo[selectedTemplate] = {
          ...updatedTemplateInfo[selectedTemplate],
          [field]: value,
        };
      } else if(index>0 && selectedTemplate!==3 ) {
        if (!updatedTemplateInfo[selectedTemplate]) {
          updatedTemplateInfo[selectedTemplate] = {};
        }
  
        if (!updatedTemplateInfo[selectedTemplate].additionalFields) {
          updatedTemplateInfo[selectedTemplate].additionalFields = [];
        }
  
        const additionalFields = updatedTemplateInfo[selectedTemplate].additionalFields;
        
        while (additionalFields.length < index) {
          additionalFields.push({});
        }
  
        additionalFields[index - 1][field] = value;
        updatedTemplateInfo[selectedTemplate].additionalFields = additionalFields;
      }
  
      return updatedTemplateInfo;
  
    });
    setAdditionalFields((prevAdditionalFields) => {
      const updatedAdditionalFields = { ...prevAdditionalFields };
      const currentAdditionalFields = updatedAdditionalFields[selectedTemplate] || [];

      if (index > 0) {
        while (currentAdditionalFields.length < index) {
          currentAdditionalFields.push({});
        }

        currentAdditionalFields[index - 1][field] = value;
      }

      updatedAdditionalFields[selectedTemplate] = currentAdditionalFields;

      return updatedAdditionalFields;
    });
  };
  
  
  const addNewTextField = () => {
    setAdditionalFields((prevFields) => ({
      ...prevFields,
      [selectedTemplate]: [...(prevFields[selectedTemplate] || []), {}],
    }));
  };

  const removeLastTextField = () => {
    const currentFields = additionalFields[selectedTemplate] || [];
    if (currentFields.length > 0) {
      setAdditionalFields((prevFields) => ({
        ...prevFields,
        [selectedTemplate]: currentFields.slice(0, -1),
      }));
    }
  };

    const renderSnackBar = useCallback(() => {
      return (
        <CustomizedSnackbars
          open={snackbar.open}
          handleClose={() =>
            setSnackbarInfo({ open: false, message: "", variant: "" })
          }
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          variant={snackbar.variant}
          message={[snackbar.message]}
        />
      );
  
    }, [snackbar]);
  
   
  useEffect(() => {
    dispatch(clearTemplatePreview());
  }, [selectedTemplate]);

  
  const handleRemoveFile = () => {
    handleChange("html", "",0);
    setUploadedFileName(null);
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function () {
        resolve(reader.result);
      };

      reader.onerror = function (error) {
        reject(error);
      };
    });
  }

  const templateOne = () => {
    const additionalFieldsOne = additionalFields[selectedTemplate] || [];

    return <Grid container spacing={2} style={{ overflowY: 'auto' ,marginBottom: '10px' ,backgroundColor:"#fbe9e7"}}>
      
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Header text" value={templateInfo?.[selectedTemplate]?.header || ""} onChange={(e) => handleChange("header", e.target.value,0)}style={{backgroundColor:"white"}} />
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6} >
        <textarea  className={classes.customStyles} 
    
         placeholder="Enter the paragraph" value={templateInfo?.[selectedTemplate]?.paragraph || ""} onChange={(e) => handleChange("paragraph", e.target.value,0)}style={{backgroundColor:"white"}} 
        />
      </Grid>
      {additionalFieldsOne.map((value, index) => (
          <React.Fragment key={index}>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Header text" value={templateInfo?.[selectedTemplate]?.additionalFields?.[index]?.header || ''} onChange={(e) => handleChange("header", e.target.value,index+1)}style={{backgroundColor:"white"}} />
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6} >
        <textarea  className={classes.customStyles} 
    
         placeholder="Enter the paragraph" value={templateInfo?.[selectedTemplate]?.additionalFields?.[index]?.paragraph || ''} onChange={(e) => handleChange("paragraph", e.target.value,index+1)} style={{backgroundColor:"white"}}
        />
      </Grid>
      </React.Fragment>
        ))}
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12} style={{marginTop:"25px"}}>
      <Button variant="contained" onClick={addNewTextField}><AddIcon/></Button>
      <Button variant="contained" style={{"marginLeft": "30px"}} onClick={removeLastTextField}><RemoveIcon/></Button>
      <Button style={{"marginLeft": "30px"}} variant="contained" onClick={handleTemplatePreview}>Preview</Button>
        <Button variant="contained" style={{"marginLeft": "30px"}}  onClick={handleTemplateSubmit}>Submit</Button>
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      </Grid>
    </Grid>
  };

  const templateTwo = () => {
    const additionalFieldsTwo = additionalFields[selectedTemplate] || [];

    return <Grid container spacing={2} style={{ overflowY: 'auto' ,marginBottom: '10px' ,backgroundColor:"#fbe9e7"}}>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Header text" value={templateInfo?.[selectedTemplate]?.header || ""} onChange={(e) => handleChange("header", e.target.value,0)} style={{backgroundColor:"white"}}/>
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Image link" value={templateInfo?.[selectedTemplate]?.image || ""} onChange={(e) => handleChange("image", e.target.value,0)}  style={{backgroundColor:"white"}}/>
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Video link" value={templateInfo?.[selectedTemplate]?.youtube_url || ""} onChange={(e) => handleChange("youtube_url", e.target.value,0)}  style={{backgroundColor:"white"}}/>
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <textarea style={{width:"240px",height:"55px",backgroundColor:"white"}}className={classes.customStyles} placeholder="Enter the paragraph" value={templateInfo?.[selectedTemplate]?.paragraph || ""} onChange={(e) => handleChange("paragraph", e.target.value,0)} />
      </Grid>


      {additionalFieldsTwo.map((value, index) => (
          <React.Fragment key={index}>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Header text" value={templateInfo?.[selectedTemplate]?.additionalFields?.[index]?.header || ''} onChange={(e) => handleChange("header", e.target.value,index+1)} style={{backgroundColor:"white"}}/>
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Image link" value={templateInfo?.[selectedTemplate]?.additionalFields?.[index]?.image || ''} onChange={(e) => handleChange("image", e.target.value,index+1)}style={{backgroundColor:"white"}} />
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Video link" value={templateInfo?.[selectedTemplate]?.additionalFields?.[index]?.youtube_url || ''} onChange={(e) => handleChange("youtube_url", e.target.value,index+1)}style={{backgroundColor:"white"}} />
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6} >
        <textarea   className={classes.customStyles} 
    
         placeholder="Enter the paragraph" value={templateInfo?.[selectedTemplate]?.additionalFields?.[index]?.paragraph || ''} onChange={(e) => handleChange("paragraph", e.target.value,index+1)} style={{backgroundColor:"white",width:"240px",height:"55px"}}
        />
      </Grid>
      </React.Fragment>
        ))}
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
      <Button variant="contained" onClick={addNewTextField}><AddIcon/></Button>
      <Button variant="contained" style={{"marginLeft": "30px"}} onClick={removeLastTextField}><RemoveIcon/></Button>
      <Button variant="contained"  style={{"marginLeft": "30px"}}onClick={handleTemplatePreview}>Preview</Button>
        <Button style={{
          "marginLeft": "30px"
        }}variant="contained" onClick={handleTemplateSubmit}>Submit</Button>
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Grid>
    </Grid>
  };
  const templateThree = () => {
    return (
      <Grid container spacing={2} style={{  marginBottom: '10px' ,paddingBottom:"15px",backgroundColor:"#fbe9e7"}}>
        <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" accept=".html" onChange={(e) => {
              const file = e.target.files[0]
              getBase64(file)
                .then(base64Data => {
                  const base64Substr = base64Data.substr(base64Data.indexOf(",") + 1);
                  handleChange("html", base64Substr.toString(),0);
                  const fileName = file.name;
                  setUploadedFileName(fileName);
                  setSnackbarInfo({
                    open: true,
                    message: "File Uploaded Succesfully",
                    variant: "success",
                  });
                  e.target.value = null;
                })
                .catch(error => {
                  console.log('Error: ', error);
                });
            }} />
          </Button>
          {uploadedFileName!=null?  <div style={{ marginLeft: '14px' ,marginTop:"7px"}}>{uploadedFileName}</div> :null}
          {uploadedFileName!=null?  <div style={{ marginLeft: '10px' }}onClick={handleRemoveFile}><IconButton color="Primary" aria-label="add an alarm"><CloseIcon /></IconButton></div> :null}
        </Grid>
        <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button variant="contained" onClick={handleTemplateSubmit}>Submit</Button>
        </Grid>
      </Grid>
    );
  };

  const renderSelectedTemplate = () => {
    switch (selectedTemplate) {
      case 1:
        return templateOne();
      case 2:
        return templateTwo();
      case 3:
        return templateThree();
      default:
        return <></>
    }
  };

  return <>
   
   {renderSnackBar()}

 <Grid container spacing={4}>
    <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingLeft:"16px"}}>
      <FormControl  fullWidth>
        <InputLabel id="select-template-label">Select template</InputLabel>
        <Select
          labelId="select-template-label"
          id="select-template-label"
          label="Select template"
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          <MenuItem value={1}>Template 1</MenuItem>
          <MenuItem value={2}>Template 2</MenuItem>
          <MenuItem value={3}>Template 3</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}> {renderSelectedTemplate()}
    </Grid>
  </Grid>
  </>
};

export default NewsLetter;