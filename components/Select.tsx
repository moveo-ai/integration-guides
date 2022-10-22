/* eslint-disable @typescript-eslint/no-explicit-any */
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MaterialSelect from '@mui/material/Select';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { errorMessage } from '../util/validator';

interface SelectProps {
  defaultValue: unknown;
  control: Control<any>;
  name: string;
  placeholder: string;
  errors: any;
  options: {
    label: string;
    value: string;
  }[];
}

const Select = ({
  errors,
  name,
  placeholder,
  control,
  options,
  defaultValue,
}: SelectProps) => {
  const items = useMemo(
    () =>
      options.map((item) => (
        <option key={`${item.label}${item.value}`} value={item.value}>
          {item.label}
        </option>
      )),
    [options]
  );
  return (
    <div className="inline-block relative w-full">
      <FormControl variant="outlined" className="w-full">
        <InputLabel error={!!errors}>{placeholder}</InputLabel>
        <Controller
          render={({ field: { value, onChange } }) => (
            <MaterialSelect
              variant="standard"
              native
              value={value}
              onChange={onChange}
              label={placeholder}
            >
              <option aria-label="Empty option" style={{ display: 'none' }} />
              {items}
            </MaterialSelect>
          )}
          control={control}
          defaultValue={defaultValue}
          name={name}
        />
      </FormControl>
      {errors && (
        <FormHelperText error>{errorMessage(name, errors)}</FormHelperText>
      )}
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  errors: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
};

Select.defaultProps = {
  errors: null,
  placeholder: '',
  defaultValue: '',
};

export default Select;
