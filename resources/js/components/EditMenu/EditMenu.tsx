import React, { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Collapse from "@mui/material/Collapse";
import ICategory from "../../interfaces/ICategory";
import IAllergy from "../../interfaces/IAllergy";
import IMenuSize from "../../interfaces/IMenuSize";
import IExtra from "../../interfaces/IExtra";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

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

const StyledGridItem = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

const StyledImage = styled("img")({
  width: "64px",
  height: "64px",
  borderRadius: "3px"
});

const MenuProps = {
  PaperProps: {
    style: {
      width: 350,
      maxHeight: 250
    }
  }
};

interface EditMenuProps {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  sizeId: number;
  pricing: number;
  categoryId: number;
  allergyIds: number[];
  extraIds: number[];
  pictureName: string;
  categoryList: ICategory[];
  allergyList: IAllergy[];
  menuSizeList: IMenuSize[];
  extraList: IExtra[];
  onClose: () => void;
  onEdit: (
    title: string,
    titleEn: string,
    sizeId: number,
    pricing: number,
    description: string,
    descriptionEn: string,
    categoryId: number,
    allergyIds: number[],
    extraIds: number[],
    picture: File | null,
    editPicture: boolean
  ) => void;
}

const EditMenu: React.FC<EditMenuProps> = ({
  title: initialTitle,
  titleEn: initialTitleEn,
  description: initialDescription,
  descriptionEn: initialDescriptionEn,
  sizeId: initialSizeId,
  pricing: initialPricing,
  categoryId: initialCategoryId,
  allergyIds: initialAllergyIds,
  extraIds: initialExtraIds,
  pictureName,
  categoryList,
  allergyList,
  menuSizeList,
  extraList,
  onClose,
  onEdit
}): JSX.Element => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [titleEn, setTitleEn] = useState<string>(initialTitleEn);
  const [description, setDescription] = useState<string>(initialDescription);
  const [descriptionEn, setDescriptionEn] = useState<string>(initialDescriptionEn);
  const [sizeId, setSizeId] = useState<number>(initialSizeId || 0);
  const [pricing, setPricing] = useState<number>(initialPricing);
  const [categoryId, setCategoryId] = useState<number>(initialCategoryId);
  const [allergyIds, setAllergyIds] = useState<number[]>(initialAllergyIds);
  const [extraIds, setExtraIds] = useState<number[]>(initialExtraIds);
  const [picture, setPicture] = useState<File | null>(null);
  const [editPicture, setEditPicture] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(true);
  const pictureRef = useRef<HTMLInputElement>(null);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  const handleChangeTitleEn = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitleEn(event.target.value);
  };

  const handleChangeSizeId = (event: SelectChangeEvent<number>): void => {
    setSizeId(Number(event.target.value));
    setExtraIds([]);
  };

  const handleChangePricing = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPricing(parseFloat(event.target.value));
  };

  const handleChangeCategoryId = (event: SelectChangeEvent<number>): void => {
    setCategoryId(Number(event.target.value));
  };

  const handleChangeAllergyIds = (event: SelectChangeEvent<number[]>): void => {
    setAllergyIds(event.target.value as number[]);
  };

  const handleChangeExtraIds = (event: SelectChangeEvent<number[]>): void => {
    setExtraIds(event.target.value as number[]);
  };

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDescription(event.target.value);
  };

  const handleChangeDescriptionEn = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDescriptionEn(event.target.value);
  };

  const handleChangePicture = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (pictureRef.current?.files) {
      setPicture(pictureRef.current.files[0]);
    }
  };

  const handleChangeEditPicture = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEditPicture(event.target.checked);
  };

  const handleValidated = (): void => {
    if (!title || !titleEn || !pricing || !categoryId) {
      setValidated(false);
    } else {
      onEdit(
        title,
        titleEn,
        sizeId,
        pricing,
        description,
        descriptionEn,
        categoryId,
        allergyIds,
        extraIds,
        picture,
        editPicture
      );
    }
  };

  return (
    <StyledDialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Éditer un menu</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs>
            <StyledTextField
              value={title}
              onChange={handleChangeTitle}
              autoFocus
              margin="dense"
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
              margin="dense"
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
            <StyledFormControl fullWidth>
              <InputLabel htmlFor="size">Taille</InputLabel>
              <Select
                value={sizeId}
                onChange={handleChangeSizeId}
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
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <StyledFormControl
              fullWidth
              required
              error={!validated && !categoryId}
            >
              <InputLabel htmlFor="category">Catégorie</InputLabel>
              <Select
                value={categoryId}
                onChange={handleChangeCategoryId}
                inputProps={{
                  name: "category",
                  id: "category"
                }}
              >
                {categoryList.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.title}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>
          <Grid item xs>
            <StyledFormControl fullWidth>
              <InputLabel htmlFor="select-multiple-checkbox">
                Allergènes
              </InputLabel>
              <Select
                multiple
                value={allergyIds}
                onChange={handleChangeAllergyIds}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={(selected) =>
                  allergyList
                    .filter(allergy => selected.includes(allergy.id))
                    .map(allergy => allergy.description)
                    .join(", ")
                }
                MenuProps={MenuProps}
              >
                {allergyList.map(allergy => (
                  <MenuItem key={allergy.id} value={allergy.id}>
                    <Checkbox
                      color="primary"
                      checked={allergyIds.includes(allergy.id)}
                    />
                    <ListItemText primary={allergy.description} />
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <StyledFormControl fullWidth>
              <InputLabel htmlFor="select-multiple-checkbox">
                Suppléments
              </InputLabel>
              <Select
                multiple
                value={extraIds}
                onChange={handleChangeExtraIds}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={(selected) =>
                  extraList
                    .filter(extra => selected.includes(extra.id))
                    .map(extra => extra.title)
                    .join(", ")
                }
                MenuProps={MenuProps}
              >
                {extraList
                  .filter(x => x.menu_size_id ? x.menu_size_id === sizeId : true)
                  .map(extra => (
                    <MenuItem key={extra.id} value={extra.id}>
                      <Checkbox
                        color="primary"
                        checked={extraIds.includes(extra.id)}
                      />
                      <ListItemText
                        primary={`${extra.title} (+ ${parseFloat(
                          extra.pricing
                        ).toLocaleString("fr", {
                          minimumFractionDigits: 2
                        })} €)`}
                      />
                    </MenuItem>
                  ))}
              </Select>
            </StyledFormControl>
          </Grid>
          <Grid item xs>
            <StyledFormControl fullWidth>
              <Grid container>
                <Grid item xs>
                  <StyledGridItem>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editPicture}
                          onChange={handleChangeEditPicture}
                          color="primary"
                        />
                      }
                      label="Modifier la photo"
                    />
                  </StyledGridItem>
                </Grid>
                <Grid item xs className="centered-text">
                  <Collapse in={editPicture} timeout="auto" unmountOnExit>
                    <input
                      accept="image/*"
                      ref={pictureRef}
                      type="file"
                      onChange={handleChangePicture}
                    />
                  </Collapse>
                  <Collapse
                    in={!editPicture && !!pictureName}
                    timeout="auto"
                    unmountOnExit
                  >
                    <a href={`${S3_BASE_URL}/${pictureName}`} target="_blank" rel="noopener noreferrer">
                      <StyledImage
                        src={`${S3_BASE_URL}/${pictureName}`}
                        alt="Menu"
                      />
                    </a>
                  </Collapse>
                </Grid>
              </Grid>
            </StyledFormControl>
          </Grid>
        </Grid>
        <StyledTextField
          id="standard-multiline-flexible"
          label="Description FR"
          multiline
          maxRows={4}
          value={description}
          onChange={handleChangeDescription}
          fullWidth
        />
        <StyledTextField
          id="standard-multiline-flexible"
          label="Description EN"
          multiline
          maxRows={4}
          value={descriptionEn}
          onChange={handleChangeDescriptionEn}
          fullWidth
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

export default EditMenu;
