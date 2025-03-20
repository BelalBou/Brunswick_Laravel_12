import React, { Component } from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  description: string;
  descriptionEn: string;
  onClose: () => void;
  onEdit: (description: string, descriptionEn: string) => void;
}

interface IState {
  description: string;
  descriptionEn: string;
  validated: boolean;
}

class EditAllergy extends Component<IProvidedProps & IProps, IState> {
  state = {
    description: this.props.description,
    descriptionEn: this.props.descriptionEn,
    validated: true
  };

  handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    this.setState({
      description: value
    });
  };

  handleChangeDescriptionEn = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    this.setState({
      descriptionEn: value
    });
  };

  handleValidated = () => {
    const { description, descriptionEn } = this.state;
    if (!description || !descriptionEn) {
      this.setState({
        validated: false
      });
    } else {
      this.props.onEdit(description, descriptionEn);
    }
  };

  render() {
    const { description, descriptionEn, validated } = this.state;
    const { classes } = this.props;
    return (
      <Dialog
        open
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Éditer un allergène</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.margin}
            value={description}
            onChange={this.handleChangeDescription}
            autoFocus
            id="description"
            label="Description FR"
            type="text"
            fullWidth
            required
            error={!validated && !description}
          />
          <TextField
            className={classes.margin}
            value={descriptionEn}
            onChange={this.handleChangeDescriptionEn}
            id="descriptionEn"
            label="Description EN"
            type="text"
            fullWidth
            required
            error={!validated && !descriptionEn}
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

export default withStyles(styles)(EditAllergy);
