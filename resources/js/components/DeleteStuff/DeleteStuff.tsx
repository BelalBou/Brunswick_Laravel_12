import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

interface IProps {
  title: string;
  description: string;
  onClose: () => void;
  onDelete: () => void;
  checkDictionnary: (tag: string) => string;
}

const DeleteStuff = ({
  title,
  description,
  onClose,
  onDelete,
  checkDictionnary
}: IProps) => (
  <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {description}
        </Typography>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        {checkDictionnary("_ANNULER")}
      </Button>
      <Button onClick={() => onDelete()} color="secondary">
        {checkDictionnary("_SUPPRIMER")}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteStuff;
