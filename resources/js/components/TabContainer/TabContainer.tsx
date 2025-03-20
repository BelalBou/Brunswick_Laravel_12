import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const StyledTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  paddingTop: 0,
  paddingBottom: theme.spacing(2)
}));

interface IProps {
  children: React.ReactNode;
  dir: string | undefined;
}

const TabContainer: React.FC<IProps> = ({ children, dir }) => (
  <StyledTypography as="div" dir={dir}>
    {children}
  </StyledTypography>
);

export default TabContainer;
