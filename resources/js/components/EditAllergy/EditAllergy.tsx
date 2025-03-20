import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    minWidth: "400px"
  }
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1)
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface EditAllergyProps {
  description: string;
  descriptionEn: string;
  onClose: () => void;
  onEdit: (description: string, descriptionEn: string) => void;
}

const EditAllergy: React.FC<EditAllergyProps> = ({
  description: initialDescription,
  descriptionEn: initialDescriptionEn,
  onClose,
  onEdit
}): JSX.Element => {
  const [description, setDescription] = useState<string>(initialDescription);
  const [descriptionEn, setDescriptionEn] = useState<string>(initialDescriptionEn);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDescription(event.target.value);
  };

  const handleChangeDescriptionEn = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDescriptionEn(event.target.value);
  };

  const handleValidated = (): void => {
    if (!description || !descriptionEn) {
      setValidated(false);
    } else {
      onEdit(description, descriptionEn);
    }
  };

  return (
    <StyledDialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Éditer un allergène</DialogTitle>
      <DialogContent>
        <StyledTextField
          value={description}
          onChange={handleChangeDescription}
          autoFocus
          id="description"
          label="Description FR"
          type="text"
          fullWidth
          required
          error={!validated && !description}
        />
        <StyledTextField
          value={descriptionEn}
          onChange={handleChangeDescriptionEn}
          id="descriptionEn"
          label="Description EN"
          type="text"
          fullWidth
          required
          error={!validated && !descriptionEn}
        />
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          Annuler
        </StyledButton>
        <StyledButton onClick={handleValidated} color="primary">
          Éditer
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditAllergy;
