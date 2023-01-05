import moment from "moment/moment";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";

const VideoStatusTable = ({ headers, status }) => {
  return (
    <>
      {status.length > 0 ? (
        <TableRow
          style={{
            borderLeft: `2px solid #E9F7EF`,
            borderRight: `2px solid #E9F7EF`,
            backgroundColor: "#fff",
          }}
        >
          <TableCell colSpan={9}>
            <Box style={{ margin: "0 80px" }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow
                    style={{
                      height: "60px",
                    }}
                  >
                    {headers.map((item) => {
                      return (
                        <TableCell sx={{ padding: "6px 16px" }}>
                          {item}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {status.map((item) => {
                    return (
                      <TableRow
                        style={{
                          backgroundColor: "rgba(254, 191, 44, 0.1)",
                          height: "60px",
                        }}
                      >
                        <TableCell sx={{ width: "20%" }}>
                          {item.language_pair}
                        </TableCell>
                        <TableCell sx={{ width: "20%" }}>
                          {moment(item.created_at).format(
                            "DD/MM/YYYY hh:mm:ss"
                          )}
                        </TableCell>
                        <TableCell sx={{ width: "20%" }}>
                          {item.user.username}
                        </TableCell>
                        <TableCell sx={{ width: "40%" }}>
                          {item.task_status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </TableCell>
        </TableRow>
      ) : (
        <></>
      )}
    </>
  );
};

export default VideoStatusTable;
