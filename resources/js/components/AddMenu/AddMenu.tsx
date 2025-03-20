import React, { useState, useRef } from "react";
import { 
  Button, 
  TextField, 
  Input,
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Checkbox,
  ListItemText,
  FormControlLabel,
  SelectChangeEvent
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ICategory from "../../interfaces/ICategory";
import IAllergy from "../../interfaces/IAllergy";
import IMenuSize from "../../interfaces/IMenuSize";
import IExtra from "../../interfaces/IExtra";

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

const MenuProps = {
  PaperProps: {
    style: {
      width: 350,
      maxHeight: 250
    }
  }
};

interface AddMenuProps {
  categoryList: ICategory[];
  allergyList: IAllergy[];
  menuSizeList: IMenuSize[];
  extraList: IExtra[];
  onClose: () => void;
  onAdd: (
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
    addPicture: boolean
  ) => void;
}

const AddMenu: React.FC<AddMenuProps> = ({ 
  categoryList, 
  allergyList, 
  menuSizeList, 
  extraList, 
  onClose, 
  onAdd 
}): JSX.Element => {
  const pictureRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>("");
  const [titleEn, setTitleEn] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionEn, setDescriptionEn] = useState<string>("");
  const [sizeId, setSizeId] = useState<number>(0);
  const [pricing, setPricing] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(
    categoryList && categoryList.length > 0 ? categoryList[0].id : 0
  );
  const [allergyIds, setAllergyIds] = useState<number[]>([]);
  const [extraIds, setExtraIds] = useState<number[]>([]);
  const [supplierId] = useState<number>(1);
  const [picture, setPicture] = useState<File | null>(null);
  const [addPicture, setAddPicture] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(true);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleChangeTitleEn = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleEn(event.target.value);
  };

  const handleChangeSizeId = (event: SelectChangeEvent<number>) => {
    setSizeId(Number(event.target.value));
    setExtraIds([]);
  };

  const handleChangePricing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPricing(parseFloat(event.target.value));
  };

  const handleChangeCategoryId = (event: SelectChangeEvent<number>) => {
    setCategoryId(Number(event.target.value));
  };

  const handleChangeAllergyIds = (event: SelectChangeEvent<number[]>) => {
    setAllergyIds(event.target.value as number[]);
  };

  const handleChangeExtraIds = (event: SelectChangeEvent<number[]>) => {
    setExtraIds(event.target.value as number[]);
  };

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleChangeDescriptionEn = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionEn(event.target.value);
  };

  const handleChangePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (pictureRef.current?.files) {
      setPicture(pictureRef.current.files[0]);
    }
  };

  const handleChangeAddPicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddPicture(event.target.checked);
  };

  const handleValidated = () => {
    if (!title || !titleEn || !pricing || !categoryId) {
      setValidated(false);
    } else {
      onAdd(
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
        addPicture
      );
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ajouter un menu</DialogTitle>
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
            <StyledFormControl fullWidth>
              <InputLabel id="size-label">Taille</InputLabel>
              <Select
                labelId="size-label"
                value={sizeId}
                onChange={handleChangeSizeId}
                label="Taille"
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
              <InputLabel id="category-label">Catégorie</InputLabel>
              <Select
                labelId="category-label"
                value={categoryId}
                onChange={handleChangeCategoryId}
                label="Catégorie"
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
              <InputLabel id="allergy-label">Allergènes</InputLabel>
              <Select
                labelId="allergy-label"
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
              <InputLabel id="extra-label">Suppléments</InputLabel>
              <Select
                labelId="extra-label"
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
                <StyledGridItem item xs>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={addPicture}
                        onChange={handleChangeAddPicture}
                        color="primary"
                      />
                    }
                    label="Ajouter une photo"
                  />
                </StyledGridItem>
                {addPicture && (
                  <StyledGridItem item xs>
                    <input
                      accept="image/*"
                      ref={pictureRef}
                      type="file"
                      onChange={handleChangePicture}
                    />
                  </StyledGridItem>
                )}
              </Grid>
            </StyledFormControl>
          </Grid>
        </Grid>
        <StyledTextField
          id="description"
          label="Description FR"
          multiline
          maxRows={4}
          value={description}
          onChange={handleChangeDescription}
          fullWidth
        />
        <StyledTextField
          id="description-en"
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
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMenu;
