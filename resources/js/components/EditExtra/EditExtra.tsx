import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import IMenuSize from "../../interfaces/IMenuSize";

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

interface EditExtraProps {
  title: string;
  titleEn: string;
  pricing: number;
  menuSizeId: number;
  menuSizeList: IMenuSize[];
  onClose: () => void;
  onEdit: (
    title: string,
    titleEn: string,
    pricing: number,
    menuSizeId: number
  ) => void;
}

const EditExtra: React.FC<EditExtraProps> = ({
  title: initialTitle,
  titleEn: initialTitleEn,
  pricing: initialPricing,
  menuSizeId: initialMenuSizeId,
  menuSizeList,
  onClose,
  onEdit
}): JSX.Element => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [titleEn, setTitleEn] = useState<string>(initialTitleEn);
  const [pricing, setPricing] = useState<number>(initialPricing);
  const [menuSizeId, setMenuSizeId] = useState<number>(initialMenuSizeId);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  const handleChangeTitleEn = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitleEn(event.target.value);
  };

  const handleChangePricing = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPricing(parseFloat(event.target.value));
  };

  const handleChangeMenuSizeId = (event: SelectChangeEvent<number>): void => {
    setMenuSizeId(Number(event.target.value));
  };

  const handleValidated = (): void => {
    if (!title || !titleEn || !pricing) {
      setValidated(false);
    } else {
      onEdit(title, titleEn, pricing, menuSizeId);
    }
  };

  return (
    <StyledDialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Éditer un supplément</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs>
            <StyledTextField
              value={title}
              onChange={handleChangeTitle}
              autoFocus
              id="title"
              label="Libellé FR"
              type="text"
              fullWidth
              required
              error={!validated && !title}
            />
          </Grid>
          <Grid item xs>
            <StyledTextField
              value={titleEn}
              onChange={handleChangeTitleEn}
              id="titleEn"
              label="Libellé EN"
              type="text"
              fullWidth
              required
              error={!validated && !titleEn}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <StyledFormControl
              fullWidth
              required
              error={!validated && !pricing}
            >
              <InputLabel htmlFor="adornment-amount">Prix</InputLabel>
              <Input
                value={pricing}
                onChange={handleChangePricing}
                id="pricing"
                type="number"
                fullWidth
                inputProps={{ min: "0" }}
                startAdornment={
                  <InputAdornment position="start">€</InputAdornment>
                }
              />
            </StyledFormControl>
          </Grid>
          <Grid item xs>
            <StyledFormControl fullWidth>
              <InputLabel htmlFor="size">Taille de menus</InputLabel>
              <Select
                value={menuSizeId}
                onChange={handleChangeMenuSizeId}
                inputProps={{
                  name: "size",
                  id: "size"
                }}
              >
                <MenuItem key={0} value={0}>
                  - Aucune -
                </MenuItem>
                {menuSizeList.map(menuSize => (
                  <MenuItem key={menuSize.id} value={menuSize.id}>
                    {menuSize.title}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>
        </Grid>
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

export default EditExtra;
