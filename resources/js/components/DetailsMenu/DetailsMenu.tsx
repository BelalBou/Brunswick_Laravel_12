import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import BugReportIcon from "@mui/icons-material/BugReport";
import InfoIcon from "@mui/icons-material/Info";

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    minWidth: "500px"
  }
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2)
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0)
}));

interface DetailsMenuProps {
  title: string;
  size: string;
  description: string;
  allergies: string[];
  onClose: () => void;
}

const DetailsMenu: React.FC<DetailsMenuProps> = ({
  title,
  size,
  description,
  allergies,
  onClose
}): JSX.Element => (
  <StyledDialog
    maxWidth="md"
    open
    onClose={onClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <List>
        <StyledListItem>
          <ListItemAvatar>
            <InfoIcon />
          </ListItemAvatar>
          <ListItemText primary="Taille" secondary={size || "/"} />
        </StyledListItem>
        <StyledDivider variant="middle" />
        <StyledListItem>
          <ListItemAvatar>
            <InfoIcon />
          </ListItemAvatar>
          <ListItemText
            primary="Description"
            secondary={description || "/"}
          />
        </StyledListItem>
        <StyledDivider variant="middle" />
        <StyledListItem>
          <ListItemAvatar>
            <BugReportIcon />
          </ListItemAvatar>
          <ListItemText
            primary="Allergènes"
            secondary={allergies?.length > 0 ? allergies.join(", ") : "/"}
          />
        </StyledListItem>
      </List>
    </DialogContent>
    <DialogActions>
      <StyledButton onClick={onClose} color="primary">
        Fermer
      </StyledButton>
    </DialogActions>
  </StyledDialog>
);

export default DetailsMenu;
