import React, { useState } from "react";
import { 
  Button, 
  Typography, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Grid,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";
import extraSort from "../../utils/ExtraSort/ExtraSort";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paperScrollBody': {
    margin: `${theme.spacing(3)} !important`,
    [theme.breakpoints.up("md")]: {
      margin: `${theme.spacing(6)} auto !important`,
      maxWidth: "400px !important"
    }
  }
}));

const StyledDialogContent = styled(DialogContent)({
  paddingBottom: 0
});

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  boxShadow: "0px -3px 6px -2px rgba(0,0,0,0.07)",
  padding: theme.spacing(2),
  display: "block",
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: "192px",
  [theme.breakpoints.up("md")]: {
    width: "256px"
  },
  borderRadius: "3px"
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2)
}));

const StyledFormControlLabel = styled(FormControlLabel)({
  width: "100%",
  '& .MuiFormControlLabel-label': {
    width: "100%"
  }
});

const StyledRadioGroup = styled(RadioGroup)({
  width: "100%"
});

const StyledRadio = styled(Radio)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5)
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1)
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    marginBottom: 0
  }
}));

interface AddCartProps {
  menu: IMenu;
  menus: IMenu[];
  userLanguage: string;
  onAdd: (item: ICart) => void;
  onClose: () => void;
  checkDictionnary: (tag: string) => string;
}

const AddCart: React.FC<AddCartProps> = ({ 
  menu, 
  menus, 
  userLanguage, 
  onAdd, 
  onClose, 
  checkDictionnary 
}) => {
  const [currentMenu, setCurrentMenu] = useState<IMenu>(menu);
  const [currentMenuId, setCurrentMenuId] = useState<number>(menu.id);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedExtras, setSelectedExtras] = useState<IExtra[]>([]);

  const handleRemoveQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : prev);
  };

  const handleAddQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMenu = menus.find(x => x.id === parseInt(event.target.value));
    if (selectedMenu) {
      setCurrentMenu(selectedMenu);
      setCurrentMenuId(selectedMenu.id);
      setSelectedExtras([]);
    }
  };

  const handleChangeExtra = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const extraId = parseInt(value);
    
    if (checked) {
      const selectedExtra = currentMenu.extras.find((x: IExtra) => x.id === extraId);
      if (selectedExtra) {
        setSelectedExtras(prev => [...prev, selectedExtra]);
      }
    } else {
      setSelectedExtras(prev => prev.filter(x => x.id !== extraId));
    }
  };

  const calculateTotalExtras = () => {
    return selectedExtras.reduce((total, extra) => total + parseFloat(extra.pricing), 0);
  };

  const totalPricing = quantity * currentMenu.pricing + quantity * calculateTotalExtras();

  return (
    <StyledDialog
      open
      scroll="body"
      maxWidth="xs"
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" className="centered-text">
        <StyledImage
          src={currentMenu.image ? `${S3_BASE_URL}/${currentMenu.image}` : placeHolderIcon}
          alt={currentMenu.title}
        />
      </DialogTitle>
      <StyledDialogContent>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {currentMenu.title}
        </Typography>
        {currentMenu.menu_size && (!menus || menus.length === 1) && (
          <Typography color="textSecondary" variant="body1" sx={{ mt: 1 }}>
            {currentMenu.menu_size.title}
          </Typography>
        )}
        {currentMenu.description && (
          <Typography color="textSecondary" variant="body1" sx={{ mt: 1 }}>
            {currentMenu.description}
          </Typography>
        )}
        {menus && menus.length > 1 && (
          <StyledFormControl>
            <FormLabel>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                {checkDictionnary("_TAILLE")}
              </Typography>
            </FormLabel>
            <StyledRadioGroup
              aria-label="Size"
              name="size"
              value={currentMenuId.toString()}
              onChange={handleChangeSize}
            >
              {menus.map(menu => (
                <StyledFormControlLabel
                  key={menu.id}
                  value={menu.id.toString()}
                  control={<StyledRadio color="primary" />}
                  label={menu.menu_size.title}
                />
              ))}
            </StyledRadioGroup>
          </StyledFormControl>
        )}
        {currentMenu.extras && currentMenu.extras.length > 0 && (
          <StyledFormControl>
            <FormLabel>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                {checkDictionnary("_SUPPLEMENTS")}
              </Typography>
            </FormLabel>
            <FormGroup>
              {currentMenu.extras.sort(extraSort).map((extra: IExtra) => (
                <StyledFormControlLabel
                  key={extra.id}
                  control={
                    <Checkbox
                      color="primary"
                      value={extra.id.toString()}
                      checked={selectedExtras.some(x => x.id === extra.id)}
                      onChange={handleChangeExtra}
                    />
                  }
                  label={
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography variant="body1" noWrap>
                          {userLanguage === "en" ? extra.title_en : extra.title}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body1">
                          {`(+ ${parseFloat(extra.pricing).toLocaleString("fr", {
                            minimumFractionDigits: 2
                          })} €)`}
                        </Typography>
                      </Grid>
                    </Grid>
                  }
                />
              ))}
            </FormGroup>
          </StyledFormControl>
        )}
        <Grid container alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs className="right-text">
            <IconButton color="primary" onClick={handleRemoveQuantity}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Grid>
          <Grid item xs className="centered-text">
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {quantity}
            </Typography>
          </Grid>
          <Grid item xs className="left-text">
            <IconButton color="primary" onClick={handleAddQuantity}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Grid>
        </Grid>
        <div className="centered-text">
          <Typography color="textSecondary" variant="body1">
            {checkDictionnary("_PRIX")} :{" "}
            {totalPricing.toLocaleString("fr", {
              minimumFractionDigits: 2
            })}{" "}
            €
          </Typography>
        </div>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => onAdd({ menu: currentMenu, quantity, remark: "", extras: selectedExtras })}
          fullWidth
        >
          {checkDictionnary("_AJOUTER_AU_PANIER")}
        </StyledButton>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          fullWidth
        >
          {checkDictionnary("_ANNULER")}
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default AddCart;
