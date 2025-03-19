import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme) => ({
  padding: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    },
    paddingTop: 0,
    paddingBottom: theme.spacing.unit * 2
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  children: React.ReactNode;
  dir: string | undefined;
}

const TabContainer = ({ children, dir, classes }: IProvidedProps & IProps) => (
  <Typography component="div" dir={dir} className={classes.padding}>
    {children}
  </Typography>
);

export default withStyles(styles)(TabContainer);
