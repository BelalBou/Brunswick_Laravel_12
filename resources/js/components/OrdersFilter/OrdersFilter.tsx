import React from "react";
import moment from "moment";
import "moment/locale/fr";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import IntegratedReactSelect from "../IntegratedReactSelect/IntegratedReactSelect";
import ISelect from "../../interfaces/ISelect";
import { DateValidationError } from "@mui/x-date-pickers/models";
import Select from "react-select";

moment.locale("fr");

const StyledDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(2)
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  marginTop: theme.spacing(0.5)
}));

interface ISelectOption {
  value: string;
  label: string;
}

interface IProps {
  suppliers: { value: number; label: string }[];
  customers: { value: number; label: string }[];
  userType: string;
  handleToday: boolean;
  handleSuppliers: boolean;
  handleCustomers: boolean;
  selectedDate: moment.Moment | null;
  selectedCustomers: { value: number; label: string }[];
  selectedSuppliers: { value: number; label: string }[];
  onChangeDate: (date: moment.Moment | null) => void;
  onChangeSuppliers: (suppliers: { value: number; label: string }[]) => void;
  onChangeCustomers: (customers: { value: number; label: string }[]) => void;
}

const OrdersFilters: React.FC<IProps> = ({
  suppliers,
  customers,
  userType,
  selectedDate,
  selectedSuppliers,
  selectedCustomers,
  handleToday,
  handleSuppliers,
  handleCustomers,
  onChangeDate,
  onChangeSuppliers,
  onChangeCustomers
}) => {
  const handleDateChange = (
    value: unknown,
    context: { validationError: DateValidationError }
  ) => {
    onChangeDate(value as moment.Moment | null);
  };

  const suppliersOptions = suppliers.map(supplier => ({
    value: supplier.value.toString(),
    label: supplier.label
  }));

  const customersOptions = customers.map(customer => ({
    value: customer.value.toString(),
    label: customer.label
  }));

  const selectedSuppliersOptions = selectedSuppliers.map(supplier => ({
    value: supplier.value.toString(),
    label: supplier.label
  }));

  const selectedCustomersOptions = selectedCustomers.map(customer => ({
    value: customer.value.toString(),
    label: customer.label
  }));

  const handleSuppliersChange = (options: ISelectOption[]) => {
    const newSuppliers = options.map(option => ({
      value: parseInt(option.value),
      label: option.label
    }));
    onChangeSuppliers(newSuppliers);
  };

  const handleCustomersChange = (options: ISelectOption[]) => {
    const newCustomers = options.map(option => ({
      value: parseInt(option.value),
      label: option.label
    }));
    onChangeCustomers(newCustomers);
  };

  return (
    <StyledDiv>
      <Grid container spacing={2} alignItems="center">
        {handleToday && (
          <Grid item xs>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="fr">
              <StyledDatePicker
                format="Do MMMM YYYY"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    placeholder: "Filtrer par date..."
                  },
                  actionBar: {
                    actions: ['clear', 'cancel', 'accept']
                  }
                }}
                localeText={{
                  clearButtonLabel: "Réinitialiser",
                  cancelButtonLabel: "Annuler",
                  okButtonLabel: "Valider"
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}
        {handleSuppliers && (
          <Grid item xs>
            <IntegratedReactSelect
              placeholder="Filtrer par fournisseurs..."
              value={selectedSuppliersOptions}
              onChange={handleSuppliersChange}
              options={suppliersOptions}
              isMulti
              isClearable
            />
          </Grid>
        )}
        {handleCustomers && (
          <Grid item xs>
            <IntegratedReactSelect
              placeholder="Filtrer par clients..."
              value={selectedCustomersOptions}
              onChange={handleCustomersChange}
              options={customersOptions}
              isMulti
              isClearable
            />
          </Grid>
        )}
      </Grid>
    </StyledDiv>
  );
};

export default OrdersFilters;
