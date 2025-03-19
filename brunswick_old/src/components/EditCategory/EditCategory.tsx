import React, { Component } from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  title: string;
  titleEn: string;
  order: number;
  onClose: () => void;
  onEdit: (title: string, titleEn: string, order: number) => void;
}

interface IState {
  title: string;
  titleEn: string;
  order: number;
  validated: boolean;
}

class EditCategory extends Component<IProvidedProps & IProps, IState> {
  state = {
    title: this.props.title,
    titleEn: this.props.titleEn,
    order: this.props.order,
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

  handleChangeOrder = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    this.setState({
      order: parseInt(value)
    });
  };

  handleValidated = () => {
    const { title, titleEn, order } = this.state;
    if (!title || !titleEn) {
      this.setState({
        validated: false
      });
    } else {
      this.props.onEdit(title, titleEn, order);
    }
  };

  render() {
    const { title, titleEn, order, validated } = this.state;
    const { classes } = this.props;
    return (
      <Dialog
        open
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Éditer une catégorie</DialogTitle>
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
          <TextField
            className={classes.margin}
            value={order}
            onChange={this.handleChangeOrder}
            id="order"
            label="Ordre"
            type="number"
            fullWidth
            inputProps={{ min: 10, step: 10 }}
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

export default withStyles(styles)(EditCategory);
