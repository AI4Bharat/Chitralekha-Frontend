import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const VideoStatusTable = ({ headers }) => {
  return (
    <TableRow
      style={{
        borderLeft: `2px solid #E9F7EF`,
        borderRight: `2px solid #E9F7EF`,
      }}
    >
      <TableCell colSpan={9}>
        <Box style={{ margin: "0 80px" }}>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                {headers.map((item) => {
                  return <TableCell>{item}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                style={{
                  backgroundColor: "rgba(254, 191, 44, 0.1)",
                }}
              >
                <TableCell>English - Hindi</TableCell>
                <TableCell>03/01/2023 04:50:00</TableCell>
                <TableCell>Harsh Malviya</TableCell>
                <TableCell>NEW</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default VideoStatusTable;
