import React from "react";
import { Theme, createStyles } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    close: {
      padding: theme.spacing(0.5)
    }
  });

interface IProps {
  classes: any;
  message: string;
  open: boolean;
  onClose: () => void;
}

const CustomSnackbar = ({ classes, message, open, onClose }: IProps) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
};

export default withStyles(styles)(CustomSnackbar);
