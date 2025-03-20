import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";

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

interface EditCategoryProps {
  title: string;
  titleEn: string;
  order: number;
  onClose: () => void;
  onEdit: (title: string, titleEn: string, order: number) => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({
  title: initialTitle,
  titleEn: initialTitleEn,
  order: initialOrder,
  onClose,
  onEdit
}): JSX.Element => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [titleEn, setTitleEn] = useState<string>(initialTitleEn);
  const [order, setOrder] = useState<number>(initialOrder);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  const handleChangeTitleEn = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitleEn(event.target.value);
  };

  const handleChangeOrder = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOrder(parseInt(event.target.value));
  };

  const handleValidated = (): void => {
    if (!title || !titleEn) {
      setValidated(false);
    } else {
      onEdit(title, titleEn, order);
    }
  };

  return (
    <StyledDialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Éditer une catégorie</DialogTitle>
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
          Éditer
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditCategory;
