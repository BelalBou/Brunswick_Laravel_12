import React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import { emphasize } from "@mui/material/styles";
import CancelIcon from "@mui/icons-material/Cancel";
import Select from "react-select";
import classNames from "classnames";

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  zIndex: 1,
  marginTop: theme.spacing(1),
  left: 0,
  right: 0
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25)}px`
}));

const StyledValueContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  flex: 1,
  alignItems: "center",
  overflow: "hidden"
});

const StyledInput = styled("div")({
  display: "flex",
  padding: 0
});

const StyledPlaceholder = styled(Typography)({
  position: "absolute",
  left: 2,
  fontSize: 16
});

interface IntegratedReactSelectProps {
  options: Array<{ value: string; label: string }>;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  isMulti?: boolean;
  isClearable?: boolean;
}

const NoOptionsMessage: React.FC<any> = (props) => (
  <StyledTypography
    color="text.secondary"
    {...props.innerProps}
  >
    {props.children}
  </StyledTypography>
);

const inputComponent: React.FC<any> = ({ inputRef, ...props }) => (
  <div ref={inputRef} {...props} />
);

const Control: React.FC<any> = (props) => (
  <TextField
    fullWidth
    InputProps={{
      inputComponent,
      inputProps: {
        className: StyledInput,
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps
      }
    }}
  />
);

const Option: React.FC<any> = (props) => (
  <MenuItem
    buttonRef={props.innerRef}
    selected={props.isFocused}
    component="div"
    style={{
      fontWeight: props.isSelected ? 500 : 400
    }}
    {...props.innerProps}
  >
    {props.children}
  </MenuItem>
);

const Placeholder: React.FC<any> = (props) => (
  <StyledPlaceholder
    color="text.secondary"
    {...props.innerProps}
  >
    {props.children}
  </StyledPlaceholder>
);

const ValueContainer: React.FC<any> = (props) => (
  <StyledValueContainer {...props.innerProps}>
    {props.children}
  </StyledValueContainer>
);

const MultiValue: React.FC<any> = (props) => (
  <StyledChip
    tabIndex={-1}
    label={props.children}
    onDelete={props.removeProps.onClick}
    deleteIcon={<CancelIcon {...props.removeProps} />}
  />
);

const Menu: React.FC<any> = (props) => (
  <StyledPaper
    square
    {...props.innerProps}
  >
    {props.children}
  </StyledPaper>
);

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer
};

const IntegratedReactSelect: React.FC<IntegratedReactSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  isMulti,
  isClearable
}): JSX.Element => {
  const selectStyles = {
    input: (base: any) => ({
      ...base,
      color: "inherit",
      "& input": {
        font: "inherit"
      }
    })
  };

  return (
    <Select
      styles={selectStyles}
      options={options}
      components={components}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isMulti={isMulti}
      isClearable={isClearable}
    />
  );
};

export default IntegratedReactSelect; 