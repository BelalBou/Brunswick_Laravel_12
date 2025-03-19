import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Divider from "@material-ui/core/Divider";
import BugReportIcon from "@material-ui/icons/BugReport";
import InfoIcon from "@material-ui/icons/Info";

interface IProps {
  title: string;
  size: string;
  description: string;
  allergies: string[];
  onClose: () => void;
}

const DetailsMenu = ({
  title,
  size,
  description,
  allergies,
  onClose
}: IProps) => (
  <Dialog
    maxWidth="md"
    open
    onClose={onClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <List>
        <ListItem>
          <ListItemAvatar>
            <InfoIcon />
          </ListItemAvatar>
          <ListItemText primary="Taille" secondary={size ? size : "/"} />
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemAvatar>
            <InfoIcon />
          </ListItemAvatar>
          <ListItemText
            primary="Description"
            secondary={description ? description : "/"}
          />
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemAvatar>
            <BugReportIcon />
          </ListItemAvatar>
          <ListItemText
            primary="Allergènes"
            secondary={
              allergies && allergies.length > 0 ? allergies.join(", ") : "/"
            }
          />
        </ListItem>
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Fermer
      </Button>
    </DialogActions>
  </Dialog>
);

export default DetailsMenu;
