/* eslint-disable @typescript-eslint/no-explicit-any */
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MaterialSelect from '@mui/material/Select';
import React, { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { errorMessage } from '../util/validator';

interface SelectProps {
  defaultValue?: unknown;
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
  const { t } = useTranslation();
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
              native
              value={value}
              onChange={onChange}
              label={placeholder}
              error={!!errors}
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
        <FormHelperText error>{errorMessage(name, errors, t)}</FormHelperText>
      )}
    </div>
  );
};

export default Select;
