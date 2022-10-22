import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { ChangeEvent } from 'react';
import { Controller } from 'react-hook-form';
import { errorMessage } from '../util/validator';

const Input = ({
  errors,
  name,
  control,
  placeholder,
  information,
  onBlur,
  type,
  upperCase,
  inputMode,
  maxLength,
  isCurrency,
}) => {
  const formatInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let newValue: string;
    if (isCurrency) {
      newValue = e.target.value.toString().split('.').join('');
      newValue = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    } else {
      newValue = e.target.value
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }
    const newEvent = {
      ...e,
      target: {
        value: newValue,
      },
    };
    return newEvent;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange
  ) => {
    if (upperCase || isCurrency) {
      onChange(formatInput(e));
    } else {
      onChange(e);
    }
  };
  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field: { onChange, value } }) => {
          return (
            <TextField
              onBlur={() => onBlur(name, value)}
              onInput={(event) => {
                if (maxLength && (type === 'number' || isCurrency)) {
                  const e = event.target as HTMLInputElement;
                  e.value = e.value.toString().slice(0, maxLength);
                }
              }}
              id="outlined-error-helper-text"
              label={placeholder}
              variant="outlined"
              error={!!errors}
              helperText={!!errors && errorMessage(name, errors)}
              fullWidth
              type={type}
              value={value}
              inputMode={inputMode}
              autoComplete="off"
              inputProps={
                type === 'number' || isCurrency
                  ? { pattern: '[0-9,.]*' }
                  : { maxLength }
              }
              onChange={(e) => handleChange(e, onChange)}
            />
          );
        }}
      />
      {!errors && <FormHelperText>{information}</FormHelperText>}
    </>
  );
};

Input.propTypes = {
  errors: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  control: PropTypes.object.isRequired,
  information: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  inputMode: PropTypes.string,
  upperCase: PropTypes.bool,
  maxLength: PropTypes.number,
  isCurrency: PropTypes.bool,
};

Input.defaultProps = {
  errors: null,
  placeholder: '',
  information: '',
  type: 'text',
  inputMode: 'none',
  autoComplete: 'off',
  upperCase: false,
  onBlur: () => null,
};

export default Input;
