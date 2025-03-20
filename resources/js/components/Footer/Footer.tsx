import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const StyledFooter = styled("footer")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2)
}));

const Footer: React.FC = (): JSX.Element => (
  <StyledFooter>
    <Typography variant="subtitle1" align="center" color="text.secondary">
      Copyright © 2019{" "}
      <Link href="https://brunswick.com/" target="_blank">
        Brunswick
      </Link>
      . All Rights Reserved.
    </Typography>
  </StyledFooter>
);

export default Footer;
