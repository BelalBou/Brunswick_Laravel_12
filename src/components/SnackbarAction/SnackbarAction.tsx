// /src/components/SnackbarAction/SnackbarAction.tsx
import React from "react";
import { Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import green from "@material-ui/core/colors/green";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme: Theme) => ({
  iconButton: {
    padding: theme.spacing.unit / 2
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  default: {
    background: theme.palette.primary.main
  }
});

interface Props {
  success?: boolean;
  error?: boolean;
  message: React.ReactNode;
  classes: any;
  onClose?: () => void;
}

function SnackbarAction(props: Props) {
  function renderRootClassName() {
    if (props.success) {
      return props.classes.success;
    }
    if (props.error) {
      return props.classes.error;
    }
    return props.classes.default;
  }

  return (
    <Snackbar
      open
      autoHideDuration={2500}
      onClose={props.onClose}
      ContentProps={{
        classes: {
          root: renderRootClassName()
        }
      }}
      message={<span id="message-id">{props.message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={props.classes.iconButton}
          onClick={props.onClose}
        >
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
}

export default withStyles(styles)(SnackbarAction);
