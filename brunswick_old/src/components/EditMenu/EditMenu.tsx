import React, { Component } from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Collapse from "@material-ui/core/Collapse";
import ICategory from "../../interfaces/ICategory";
import IAllergy from "../../interfaces/IAllergy";
import IMenuSize from "../../interfaces/IMenuSize";
import IExtra from "../../interfaces/IExtra";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  },
  gridItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  img: {
    width: "64px",
    height: "64px",
    borderRadius: "3px"
  }
});

const MenuProps = {
  PaperProps: {
    style: {
      width: 350,
      maxHeight: 250
    }
  }
};

interface IProvidedProps {
  classes: any;
}

interface IProps {
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

interface IState {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  sizeId: number;
  pricing: number;
  categoryId: number;
  allergyIds: any;
  extraIds: any;
  picture: File | null;
  editPicture: boolean;
  validated: boolean;
}

class EditMenu extends Component<IProvidedProps & IProps, IState> {
  private pictureRef: HTMLInputElement | null;

  constructor(props: IProvidedProps & IProps) {
    super(props);
    this.pictureRef = null;
    this.state = {
      title: this.props.title,
      titleEn: this.props.titleEn,
      description: this.props.description,
      descriptionEn: this.props.descriptionEn,
      sizeId: this.props.sizeId || 0,
      pricing: this.props.pricing,
      categoryId: this.props.categoryId,
      allergyIds: this.props.allergyIds,
      extraIds: this.props.extraIds,
      picture: null,
      editPicture: false,
      validated: true
    };
  }

  handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      title: value
    });
  };

  handleChangeTitleEn = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      titleEn: value
    });
  };

  handleChangeSizeId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({
      sizeId: parseInt(value),
      extraIds: []
    });
  };

  handleChangePricing = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      pricing: parseFloat(value)
    });
  };

  handleChangeCategoryId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({
      categoryId: parseInt(value)
    });
  };

  handleChangeAllergyIds = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({ allergyIds: value });
  };

  handleChangeExtraIds = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({ extraIds: value });
  };

  handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      description: value
    });
  };

  handleChangeDescriptionEn = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      descriptionEn: value
    });
  };

  handleChangePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.pictureRef && this.pictureRef.files) {
      this.setState({
        picture: this.pictureRef.files[0]
      });
    }
  };

  handleChangeEditPicture = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({
      editPicture: checked
    });
  };

  handleValidated = () => {
    const {
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
    } = this.state;
    if (!title || !titleEn || !pricing || !categoryId) {
      this.setState({
        validated: false
      });
    } else {
      this.props.onEdit(
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

  render() {
    const {
      title,
      titleEn,
      sizeId,
      pricing,
      description,
      descriptionEn,
      categoryId,
      allergyIds,
      extraIds,
      editPicture,
      validated
    } = this.state;
    const {
      pictureName,
      categoryList,
      allergyList,
      menuSizeList,
      extraList,
      classes
    } = this.props;
    return (
      <Dialog
        open
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Éditer un menu</DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            <Grid item xs>
              <TextField
                className={classes.margin}
                value={title}
                onChange={this.handleChangeTitle}
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
              <TextField
                className={classes.margin}
                value={titleEn}
                onChange={this.handleChangeTitleEn}
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
          <Grid container spacing={16}>
            <Grid item xs>
              <FormControl className={classes.margin} fullWidth>
                <InputLabel htmlFor="size">Taille</InputLabel>
                <Select
                  value={sizeId}
                  onChange={this.handleChangeSizeId}
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
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl
                className={classes.margin}
                fullWidth
                required
                error={!validated && !pricing}
              >
                <InputLabel htmlFor="adornment-amount">Prix</InputLabel>
                <Input
                  value={pricing}
                  onChange={this.handleChangePricing}
                  id="pricing"
                  type="number"
                  fullWidth
                  inputProps={{ min: "0" }}
                  startAdornment={
                    <InputAdornment position="start">€</InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs>
              <FormControl
                className={classes.margin}
                fullWidth
                required
                error={!validated && !categoryId}
              >
                <InputLabel htmlFor="category">Catégorie</InputLabel>
                <Select
                  value={categoryId}
                  onChange={this.handleChangeCategoryId}
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
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl className={classes.margin} fullWidth>
                <InputLabel htmlFor="select-multiple-checkbox">
                  Allergènes
                </InputLabel>
                <Select
                  multiple
                  value={allergyIds}
                  onChange={this.handleChangeAllergyIds}
                  input={<Input id="select-multiple-checkbox" />}
                  renderValue={(selected: any) =>
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
                        checked={
                          allergyIds.filter((x: number) => x === allergy.id)
                            .length > 0
                        }
                      />
                      <ListItemText primary={allergy.description} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs>
              <FormControl className={classes.margin} fullWidth>
                <InputLabel htmlFor="select-multiple-checkbox">
                  Suppléments
                </InputLabel>
                <Select
                  multiple
                  value={extraIds}
                  onChange={this.handleChangeExtraIds}
                  input={<Input id="select-multiple-checkbox" />}
                  renderValue={(selected: any) =>
                    extraList
                      .filter(extra => selected.includes(extra.id))
                      .map(extra => extra.title)
                      .join(", ")
                  }
                  MenuProps={MenuProps}
                >
                  {extraList
                    .filter(x =>
                      x.menu_size_id ? x.menu_size_id === sizeId : true
                    )
                    .map(extra => (
                      <MenuItem key={extra.id} value={extra.id}>
                        <Checkbox
                          color="primary"
                          checked={
                            extraIds.filter((x: number) => x === extra.id)
                              .length > 0
                          }
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
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl className={classes.margin} fullWidth>
                <Grid container>
                  <Grid item xs className={classes.gridItem}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editPicture}
                          onChange={this.handleChangeEditPicture}
                          color="primary"
                        />
                      }
                      label="Modifier la photo"
                    />
                  </Grid>
                  <Grid item xs className="centered-text">
                    <Collapse in={editPicture} timeout="auto" unmountOnExit>
                      <input
                        accept="image/*"
                        ref={ref => {
                          this.pictureRef = ref;
                        }}
                        type="file"
                        onChange={this.handleChangePicture}
                      />
                    </Collapse>
                    <Collapse
                      in={!editPicture && !!pictureName}
                      timeout="auto"
                      unmountOnExit
                    >
                      <a href={`${S3_BASE_URL}/${pictureName}`} target="_blank">
                        <img
                          className={classes.img}
                          src={`${S3_BASE_URL}/${pictureName}`}
                        />
                      </a>
                    </Collapse>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            className={classes.margin}
            id="standard-multiline-flexible"
            label="Description FR"
            multiline
            rowsMax="4"
            value={description}
            onChange={this.handleChangeDescription}
            fullWidth
          />
          <TextField
            className={classes.margin}
            id="standard-multiline-flexible"
            label="Description EN"
            multiline
            rowsMax="4"
            value={descriptionEn}
            onChange={this.handleChangeDescriptionEn}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Annuler
          </Button>
          <Button onClick={this.handleValidated} color="primary">
            Éditer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditMenu);
