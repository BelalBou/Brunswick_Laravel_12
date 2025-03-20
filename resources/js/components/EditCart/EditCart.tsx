import React, { useState, useMemo } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BugReportIcon from "@mui/icons-material/BugReport";
import placeHolderIcon from "../../images/placeholder.svg";
import ICart from "../../interfaces/ICart";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";
import IAllergy from "../../interfaces/IAllergy";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    margin: `${theme.spacing(3)} !important`,
    [theme.breakpoints.up("md")]: {
      margin: `${theme.spacing(6)} auto !important`
    }
  }
}));

const StyledTextField = styled(TextField)({
  marginTop: 0
});

const StyledImage = styled("img")(({ theme }) => ({
  width: "192px",
  [theme.breakpoints.up("md")]: {
    width: "256px"
  },
  borderRadius: "3px"
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: theme.spacing(1),
  "&.marginDouble": {
    marginTop: theme.spacing(2)
  }
}));

const StyledFormControl = styled(FormControl)({
  width: "100%"
});

const StyledFormControlLabel = styled(FormControlLabel)({
  width: "100%",
  "& .MuiFormControlLabel-label": {
    width: "100%"
  }
});

const StyledFormGroup = styled(FormGroup)({
  width: "100%"
});

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5)
}));

const StyledAllergyTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(1),
  "& .MuiSvgIcon-root": {
    marginRight: theme.spacing(1)
  }
}));

interface EditCartProps {
  cart: ICart;
  userLanguage: string;
  onEditShoppingCart: (cart: ICart, quantity: number, remark: string) => void;
  onDeleteShoppingCart: (cart: ICart) => void;
  onClose: () => void;
  checkDictionnary: (tag: string) => string;
}

const EditCart: React.FC<EditCartProps> = ({
  cart,
  userLanguage,
  onEditShoppingCart,
  onDeleteShoppingCart,
  onClose,
  checkDictionnary
}): JSX.Element => {
  const [quantity, setQuantity] = useState<number>(cart.quantity);
  const [remark, setRemark] = useState<string>(cart.remark);

  const handleAddQuantity = (): void => {
    setQuantity(prev => prev + 1);
  };

  const handleRemoveQuantity = (): void => {
    setQuantity(prev => prev > 0 ? prev - 1 : prev);
  };

  const handleChangeRemark = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRemark(event.target.value);
  };

  const calculateTotalExtras = (): number => {
    if (!cart.extras?.length) return 0;
    return cart.extras.reduce((total, extra) => total + parseFloat(extra.pricing), 0);
  };

  const totalPricing = useMemo(() => {
    return quantity * (cart.menu.pricing + calculateTotalExtras());
  }, [quantity, cart.menu.pricing, cart.extras]);

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
          src={cart.menu.image ? `${S3_BASE_URL}/${cart.menu.image}` : placeHolderIcon}
          alt={cart.menu.title}
        />
      </DialogTitle>
      <DialogContent>
        <StyledTypography variant="h5">
          {cart.menu.title}
        </StyledTypography>
        {cart.menu.menu_size && (
          <StyledTypography color="textSecondary" variant="body1">
            {userLanguage === "en" ? cart.menu.menu_size.title_en : cart.menu.menu_size.title}
          </StyledTypography>
        )}
        {cart.menu.description && (
          <StyledTypography color="textSecondary" variant="body1">
            {cart.menu.description}
          </StyledTypography>
        )}
        {cart.menu.allergies?.length > 0 && (
          <StyledAllergyTypography color="secondary" variant="body1">
            <BugReportIcon />
            {cart.menu.allergies.map((allergy: IAllergy) =>
              userLanguage === "en" ? allergy.description_en : allergy.description
            ).join(", ")}
          </StyledAllergyTypography>
        )}
        {cart.extras?.length > 0 && (
          <StyledFormControl className="marginDouble">
            <FormLabel>
              <StyledTypography variant="h6" gutterBottom>
                {checkDictionnary("_SUPPLEMENTS")}
              </StyledTypography>
            </FormLabel>
            <StyledFormGroup>
              {cart.extras.map(extra => (
                <StyledFormControlLabel
                  key={extra.id}
                  control={
                    <StyledCheckbox
                      color="primary"
                      value={extra.id}
                      checked
                      disabled
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
            </StyledFormGroup>
          </StyledFormControl>
        )}
        <Grid container alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs className="right-text">
            <IconButton color="primary" onClick={handleRemoveQuantity}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Grid>
          <Grid item xs className="centered-text">
            <StyledTypography variant="h5">
              {quantity}
            </StyledTypography>
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
        <StyledTextField
          id="standard-multiline-flexible"
          label={checkDictionnary("_REMARQUES")}
          value={remark}
          onChange={handleChangeRemark}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        {quantity > 0 ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => onEditShoppingCart(cart, quantity, remark)}
          >
            {checkDictionnary("_METTRE_A_JOUR")}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => onDeleteShoppingCart(cart)}
          >
            {checkDictionnary("_SUPPRIMER_LE_MENU")}
          </Button>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default EditCart;
