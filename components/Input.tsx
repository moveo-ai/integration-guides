import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React, { ChangeEvent } from 'react';
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
}) => {
  const formatInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
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
    onChange(formatInput(e));
    if (upperCase) {
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
              inputProps={type === 'number' ? { pattern: '[0-9]*' } : {}}
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
