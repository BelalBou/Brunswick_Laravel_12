import React, { useState } from "react";
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Grid
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ISupplier from "../../interfaces/ISupplier";

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface AddCategoryProps {
  supplierList: ISupplier[];
  onClose: () => void;
  onAdd: (title: string, titleEn: string, order: number) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState<string>("");
  const [titleEn, setTitleEn] = useState<string>("");
  const [order, setOrder] = useState<number>(10);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleChangeTitleEn = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleEn(event.target.value);
  };

  const handleChangeOrder = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrder(parseInt(event.target.value));
  };

  const handleValidated = () => {
    if (!title || !titleEn) {
      setValidated(false);
    } else {
      onAdd(title, titleEn, order);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ajouter une catégorie</DialogTitle>
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
        <StyledTextField
          value={order}
          onChange={handleChangeOrder}
          id="order"
          label="Ordre"
          type="number"
          fullWidth
          inputProps={{ min: 10, step: 10 }}
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

export default AddCategory;
