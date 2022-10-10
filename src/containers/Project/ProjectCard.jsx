import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import Card from "../../common/ProjectCard";
import DatasetStyle from "../../styles/Dataset";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../../common/TablePaginationActions";
// import Record from "../../../../assets/no-record.svg";

const ProjectCard = ({ data }) => {
  const classes = DatasetStyle();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const rowChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      {true > 0 ? (
        <Box sx={{ margin: "0 auto", pb: 5 }}>
          <Grid
            container
            rowSpacing={4}
            spacing={2}
            columnSpacing={{ xs: 1, sm: 1, md: 3 }}
            sx={{ mb: 3 }}
          >
            {data
              .map((el, i) => {
                return (
                  <Grid key={el.id} item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <Card
                      classAssigned={
                        i % 2 === 0
                          ? classes.projectCardContainer2
                          : classes.projectCardContainer1
                      }
                      projectObj={el}
                      index={i}
                    />
                  </Grid>
                );
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          </Grid>
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[9, 18, 36, 72, { label: "All", value: -1 }]}
            onRowsPerPageChange={rowChange}
            ActionsComponent={TablePaginationActions}
          />
        </Box>
      ) : (
          <div
            // style={{
            //   background: `url(${Record}) no-repeat center center`,
            //   height: "287px",
            //   marginTop: "20vh",
            // }}
          ></div>
      )}
    </React.Fragment>
  );
};

export default ProjectCard;
