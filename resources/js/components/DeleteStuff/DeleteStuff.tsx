import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    minWidth: "400px"
  }
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface DeleteStuffProps {
  title: string;
  description: string;
  onClose: () => void;
  onDelete: () => void;
  checkDictionnary: (tag: string) => string;
}

const DeleteStuff: React.FC<DeleteStuffProps> = ({
  title,
  description,
  onClose,
  onDelete,
  checkDictionnary
}): JSX.Element => (
  <StyledDialog open onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {description}
        </Typography>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <StyledButton onClick={onClose} color="primary">
        {checkDictionnary("_ANNULER")}
      </StyledButton>
      <StyledButton onClick={onDelete} color="secondary">
        {checkDictionnary("_SUPPRIMER")}
      </StyledButton>
    </DialogActions>
  </StyledDialog>
);

export default DeleteStuff;
