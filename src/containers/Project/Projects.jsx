import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";
import Header from "../../common/Header";
import ProjectStyle from "../../styles/ProjectStyle";
import ProjectCard from "./ProjectCard";
import ProjectList from "./ProjectList";

const data = [
  {
    id: "1",
    title: "test1",
    type: "video",
    mode: "test1",
  },
  {
    id: "2",
    title: "test1",
    type: "video",
    mode: "test1",
  },
  {
    id: "3",
    title: "test1",
    type: "video",
    mode: "test1",
  },
  {
    id: "4",
    title: "test1",
    type: "video",
    mode: "test1",
  },
  {
    id: "5",
    title: "test1",
    type: "video",
    mode: "test1",
  },
];

const Projects = () => {
  const classes = ProjectStyle();
  const [radioValue, setRadioValue] = useState("list");

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  return (
    <>
      <Header />
      <div className={classes.container}>
        <Box display="flex" alignItems="center">
          <h3>View: </h3>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            sx={{ m: "0 10px" }}
            value={radioValue}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="list" control={<Radio />} label="List" />
            <FormControlLabel value="card" control={<Radio />} label="Card" />
          </RadioGroup>
        </Box>

        <Box>
            {
                radioValue === "list" ? (
                    <ProjectList data={data}/>
                ) : (
                  <ProjectCard data={data}/>
                )
            }
        </Box>
      </div>
    </>
  );
};

export default Projects;
