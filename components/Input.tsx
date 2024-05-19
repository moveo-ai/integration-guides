import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import { ChangeEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { errorMessage } from '../util/validator';

type InputProps = {
  errors?: any;
  name: string;
  control: any;
  placeholder?: string;
  information?: string;
  onBlur?: (name: string, value: string) => void;
  type?: 'text' | 'number' | 'password' | 'email' | 'string';
  upperCase?: boolean;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'none';
  maxLength?: number;
  isCurrency?: boolean;
};

const Input = ({
  errors,
  name,
  control,
  placeholder,
  information,
  onBlur = (_, __) => {},
  type = 'text',
  upperCase,
  inputMode = 'none',
  maxLength,
  isCurrency,
}: InputProps) => {
  const { t } = useTranslation();
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
              helperText={!!errors && errorMessage(name, errors, t)}
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

export default Input;
