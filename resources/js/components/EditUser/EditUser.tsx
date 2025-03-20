import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import emailValidator from "email-validator";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import userTypes from "../../utils/UserTypes/UserTypes";
import ISupplier from "../../interfaces/ISupplier";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: `${theme.spacing(3)} !important`,
    [theme.breakpoints.up("md")]: {
      margin: `${theme.spacing(6)} auto !important`
    }
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1)
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface EditUserProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  type: string;
  supplierId: number;
  language: string;
  supplierList: ISupplier[];
  onClose: () => void;
  onEdit: (
    firstName: string,
    lastName: string,
    emailAddress: string,
    type: string,
    supplierId: number,
    language: string,
    resetPassword: boolean
  ) => void;
}

const EditUser: React.FC<EditUserProps> = ({
  firstName: initialFirstName,
  lastName: initialLastName,
  emailAddress: initialEmailAddress,
  type: initialType,
  supplierId: initialSupplierId,
  language: initialLanguage,
  supplierList,
  onClose,
  onEdit
}): JSX.Element => {
  const [firstName, setFirstName] = useState<string>(initialFirstName);
  const [lastName, setLastName] = useState<string>(initialLastName);
  const [emailAddress, setEmailAddress] = useState<string>(initialEmailAddress);
  const [type, setType] = useState<string>(initialType);
  const [supplierId, setSupplierId] = useState<number>(initialSupplierId);
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeFirstName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstName(event.target.value);
  };

  const handleChangeLastName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value);
  };

  const handleChangeEmailAddress = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailAddress(event.target.value.trim().toLowerCase());
  };

  const handleChangeType = (event: SelectChangeEvent<string>): void => {
    const newType = event.target.value;
    setType(newType);
    if (newType === "supplier") {
      setSupplierId(1);
    }
  };

  const handleChangeSupplierId = (event: SelectChangeEvent<number>): void => {
    setSupplierId(Number(event.target.value));
  };

  const handleChangeLanguage = (event: SelectChangeEvent<string>): void => {
    setLanguage(event.target.value);
  };

  const handleChangeResetPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setResetPassword(event.target.checked);
  };

  const handleValidated = (): void => {
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
      onEdit(
        firstName,
        lastName,
        emailAddress,
        type,
        supplierId,
        language,
        resetPassword
      );
    }
  };

  return (
    <StyledDialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Éditer un utilisateur</DialogTitle>
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
                inputProps={{
                  name: "type",
                  id: "type"
                }}
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
                <InputLabel htmlFor="category">Fournisseur</InputLabel>
                <Select
                  value={supplierId}
                  onChange={handleChangeSupplierId}
                  inputProps={{
                    name: "category",
                    id: "category"
                  }}
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
          <InputLabel htmlFor="category">Langue</InputLabel>
          <Select
            value={language}
            onChange={handleChangeLanguage}
            inputProps={{
              name: "language",
              id: "language"
            }}
          >
            <MenuItem key="en" value="en">
              🇺🇸 English
            </MenuItem>
            <MenuItem key="fr" value="fr">
              🇫🇷 Français
            </MenuItem>
          </Select>
        </StyledFormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={resetPassword}
              onChange={handleChangeResetPassword}
              value="checkedA"
              color="primary"
            />
          }
          label="Réinitialiser le mot de passe"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleValidated} color="primary">
          Éditer
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditUser;
