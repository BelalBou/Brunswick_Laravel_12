import React from "react";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5)
}));

interface IProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const CustomSnackbar: React.FC<IProps> = ({ message, open, onClose }) => {
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
        <StyledIconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon />
        </StyledIconButton>
      ]}
    />
  );
};

export default CustomSnackbar;
