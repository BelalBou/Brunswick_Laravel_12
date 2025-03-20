import React, { useState } from "react";
import emailValidator from "email-validator";
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Grid,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface AddSupplierProps {
  onClose: () => void;
  onAdd: (name: string, emailAddress: string, emailAddress2: string, emailAddress3: string, forVendorOnly: boolean) => void;
}

const AddSupplier: React.FC<AddSupplierProps> = ({ onClose, onAdd }): JSX.Element => {
  const [name, setName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [emailAddress2, setEmailAddress2] = useState<string>("");
  const [emailAddress3, setEmailAddress3] = useState<string>("");
  const [forVendorOnly, setForVendorOnly] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeEmailAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress(event.target.value);
  };

  const handleChangeEmailAddress2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress2(event.target.value);
  };

  const handleChangeEmailAddress3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress3(event.target.value);
  };

  const handleChangeForVendorOnly = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForVendorOnly(event.target.checked);
  };

  const handleValidated = () => {
    if (!name || !emailValidator.validate(emailAddress)) {
      setValidated(false);
    } else {
      onAdd(name, emailAddress, emailAddress2, emailAddress3, forVendorOnly);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ajouter un fournisseur</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs>
            <StyledTextField
              value={name}
              onChange={handleChangeName}
              autoFocus
              id="name"
              label="Nom"
              type="text"
              fullWidth
              required
              error={!validated && !name}
            />
          </Grid>
          <Grid item xs>
            <StyledTextField
              value={emailAddress}
              onChange={handleChangeEmailAddress}
              id="emailAddress"
              label="Adresse e-mail"
              type="email"
              fullWidth
              required
              error={!validated && !emailValidator.validate(emailAddress)}
            />
          </Grid>
          <Grid item xs>
            <StyledTextField
              value={emailAddress2}
              onChange={handleChangeEmailAddress2}
              id="emailAddress2"
              label="Adresse e-mail"
              type="email"
              fullWidth        
              error={emailAddress2 !== "" && (!validated && !emailValidator.validate(emailAddress2))}
            />
          </Grid>
          <Grid item xs>
            <StyledTextField
              value={emailAddress3}
              onChange={handleChangeEmailAddress3}
              id="emailAddress3"
              label="Adresse e-mail"
              type="email"
              fullWidth              
              error={emailAddress3 !== "" && (!validated && !emailValidator.validate(emailAddress3))}
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={
            <Checkbox
              checked={forVendorOnly}
              onChange={handleChangeForVendorOnly}
              color="primary"
            />
          }
          label="Disponible uniquement pour les caissiers"
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

export default AddSupplier;
