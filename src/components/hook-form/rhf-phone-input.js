import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MuiTelInput } from 'mui-tel-input';
import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

export default function RHFPhoneInput({ name, disabled = false, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <div>
          <MuiTelInput
            {...field}
            error={invalid}
            inputRef={field.ref}
            fullWidth
            value={field.value ?? ''}
            disabled={disabled}
            {...other}
          />
          {error && (
            <FormHelperText sx={{ px: 2 }} error>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

RHFPhoneInput.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
};
