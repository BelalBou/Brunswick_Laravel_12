import React, { useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface AddAllergyProps {
  onClose: () => void;
  onAdd: (description: string, descriptionEn: string) => void;
}

const AddAllergy: React.FC<AddAllergyProps> = ({ onClose, onAdd }) => {
  const [description, setDescription] = useState<string>("");
  const [descriptionEn, setDescriptionEn] = useState<string>("");
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleChangeDescriptionEn = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionEn(event.target.value);
  };

  const handleValidated = () => {
    if (!description && !descriptionEn) {
      setValidated(false);
    } else {
      onAdd(description, descriptionEn);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ajouter un allergène</DialogTitle>
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
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleValidated} color="primary">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAllergy;
