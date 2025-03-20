import React, { useState } from "react";
import emailValidator from "email-validator";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import moment from "moment";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import FormControl from "@mui/material/FormControl";

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

interface EditSupplierProps {
  name: string;
  emailAddress: string;
  emailAddress2: string;
  emailAddress3: string;
  forVendorOnly: boolean;
  awayStart: moment.Moment;
  awayEnd: moment.Moment;
  onClose: () => void;
  onEdit: (
    name: string,
    emailAddress: string,
    emailAddress2: string,
    emailAddress3: string,
    forVendorOnly: boolean,
    awayStart: moment.Moment,
    awayEnd: moment.Moment
  ) => void;
}

const EditSupplier: React.FC<EditSupplierProps> = ({
  name: initialName,
  emailAddress: initialEmailAddress,
  emailAddress2: initialEmailAddress2,
  emailAddress3: initialEmailAddress3,
  forVendorOnly: initialForVendorOnly,
  awayStart: initialAwayStart,
  awayEnd: initialAwayEnd,
  onClose,
  onEdit
}): JSX.Element => {
  const [name, setName] = useState<string>(initialName);
  const [emailAddress, setEmailAddress] = useState<string>(initialEmailAddress);
  const [emailAddress2, setEmailAddress2] = useState<string>(initialEmailAddress2);
  const [emailAddress3, setEmailAddress3] = useState<string>(initialEmailAddress3);
  const [forVendorOnly, setForVendorOnly] = useState<boolean>(initialForVendorOnly);
  const [awayStart, setAwayStart] = useState<moment.Moment>(initialAwayStart);
  const [awayEnd, setAwayEnd] = useState<moment.Moment>(initialAwayEnd);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeEmailAddress = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailAddress(event.target.value);
  };

  const handleChangeEmailAddress2 = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailAddress2(event.target.value);
  };

  const handleChangeEmailAddress3 = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailAddress3(event.target.value);
  };

  const handleAwayStartChange = (date: moment.Moment | null): void => {
    if (date) {
      setAwayStart(date);
    }
  };

  const handleAwayEndChange = (date: moment.Moment | null): void => {
    if (date) {
      setAwayEnd(date);
    }
  };

  const handleChangeForVendorOnly = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setForVendorOnly(event.target.checked);
  };

  const handleValidated = (): void => {
    if (
      !name ||
      !emailValidator.validate(emailAddress) ||
      (emailAddress2 && !emailValidator.validate(emailAddress2)) ||
      (emailAddress3 && !emailValidator.validate(emailAddress3))
    ) {
      setValidated(false);
    } else {
      onEdit(
        name,
        emailAddress,
        emailAddress2,
        emailAddress3,
        forVendorOnly,
        awayStart,
        awayEnd
      );
      localStorage.setItem("cartList", JSON.stringify([]));
      window.location.reload();
    }
  };

  return (
    <StyledDialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Éditer un fournisseur</DialogTitle>
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
              required
              error={!validated && !emailValidator.validate(emailAddress2)}
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
              required
              error={!validated && !emailValidator.validate(emailAddress3)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid item xs>
              <StyledFormControl>
                <DatePicker
                  label="Depart de vacance"
                  value={awayStart}
                  onChange={handleAwayStartChange}
                  disablePast
                  format="d MMMM yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </StyledFormControl>
            </Grid>
            <Grid item xs>
              <StyledFormControl>
                <DatePicker
                  label="Retour de vacance"
                  value={awayEnd}
                  onChange={handleAwayEndChange}
                  disablePast
                  format="d MMMM yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </StyledFormControl>
            </Grid>
          </LocalizationProvider>
        </Grid>
        <FormControlLabel
          control={
            <Checkbox
              checked={forVendorOnly}
              onChange={handleChangeForVendorOnly}
              value="checkedA"
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
          Éditer
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditSupplier;
