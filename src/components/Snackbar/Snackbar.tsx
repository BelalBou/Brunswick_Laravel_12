import React from "react";
import classNames from "classnames";
import { withStyles, Theme } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";

const variantIcon: any = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = (theme: Theme) => ({
  success: {
    backgroundColor: green[600],
    maxWidth: "100%"
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    maxWidth: "100%"
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
    maxWidth: "100%"
  },
  warning: {
    backgroundColor: amber[700],
    maxWidth: "100%"
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  className: string;
  message: string;
  variant: string;
  onClose: () => void;
}

function SnackbarComponent(props: IProvidedProps & IProps) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];
  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

export default withStyles(styles)(SnackbarComponent);
