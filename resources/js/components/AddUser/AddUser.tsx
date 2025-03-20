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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent
} from "@mui/material";
import { styled } from "@mui/material/styles";
import userTypes from "../../utils/UserTypes/UserTypes";
import ISupplier from "../../interfaces/ISupplier";

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1)
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface AddUserProps {
  supplierList: ISupplier[];
  onClose: () => void;
  onAdd: (
    firstName: string,
    lastName: string,
    emailAddress: string,
    type: string,
    supplierId: number,
    language: string
  ) => void;
}

const AddUser: React.FC<AddUserProps> = ({ supplierList, onClose, onAdd }): JSX.Element => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [type, setType] = useState<string>("customer");
  const [supplierId, setSupplierId] = useState<number>(0);
  const [language, setLanguage] = useState<string>("fr");
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleChangeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleChangeEmailAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress(event.target.value.trim().toLowerCase());
  };

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value);
    if (event.target.value === "supplier") {
      setSupplierId(1);
    }
  };

  const handleChangeSupplierId = (event: SelectChangeEvent<number>) => {
    setSupplierId(Number(event.target.value));
  };

  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleValidated = () => {
    if (
      !firstName ||
      !lastName ||
      !emailValidator.validate(emailAddress) ||
      !type ||
      (type === "supplier" && !supplierId) ||
      !language
    ) {
      setValidated(false);
    } else {
      onAdd(
        firstName,
        lastName,
        emailAddress,
        type,
        supplierId,
        language
      );
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ajouter un utilisateur</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs>
            <StyledTextField
              value={lastName}
              onChange={handleChangeLastName}
              autoFocus
              id="lastName"
              label="Nom"
              type="text"
              fullWidth
              required
              error={!validated && !lastName}
            />
          </Grid>
          <Grid item xs>
            <StyledTextField
              value={firstName}
              onChange={handleChangeFirstName}
              id="firstName"
              label="Prénom"
              type="text"
              fullWidth
              required
              error={!validated && !firstName}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
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
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <StyledFormControl
              fullWidth
              required
              error={!validated && !type}
            >
              <InputLabel htmlFor="type">Rôle</InputLabel>
              <Select
                value={type}
                onChange={handleChangeType}
                labelId="type"
                id="type"
              >
                {userTypes.map(userType => (
                  <MenuItem key={userType.value} value={userType.value}>
                    {userType.label}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>
          {type === "supplier" && (
            <Grid item xs>
              <StyledFormControl
                fullWidth
                required
                error={!validated && (type === "supplier" && !supplierId)}
              >
                <InputLabel htmlFor="supplier">Fournisseur</InputLabel>
                <Select
                  value={supplierId}
                  onChange={handleChangeSupplierId}
                  labelId="supplier"
                  id="supplier"
                >
                  {supplierList.map(supplier => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Grid>
          )}
        </Grid>
        <StyledFormControl
          fullWidth
          required
          error={!validated && !language}
        >
          <InputLabel htmlFor="language">Langue</InputLabel>
          <Select
            value={language}
            onChange={handleChangeLanguage}
            labelId="language"
            id="language"
          >
            <MenuItem key="en" value="en">
              🇺🇸 English
            </MenuItem>
            <MenuItem key="fr" value="fr">
              🇫🇷 Français
            </MenuItem>
          </Select>
        </StyledFormControl>
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

export default AddUser;
