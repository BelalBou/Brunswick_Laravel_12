import React, { Component } from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import IMenuSize from "../../interfaces/IMenuSize";

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  menuSizeList: IMenuSize[];
  onClose: () => void;
  onAdd: (
    title: string,
    titleEn: string,
    pricing: number,
    menuSizeId: number
  ) => void;
}

interface IState {
  title: string;
  titleEn: string;
  pricing: number;
  menuSizeId: number;
  validated: boolean;
}

class AddExtra extends Component<IProvidedProps & IProps, IState> {
  state = {
    title: "",
    titleEn: "",
    pricing: 0,
    menuSizeId: 0,
    validated: true
  };

  handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    this.setState({
      title: value
    });
  };

  handleChangeTitleEn = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    this.setState({
      titleEn: value
    });
  };

  handleChangePricing = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      pricing: parseFloat(value)
    });
  };

  handleChangeMenuSizeId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({
      menuSizeId: parseInt(value)
    });
  };

  handleValidated = () => {
    const { title, titleEn, pricing, menuSizeId } = this.state;
    if (!title || !titleEn || !pricing) {
      this.setState({
        validated: false
      });
    } else {
      this.props.onAdd(title, titleEn, pricing, menuSizeId);
    }
  };

  render() {
    const { title, titleEn, pricing, menuSizeId, validated } = this.state;
    const { menuSizeList, classes } = this.props;
    return (
      <Dialog
        open
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Ajouter un supplément</DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            <Grid item xs>
              <TextField
                className={classes.margin}
                value={title}
                onChange={this.handleChangeTitle}
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
              <TextField
                className={classes.margin}
                value={titleEn}
                onChange={this.handleChangeTitleEn}
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
            <Grid item xs>
              <FormControl className={classes.margin} fullWidth>
                <InputLabel htmlFor="size">Taille de menus</InputLabel>
                <Select
                  value={menuSizeId}
                  onChange={this.handleChangeMenuSizeId}
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Annuler
          </Button>
          <Button onClick={this.handleValidated} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddExtra);
