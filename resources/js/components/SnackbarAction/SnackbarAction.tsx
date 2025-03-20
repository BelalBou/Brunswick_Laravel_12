// /src/components/SnackbarAction/SnackbarAction.tsx
import React from "react";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { green } from "@mui/material/colors";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5)
}));

const StyledSnackbar = styled(Snackbar)<{ variant?: 'success' | 'error' | 'default' }>(
  ({ theme, variant }) => ({
    "& .MuiSnackbarContent-root": {
      backgroundColor: variant === 'success' 
        ? green[600]
        : variant === 'error'
          ? theme.palette.error.dark
          : theme.palette.primary.main
    }
  })
);

interface Props {
  success?: boolean;
  error?: boolean;
  message: React.ReactNode;
  onClose?: () => void;
}

const SnackbarAction: React.FC<Props> = ({ success, error, message, onClose }) => {
  const variant = success ? 'success' : error ? 'error' : 'default';

  return (
    <StyledSnackbar
      variant={variant}
      open
      autoHideDuration={2500}
      onClose={onClose}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <StyledIconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon />
        </StyledIconButton>
      ]}
    />
  );
};

export default SnackbarAction;
