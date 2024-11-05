import { Skeleton, TableCell, TableRow } from "@mui/material";

export const SkeletonRows = Array.from({ length: 50 }, (_, index) => (
  <TableRow key={index}>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
  </TableRow>
));
