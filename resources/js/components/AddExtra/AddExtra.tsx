import React, { useState } from "react";
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  FormControl,
  InputLabel,
  InputAdornment,
  Input,
  MenuItem,
  Select,
  Grid,
  SelectChangeEvent
} from "@mui/material";
import { styled } from "@mui/material/styles";
import IMenuSize from "../../interfaces/IMenuSize";

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1)
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface AddExtraProps {
  menuSizeList: IMenuSize[];
  onClose: () => void;
  onAdd: (
    title: string,
    titleEn: string,
    pricing: number,
    menuSizeId: number
  ) => void;
}

const AddExtra: React.FC<AddExtraProps> = ({ menuSizeList, onClose, onAdd }): JSX.Element => {
  const [title, setTitle] = useState<string>("");
  const [titleEn, setTitleEn] = useState<string>("");
  const [pricing, setPricing] = useState<number>(0);
  const [menuSizeId, setMenuSizeId] = useState<number>(0);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleChangeTitleEn = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleEn(event.target.value);
  };

  const handleChangePricing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPricing(parseFloat(event.target.value));
  };

  const handleChangeMenuSizeId = (event: SelectChangeEvent<number>) => {
    setMenuSizeId(Number(event.target.value));
  };

  const handleValidated = () => {
    if (!title || !titleEn || !pricing) {
      setValidated(false);
    } else {
      onAdd(title, titleEn, pricing, menuSizeId);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ajouter un supplément</DialogTitle>
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
              <InputLabel id="size-label">Taille de menus</InputLabel>
              <Select
                labelId="size-label"
                value={menuSizeId}
                onChange={handleChangeMenuSizeId}
                label="Taille de menus"
              >
                <MenuItem value={0}>
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
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExtra;
