import React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const styles = (theme: Theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 2
  }
});

interface IProvidedProps {
  classes: any;
}

const Footer = ({ classes }: IProvidedProps) => (
  <footer className={classes.footer}>
    <Typography variant="subtitle1" align="center" color="textSecondary">
      Copyright © 2019{" "}
      <Link href="https://brunswick.com/" target="_blank">
        Brunswick
      </Link>
      . All Rights Reserved.
    </Typography>
  </footer>
);

export default withStyles(styles)(Footer);
