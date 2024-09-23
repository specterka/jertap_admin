import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Marker, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Grid, Card, Button, Typography, ListItemText } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { API_ROUTER } from 'src/utils/axios';
import { getTranslatedData } from 'src/utils/misc';

import { useLocales } from 'src/locales';
import { GOOGLE_MAP_KEY } from 'src/config-global';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { axiosPatch, axiosDelete } from 'src/services/axiosHelper';

import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

export default function BusinessRequestDialog({
  isEdit = false,
  open,
  onClose,
  fetchData = () => {},
  ...other
}) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Hooks
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();

  // Handlers
  const onCloseDialog = () => {
    onClose();
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axiosPatch(API_ROUTER.business.requests.update(isEdit.id));
      setIsLoading(false);

      if (!res.status)
        return enqueueSnackbar(res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.BUSINESS_REQUEST_APPROVED_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        fetchData();
        onCloseDialog();
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await axiosDelete(API_ROUTER.business.requests.remove(isEdit.id));
      setIsDeleting(false);

      if (!res.status)
        return enqueueSnackbar(res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.BUSINESS_REQUEST_DELETE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        fetchData();
        onCloseDialog();
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onCloseDialog} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>Business Request</DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 1, border: 'none' }}>
        <Grid container spacing={2}>
          {isEdit?.name && (
            <BusinessRequestItem
              prev={{
                label: isEdit?.is_approved ? 'Previous name' : 'Old name',
                value: isEdit?.restaurant?.name,
              }}
              next={{
                label: isEdit?.is_approved ? 'Updated name' : 'New name',
                value: isEdit?.name,
              }}
              title="Business Name"
            />
          )}
          {isEdit?.location && (
            <BusinessRequestItem
              prev={{
                label: isEdit?.is_approved ? 'Previous location' : 'Old location',
                value: isEdit?.restaurant?.location,
              }}
              next={{
                label: isEdit?.is_approved ? 'Updated location' : 'New location',
                value: isEdit?.location,
              }}
              title="Business Location"
            />
          )}
          {isEdit?.address && (
            <BusinessRequestItem
              prev={{
                label: isEdit?.is_approved ? 'Previous address' : 'Old address',
                value: isEdit?.restaurant?.address,
              }}
              next={{
                label: isEdit?.is_approved ? 'Updated address' : 'New address',
                value: isEdit?.address,
              }}
              title="Business address"
            />
          )}
          {isEdit?.city && (
            <BusinessRequestItem
              prev={{
                label: isEdit?.is_approved ? 'Previous city' : 'Old city',
                value: isEdit?.restaurant?.city
                  ? getTranslatedData(currentLang, isEdit?.restaurant?.city, 'city')
                  : '-',
              }}
              next={{
                label: isEdit?.is_approved ? 'Updated city' : 'New city',
                value: isEdit?.city ? getTranslatedData(currentLang, isEdit?.city, 'city') : '',
              }}
              title="Business city"
            />
          )}
          {isEdit?.state && (
            <BusinessRequestItem
              prev={{
                label: isEdit?.is_approved ? 'Previous state' : 'Old state',
                value: isEdit?.restaurant?.state
                  ? getTranslatedData(currentLang, isEdit?.restaurant?.state, 'state')
                  : '-',
              }}
              next={{
                label: isEdit?.is_approved ? 'Updated state' : 'New state',
                value: isEdit?.state ? getTranslatedData(currentLang, isEdit?.state, 'state') : '-',
              }}
              title="Business state"
            />
          )}
          {isEdit?.zipcode && (
            <BusinessRequestItem
              prev={{
                label: isEdit?.is_approved ? 'Previous zip code' : 'Old zip code',
                value: isEdit?.restaurant?.zipcode,
              }}
              next={{
                label: isEdit?.is_approved ? 'Updated zip code' : 'New zip code',
                value: isEdit?.zipcode,
              }}
              title="Business zip code"
            />
          )}
          {isEdit?.country && (
            <BusinessRequestItem
              prev={{
                label: isEdit?.is_approved ? 'Previous country' : 'Old country',
                value: isEdit?.restaurant?.country,
              }}
              next={{
                label: isEdit?.is_approved ? 'Updated country' : 'New country',
                value: isEdit?.country,
              }}
              title="Business country"
            />
          )}
          {isEdit?.latitude && isEdit?.longitude && (
            <BusinessRequestItem
              prev={{
                label: isEdit?.is_approved ? 'Previous pin point' : 'Old pin point',
                value: isEdit?.restaurant,
              }}
              next={{
                label: isEdit?.is_approved ? 'Updated pin point' : 'New pin point',
                value: isEdit,
              }}
              title="Business pin point"
              type="map"
            />
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" justifyContent="flex-end" flexGrow={1} gap={2}>
          {isEdit?.is_approved === false ? (
            <>
              <LoadingButton
                variant="contained"
                onClick={() => onSubmit()}
                loading={isLoading}
                color="success"
              >
                Approve
              </LoadingButton>
              <LoadingButton
                variant="outlined"
                onClick={() => onDelete()}
                disabled={isDeleting}
                color="error"
              >
                Delete
              </LoadingButton>
            </>
          ) : (
            <Button variant="contained" onClick={onCloseDialog}>
              Close
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

BusinessRequestDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool,
  fetchData: PropTypes.func.isRequired,
};

const BusinessRequestItem = ({ prev, next, title, type = 'text' }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_KEY,
    libraries: ['places'],
  });
  const mdDown = useResponsive('down', 'md');

  if (!isLoaded) return <LoadingScreen />;

  return (
    <>
      <Grid item xs={12}>
        <Typography textAlign="center" variant="subtitle1">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={5} container justifyContent="center">
        <Card sx={{ p: 2 }}>
          {type === 'map' ? (
            <GoogleMap
              zoom={16}
              center={{
                lat: prev.value.latitude,
                lng: prev.value.longitude,
              }}
              mapContainerStyle={{
                width: mdDown ? '100px' : '300px',
                height: '200px',
                borderRadius: '18px',
              }}
            >
              <Marker
                position={{
                  lat: prev.value.latitude,
                  lng: prev.value.longitude,
                }}
                draggable={false}
              />
            </GoogleMap>
          ) : (
            <ListItemText
              primary={prev.label}
              secondary={prev?.value}
              primaryTypographyProps={{
                noWrap: true,
                typography: 'subtitle2',
                mb: 0.5,
                textAlign: 'center',
              }}
              secondaryTypographyProps={{
                noWrap: true,
                typography: 'caption',
                component: 'span',
                textAlign: 'center',
                sx: {
                  textDecoration: 'line-through',
                },
              }}
            />
          )}
        </Card>
      </Grid>
      <Grid item xs={2} container justifyContent="center" alignItems="center">
        <Iconify icon="bi:arrow-right" width={36} />
      </Grid>
      <Grid item xs={5} container justifyContent="center">
        <Card sx={{ p: 2 }}>
          {type === 'map' ? (
            <GoogleMap
              zoom={16}
              center={{
                lat: next.value.latitude,
                lng: next.value.longitude,
              }}
              mapContainerStyle={{
                width: mdDown ? '100px' : '300px',
                height: '200px',
                borderRadius: '18px',
              }}
            >
              <Marker
                position={{
                  lat: next.value.latitude,
                  lng: next.value.longitude,
                }}
                draggable={false}
              />
            </GoogleMap>
          ) : (
            <ListItemText
              primary={next.label}
              secondary={next?.value}
              primaryTypographyProps={{
                noWrap: true,
                typography: 'subtitle2',
                mb: 0.5,
                textAlign: 'center',
              }}
              secondaryTypographyProps={{
                noWrap: true,
                typography: 'caption',
                component: 'span',
                textAlign: 'center',
              }}
            />
          )}
        </Card>
      </Grid>
    </>
  );
};

BusinessRequestItem.propTypes = {
  prev: PropTypes.object,
  next: PropTypes.object,
  title: PropTypes.string,
  type: PropTypes.string,
};
