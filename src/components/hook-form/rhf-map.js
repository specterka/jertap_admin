import { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { Marker, GoogleMap, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

import { Stack, TextField, FormHelperText, CircularProgress } from '@mui/material';

import { GOOGLE_MAP_KEY } from 'src/config-global';

export default function RHFMap({
  name,
  helperText,
  type,
  label = '',
  disabled = false,
  autocomplete = false,
  ...other
}) {
  const { control } = useFormContext();

  const [searchResult, setSearchResult] = useState(null);
  const [address, setAddress] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_KEY,
    libraries: ['places'],
  });

  // Return
  if (!isLoaded) return <CircularProgress />;

  const onLoad = (mapRef) => setSearchResult(mapRef);

  const onPlaceChanged = (onChange) => {
    try {
      if (searchResult != null) {
        const place = searchResult.getPlace();
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        onChange({ latitude, longitude });
        setAddress(place?.formatted_address);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack>
          {autocomplete ? (
            <Autocomplete onLoad={onLoad} onPlaceChanged={() => onPlaceChanged(field.onChange)}>
              <Stack marginY={2}>
                <TextField
                  type="search"
                  placeholder="Search Places"
                  fullWidth
                  value={address}
                  onChange={({ target: { value } }) => setAddress(value)}
                />
              </Stack>
            </Autocomplete>
          ) : null}
          <GoogleMap
            zoom={field.value?.latitude ? 16 : 12}
            center={{
              lat: field.value?.latitude,
              lng: field.value?.longitude,
            }}
            mapContainerStyle={{
              width: '100%',
              height: '200px',
              borderRadius: '18px',
            }}
          >
            <Marker
              position={{
                lat: field.value?.latitude,
                lng: field.value?.longitude,
              }}
              draggable={!disabled}
              onDragEnd={(e) =>
                field.onChange({
                  latitude: e.latLng.lat(),
                  longitude: e.latLng.lng(),
                })
              }
            />
          </GoogleMap>
          {error ? (
            <FormHelperText variant="error">{error?.latitude?.message}</FormHelperText>
          ) : null}
        </Stack>
      )}
    />
  );
}

RHFMap.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  autocomplete: PropTypes.bool,
};
