import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APITransport, NewsletterTemplate } from "redux/actions";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import NewsletterPreview from "redux/actions/api/Admin/NewsLetterPreview";
import clearTemplatePreview from "redux/actions/api/Admin/ClearTemplatePreview";
import CustomizedSnackbars from "../../common/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import getLocalStorageData from "utils/getLocalStorageData";
import { TabPanel } from "common";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const NewsLetter = () => {
  const dispatch = useDispatch();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "",
  });
  const [templateInfo, setTemplateInfo] = useState({
    1: null,
    2: null,
    3: null,
  });

  const { html } = useSelector((state) => state.newsletterPreviewReducer);

  const handleTemplateChange = (e) => {
    setTemplateInfo((prev) => ({
      ...prev,
      1: null,
      2: null,
      3: null,
    }));
    setSelectedTemplate(e.target.value);
  };

  const handleTemplatePreview = (type) => {
    const templateContent = templateInfo?.[selectedTemplate] || {};
    const additionalFieldsContent = templateContent.additionalFields || [];
    const adcontent = additionalFieldsContent.map((field) => ({
      image: field.image,
      youtube_url: field.youtube_url,
      header: field.header,
      paragraph: field.paragraph,
    }));

    let content;
    if (selectedTemplate === 3) {
      content = { html: templateContent.html };
    } else {
      content = [
        {
          image: templateContent.image,
          youtube_url: templateContent.youtube_url,
          header: templateContent.header,
          paragraph: templateContent.paragraph,
        },
        ...adcontent,
      ];
    }

    const payload = {
      submitter_id: getLocalStorageData("userData").id,
      content: content,
      subject: templateInfo?.[selectedTemplate]?.subject,
      category: templateInfo?.[selectedTemplate]?.category,
      template_id: selectedTemplate,
    };

    if (type === "submit") {
      const templateOneObj = new NewsletterTemplate(payload, selectedTemplate);
      dispatch(APITransport(templateOneObj));
    } else {
      if (Object.keys(templateContent).length) {
        const templateOneObj = new NewsletterPreview(payload, selectedTemplate);
        dispatch(APITransport(templateOneObj));
      }
    }
  };

  const handleChange = (field, value, index) => {
    setTemplateInfo((prevTemplateInfo) => {
      const updatedTemplateInfo = { ...prevTemplateInfo };

      if (index === 0) {
        updatedTemplateInfo[selectedTemplate] = {
          ...updatedTemplateInfo[selectedTemplate],
          [field]: value.trim() !== "" ? value : undefined,
        };
      } else if (index > 0 && selectedTemplate !== 3) {
        if (!updatedTemplateInfo[selectedTemplate]) {
          updatedTemplateInfo[selectedTemplate] = {};
        }

        if (!updatedTemplateInfo[selectedTemplate].additionalFields) {
          updatedTemplateInfo[selectedTemplate].additionalFields = [];
        }

        const additionalFields =
          updatedTemplateInfo[selectedTemplate].additionalFields;

        while (additionalFields.length < index) {
          additionalFields.push({});
        }

        additionalFields[index - 1][field] =
          value.trim() !== "" ? value : undefined;
        updatedTemplateInfo[selectedTemplate].additionalFields =
          additionalFields;
      }

      return updatedTemplateInfo;
    });

    setAdditionalFields((prevAdditionalFields) => {
      const updatedAdditionalFields = { ...prevAdditionalFields };
      const currentAdditionalFields =
        updatedAdditionalFields[selectedTemplate] || [];
      if (index > 0) {
        while (currentAdditionalFields.length < index) {
          currentAdditionalFields.push({});
        }
        currentAdditionalFields[index - 1][field] =
          value.trim() !== "" ? value : undefined;
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
      setTemplateInfo((prevTemplateInfo) => {
        const updatedTemplateInfo = { ...prevTemplateInfo };

        if (!updatedTemplateInfo[selectedTemplate]) {
          updatedTemplateInfo[selectedTemplate] = {};
        }

        const additionalFields =
          updatedTemplateInfo[selectedTemplate].additionalFields || [];
        additionalFields.pop();
        updatedTemplateInfo[selectedTemplate].additionalFields =
          additionalFields;

        return updatedTemplateInfo;
      });

      setAdditionalFields((prevFields) => {
        const updatedFields = { ...prevFields };
        updatedFields[selectedTemplate] = currentFields.slice(0, -1);
        return updatedFields;
      });
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
    handleChange("html", "", 0);
    setUploadedFileName(null);
  };

  const getBase64 = (file) => {
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
  };

  const templateOne = () => {
    const additionalFieldsOne = additionalFields[selectedTemplate] || [];

    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Subject"
              value={templateInfo?.[selectedTemplate]?.subject || ""}
              onChange={(e) => handleChange("subject", e.target.value, 0)}
              style={{ backgroundColor: "white" }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-label"
                label="Category"
                value={templateInfo?.[selectedTemplate]?.category || ""}
                onChange={(e) => handleChange("category", e.target.value, 0)}
              >
                <MenuItem value={"Downtime"}>Downtime</MenuItem>
                <MenuItem value={"Release"}>Release</MenuItem>
                <MenuItem value={"General"}>General</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ width: "100%", my: 3 }} />

        <Grid container spacing={2}>
          <Grid
            display="flex"
            justifyContent="center"
            alignContent="center"
            item
            xs={12}
            md={12}
          >
            <TextField
              fullWidth
              label="Header text"
              value={templateInfo?.[selectedTemplate]?.header || ""}
              onChange={(e) => handleChange("header", e.target.value, 0)}
              style={{ backgroundColor: "white" }}
            />
          </Grid>

          <Grid
            display="flex"
            justifyContent="center"
            alignContent="center"
            item
            xs={12}
            md={12}
          >
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Enter the paragraph"
              value={templateInfo?.[selectedTemplate]?.paragraph || ""}
              onChange={(e) => handleChange("paragraph", e.target.value, 0)}
              style={{ backgroundColor: "white" }}
            />
          </Grid>

          {additionalFieldsOne.map((value, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} paddingTop={0}>
                <Divider sx={{ width: "100%", my: 1 }} />
              </Grid>

              <Grid
                display="flex"
                justifyContent="center"
                alignContent="center"
                item
                xs={12}
                md={12}
              >
                <TextField
                  fullWidth
                  label="Header text"
                  value={
                    templateInfo?.[selectedTemplate]?.additionalFields?.[index]
                      ?.header || ""
                  }
                  onChange={(e) =>
                    handleChange("header", e.target.value, index + 1)
                  }
                  style={{ backgroundColor: "white" }}
                />
              </Grid>

              <Grid
                display="flex"
                justifyContent="center"
                alignContent="center"
                item
                xs={12}
                md={12}
              >
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  label="Enter the paragraph"
                  value={
                    templateInfo?.[selectedTemplate]?.additionalFields?.[index]
                      ?.paragraph || ""
                  }
                  onChange={(e) =>
                    handleChange("paragraph", e.target.value, index + 1)
                  }
                  style={{ backgroundColor: "white" }}
                />
              </Grid>
            </React.Fragment>
          ))}

          <Grid item xs={12}>
            <Divider sx={{ width: "100%", my: 1 }} />
          </Grid>

          <Grid
            display="flex"
            justifyContent="center"
            alignContent="center"
            item
            xs={12}
          >
            <Button variant="contained" onClick={addNewTextField}>
              <AddIcon />
            </Button>

            <Button
              variant="contained"
              style={{ margin: "0 30px" }}
              onClick={removeLastTextField}
            >
              <RemoveIcon />
            </Button>

            <Button
              variant="contained"
              onClick={() => handleTemplatePreview("submit")}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };

  const templateTwo = () => {
    const additionalFieldsTwo = additionalFields[selectedTemplate] || [];
    return (
      <>
        <Grid container spacing={2}>
          <Grid
            display="flex"
            justifyContent="center"
            alignContent="center"
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="Subject"
              value={templateInfo?.[selectedTemplate]?.subject || ""}
              onChange={(e) => handleChange("subject", e.target.value, 0)}
              style={{ backgroundColor: "white" }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-label"
                label="Category"
                value={templateInfo?.[selectedTemplate]?.category || ""}
                onChange={(e) => handleChange("category", e.target.value, 0)}
              >
                <MenuItem value={"Downtime"}>Downtime</MenuItem>
                <MenuItem value={"Release"}>Release</MenuItem>
                <MenuItem value={"General"}>General</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ width: "100%", my: 3 }} />

        <Grid container spacing={2}>
          <Grid
            display="flex"
            justifyContent="center"
            alignContent="center"
            item
            xs={12}
          >
            <TextField
              fullWidth
              label="Header text"
              value={templateInfo?.[selectedTemplate]?.header || ""}
              onChange={(e) => handleChange("header", e.target.value, 0)}
              style={{ backgroundColor: "white" }}
            />
          </Grid>

          <Grid
            display="flex"
            justifyContent="center"
            alignContent="center"
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="Image link"
              value={templateInfo?.[selectedTemplate]?.image || ""}
              onChange={(e) => handleChange("image", e.target.value, 0)}
              style={{ backgroundColor: "white" }}
            />
          </Grid>

          <Grid
            display="flex"
            justifyContent="center"
            alignContent="center"
            item
            xs={12}
            md={6}
          >
            <TextField
              fullWidth
              label="Video link"
              value={templateInfo?.[selectedTemplate]?.youtube_url || ""}
              onChange={(e) => handleChange("youtube_url", e.target.value, 0)}
              style={{ backgroundColor: "white" }}
            />
          </Grid>

          <Grid
            display="flex"
            justifyContent="center"
            alignContent="center"
            item
            xs={12}
          >
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Enter the paragraph"
              value={templateInfo?.[selectedTemplate]?.paragraph || ""}
              onChange={(e) => handleChange("paragraph", e.target.value, 0)}
            />
          </Grid>

          {additionalFieldsTwo.map((value, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12}>
                <Divider sx={{ width: "100%", my: 1 }} />
              </Grid>

              <Grid
                display="flex"
                justifyContent="center"
                alignContent="center"
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Header text"
                  value={
                    templateInfo?.[selectedTemplate]?.additionalFields?.[index]
                      ?.header || ""
                  }
                  onChange={(e) =>
                    handleChange("header", e.target.value, index + 1)
                  }
                  style={{ backgroundColor: "white" }}
                />
              </Grid>

              <Grid
                display="flex"
                justifyContent="center"
                alignContent="center"
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Image link"
                  value={
                    templateInfo?.[selectedTemplate]?.additionalFields?.[index]
                      ?.image || ""
                  }
                  onChange={(e) =>
                    handleChange("image", e.target.value, index + 1)
                  }
                  style={{ backgroundColor: "white" }}
                />
              </Grid>

              <Grid
                display="flex"
                justifyContent="center"
                alignContent="center"
                item
                xs={6}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Video link"
                  value={
                    templateInfo?.[selectedTemplate]?.additionalFields?.[index]
                      ?.youtube_url || ""
                  }
                  onChange={(e) =>
                    handleChange("youtube_url", e.target.value, index + 1)
                  }
                  style={{ backgroundColor: "white" }}
                />
              </Grid>

              <Grid
                display="flex"
                justifyContent="center"
                alignContent="center"
                item
                xs={12}
              >
                <TextField
                  label="Enter the paragraph"
                  multiline
                  rows={4}
                  fullWidth
                  value={
                    templateInfo?.[selectedTemplate]?.additionalFields?.[index]
                      ?.paragraph || ""
                  }
                  onChange={(e) =>
                    handleChange("paragraph", e.target.value, index + 1)
                  }
                />
              </Grid>
            </React.Fragment>
          ))}

          <Grid item xs={12}>
            <Divider sx={{ width: "100%", my: 1 }} />
          </Grid>

          <Grid
            display="flex"
            justifyContent="center"
            alignContent="center"
            item
            xs={12}
          >
            <Button variant="contained" onClick={addNewTextField}>
              <AddIcon />
            </Button>

            <Button
              variant="contained"
              style={{ margin: "0 30px" }}
              onClick={removeLastTextField}
            >
              <RemoveIcon />
            </Button>

            <Button
              variant="contained"
              onClick={() => handleTemplatePreview("submit")}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };

  const templateThree = () => {
    return (
      <Grid container spacing={2}>
        <Grid
          display="flex"
          justifyContent="center"
          alignContent="center"
          item
          xs={12}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              accept=".html"
              onChange={(e) => {
                const file = e.target.files[0];
                getBase64(file)
                  .then((base64Data) => {
                    const base64Substr = base64Data.substr(
                      base64Data.indexOf(",") + 1
                    );
                    handleChange("html", base64Substr.toString(), 0);
                    const fileName = file.name;
                    setUploadedFileName(fileName);
                    setSnackbarInfo({
                      open: true,
                      message: "File Uploaded Succesfully",
                      variant: "success",
                    });
                    e.target.value = null;
                  })
                  .catch((error) => {
                    console.log("Error: ", error);
                  });
              }}
            />
          </Button>

          {uploadedFileName != null ? (
            <div style={{ marginLeft: "14px", marginTop: "7px" }}>
              {uploadedFileName}
            </div>
          ) : null}

          {uploadedFileName != null ? (
            <div style={{ marginLeft: "10px" }} onClick={handleRemoveFile}>
              <IconButton color="Primary" aria-label="add an alarm">
                <CloseIcon />
              </IconButton>
            </div>
          ) : null}
        </Grid>

        <Grid
          display="flex"
          justifyContent="center"
          alignContent="center"
          item
          xs={12}
        >
          <Button
            variant="contained"
            onClick={() => handleTemplatePreview("submit")}
          >
            Submit
          </Button>
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
        return <></>;
    }
  };

  return (
    <>
      {renderSnackBar()}
      <Grid container spacing={4}>
        <Grid
          display="flex"
          justifyContent="center"
          alignContent="center"
          item
          xs={12}
          style={{ paddingLeft: "16px" }}
        >
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

        {selectedTemplate && (
          <Grid item xs={12}>
            <Tabs
              value={tabValue}
              onChange={(_event, newValue) => {
                setTabValue(newValue);
                if (newValue === 1) handleTemplatePreview();
              }}
              aria-label="Newsletter Tab"
            >
              <Tab label={"Write"} sx={{ fontSize: 16, fontWeight: "700" }} />
              <Tab label={"Preview"} sx={{ fontSize: 16, fontWeight: "700" }} />
            </Tabs>
            <TabPanel
              value={tabValue}
              index={0}
              style={{ textAlign: "center", maxWidth: "100%" }}
            >
              {renderSelectedTemplate()}
            </TabPanel>
            <TabPanel
              value={tabValue}
              index={1}
              style={{ textAlign: "center", maxWidth: "100%" }}
            >
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </TabPanel>
          </Grid>
        )}
      </Grid>
    </>
  );
};
export default NewsLetter;
