import { Grid, Select, MenuItem, FormControl, InputLabel, Box, TextField, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APITransport, NewsletterTemplate } from "redux/actions";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import NewsletterPreview from "redux/actions/api/Admin/NewsLetterPreview";
import clearTemplatePreview from "redux/actions/api/Admin/ClearTemplatePreview";
import getLocalStorageData from "utils/getLocalStorageData";

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
  const [templateInfo, setTemplateInfo] = useState({
    1: null,
    2: null,
    3: null
  })
  const dispatch = useDispatch();

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
    const payload = {
      submitter_id: getLocalStorageData("userData").id,
      content: selectedTemplate !== 3 ? [templateInfo?.[selectedTemplate]] : templateInfo?.[selectedTemplate],
      category: "NEW_FEATURE",
      template_id: selectedTemplate
    }
    const templateOneObj = new NewsletterTemplate(payload, selectedTemplate);
    dispatch(APITransport(templateOneObj));
  };

  const handleTemplatePreview = () => {
    const payload = {
      submitter_id: getLocalStorageData("userData").id,
      content: selectedTemplate !== 3 ? [templateInfo?.[selectedTemplate]] : templateInfo?.[selectedTemplate],
      category: "NEW_FEATURE",
      template_id: selectedTemplate
    }
    const templateOneObj = new NewsletterPreview(payload, selectedTemplate);
    dispatch(APITransport(templateOneObj));
  };

  const handleChange = (prop, value) => {
    setTemplateInfo((prev) => ({
      ...prev,
      [selectedTemplate]: {
        ...prev[selectedTemplate],
        [prop]: value,
      },
    }));
  };

  useEffect(() => {
    dispatch(clearTemplatePreview());
  }, [selectedTemplate]);

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
    return <Grid container spacing={2}>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Header text" value={templateInfo?.[selectedTemplate]?.header || ""} onChange={(e) => handleChange("header", e.target.value)} />
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <textarea style={{
          "width": "230px", height: "52px"
        }} placeholder="Enter the paragraph" value={templateInfo?.[selectedTemplate]?.paragraph || ""} onChange={(e) => handleChange("paragraph", e.target.value)} />
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Button variant="contained" onClick={handleTemplateSubmit}>Submit</Button>
        <Button style={{"marginLeft": "30px"}} variant="contained" onClick={handleTemplatePreview}>Preview</Button>
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      </Grid>
    </Grid>
  };

  const templateTwo = () => {
    return <Grid container spacing={2}>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Header text" value={templateInfo?.[selectedTemplate]?.header || ""} onChange={(e) => handleChange("header", e.target.value)} />
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Image link" value={templateInfo?.[selectedTemplate]?.image || ""} onChange={(e) => handleChange("image", e.target.value)} />
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <TextField placeholder="Video link" value={templateInfo?.[selectedTemplate]?.youtube_url || ""} onChange={(e) => handleChange("youtube_url", e.target.value)} />
      </Grid>
      {/* <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField placeholder="Youtube link" value={templateInfo?.[selectedTemplate]?.youtube_url || ""} onChange={(e) => handleChange("youtube_url", e.target.value)} />
      </Grid> */}
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <textarea style={{
          "width": "230px", height: "52px"
        }} placeholder="Enter the paragraph" value={templateInfo?.[selectedTemplate]?.paragraph || ""} onChange={(e) => handleChange("paragraph", e.target.value)} />
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Button variant="contained" onClick={handleTemplateSubmit}>Submit</Button>
        <Button style={{
          "marginLeft": "30px"
        }}variant="contained" onClick={handleTemplatePreview}>Preview</Button>
      </Grid>
      <Grid display="flex" justifyContent="center" alignContent="center" item xs={6} sm={6} md={6} lg={6} xl={6}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Grid>
    </Grid>
  };
  const templateThree = () => {
    return (
      <Grid container spacing={2}>
        <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" accept=".html" onChange={(e) => {
              const file = e.target.files[0]
              getBase64(file)
                .then(base64Data => {
                  const base64Substr = base64Data.substr(base64Data.indexOf(",") + 1);
                  handleChange("html", base64Substr.toString());
                })
                .catch(error => {
                  console.log('Error: ', error);
                });
            }} />
          </Button>
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

  return <Grid container spacing={4}>
    <Grid display="flex" justifyContent="center" alignContent="center" item xs={12} sm={12} md={12} lg={12} xl={12}>
      <FormControl fullWidth>
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
};

export default NewsLetter;