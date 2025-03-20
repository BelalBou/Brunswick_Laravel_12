import React, { useState } from "react";
import moment from "moment";
import "moment/locale/fr";
import emailValidator from "email-validator";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

moment.locale("fr");

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

interface EditSettingProps {
  timeLimit: string;
  startPeriod: number;
  endPeriod: number;
  emailOrderCc: string;
  emailSupplierCc: string;
  emailVendorCc: string;
  onClose: () => void;
  onEdit: (
    timeLimit: string,
    startPeriod: number,
    endPeriod: number,
    emailOrderCc: string,
    emailSupplierCc: string,
    emailVendorCc: string
  ) => void;
}

const EditSetting: React.FC<EditSettingProps> = ({
  timeLimit: initialTimeLimit,
  startPeriod: initialStartPeriod,
  endPeriod: initialEndPeriod,
  emailOrderCc: initialEmailOrderCc,
  emailSupplierCc: initialEmailSupplierCc,
  emailVendorCc: initialEmailVendorCc,
  onClose,
  onEdit
}): JSX.Element => {
  const [timeLimit, setTimeLimit] = useState<string>(initialTimeLimit);
  const [startPeriod, setStartPeriod] = useState<number>(initialStartPeriod);
  const [endPeriod, setEndPeriod] = useState<number>(initialEndPeriod);
  const [emailOrderCc, setEmailOrderCc] = useState<string>(initialEmailOrderCc);
  const [emailSupplierCc, setEmailSupplierCc] = useState<string>(initialEmailSupplierCc);
  const [emailVendorCc, setEmailVendorCc] = useState<string>(initialEmailVendorCc);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeTimeLimit = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTimeLimit(event.target.value);
  };

  const handleChangeStartPeriod = (event: SelectChangeEvent<number>): void => {
    setStartPeriod(Number(event.target.value));
  };

  const handleChangeEndPeriod = (event: SelectChangeEvent<number>): void => {
    setEndPeriod(Number(event.target.value));
  };

  const handleChangeEmailOrderCc = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailOrderCc(event.target.value.trim().toLowerCase());
  };

  const handleChangeEmailSupplierCc = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailSupplierCc(event.target.value.trim().toLowerCase());
  };

  const handleChangeEmailVendorCc = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailVendorCc(event.target.value.trim().toLowerCase());
  };

  const handleValidateEmailAddress = (emailAddresses: string[]): boolean => {
    if (emailAddresses && emailAddresses.length > 0) {
      return emailAddresses
        .map(emailAddress => emailValidator.validate(emailAddress))
        .every(x => x === true);
    }
    return false;
  };

  const handleValidated = (): void => {
    if (
      !timeLimit ||
      !handleValidateEmailAddress(emailOrderCc.split(";")) ||
      !handleValidateEmailAddress(emailSupplierCc.split(";")) ||
      !handleValidateEmailAddress(emailVendorCc.split(";"))
    ) {
      setValidated(false);
    } else {
      onEdit(
        timeLimit,
        startPeriod,
        endPeriod,
        emailOrderCc,
        emailSupplierCc,
        emailVendorCc
      );
    }
  };

  const handlePeriodSelect = (): JSX.Element[] => {
    return Array.from(Array(7).keys()).map(x => (
      <MenuItem key={x} value={x} className="capitalized-text">
        {moment.weekdays(true)[x]}
      </MenuItem>
    ));
  };

  return (
    <StyledDialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Éditer un paramètre</DialogTitle>
      <DialogContent>
        <StyledTextField
          id="timeLimit"
          label="Heure limite"
          type="time"
          value={timeLimit}
          onChange={handleChangeTimeLimit}
          autoFocus
          defaultValue="11:00"
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{
            step: 900
          }}
          fullWidth
          required
          error={!validated && !timeLimit}
        />
        <Grid container spacing={1}>
          <Grid item xs>
            <StyledFormControl fullWidth required>
              <InputLabel htmlFor="category">Jour de début</InputLabel>
              <Select
                value={startPeriod}
                onChange={handleChangeStartPeriod}
                inputProps={{
                  name: "startPeriod",
                  id: "startPeriod",
                  className: "capitalized-text"
                }}
              >
                {handlePeriodSelect()}
              </Select>
            </StyledFormControl>
          </Grid>
          <Grid item xs>
            <StyledFormControl fullWidth required>
              <InputLabel htmlFor="category">Jour de fin</InputLabel>
              <Select
                value={endPeriod}
                onChange={handleChangeEndPeriod}
                inputProps={{
                  name: "endPeriod",
                  id: "endPeriod",
                  className: "capitalized-text"
                }}
              >
                {handlePeriodSelect()}
              </Select>
            </StyledFormControl>
          </Grid>
        </Grid>
        <StyledTextField
          id="standard-multiline-flexible"
          label="E-mails commandes"
          multiline
          maxRows={4}
          value={emailOrderCc}
          onChange={handleChangeEmailOrderCc}
          fullWidth
          required
          error={!validated && !handleValidateEmailAddress(emailOrderCc.split(";"))}
          helperText="Le caractère « ; » doit être utilisé afin de séparer plusieurs adresses e-mails"
        />
        <StyledTextField
          id="standard-multiline-flexible"
          label="E-mails fournisseurs"
          multiline
          maxRows={4}
          value={emailSupplierCc}
          onChange={handleChangeEmailSupplierCc}
          fullWidth
          required
          error={!validated && !handleValidateEmailAddress(emailSupplierCc.split(";"))}
          helperText="Le caractère « ; » doit être utilisé afin de séparer plusieurs adresses e-mails"
        />
        <StyledTextField
          id="standard-multiline-flexible"
          label="E-mails caissiers"
          multiline
          maxRows={4}
          value={emailVendorCc}
          onChange={handleChangeEmailVendorCc}
          fullWidth
          required
          error={!validated && !handleValidateEmailAddress(emailVendorCc.split(";"))}
          helperText="Le caractère « ; » doit être utilisé afin de séparer plusieurs adresses e-mails"
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

export default EditSetting;
