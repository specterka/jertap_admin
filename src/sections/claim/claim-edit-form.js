import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, ListItemText } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { API_ROUTER } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';
import { axiosPatch, axiosDelete } from 'src/services/axiosHelper';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ClaimEditForm({ currentClaim }) {
  const router = useRouter();
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    notes: Yup.string(),
    is_approved: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      notes: currentClaim?.notes || '',
      is_approved: currentClaim?.is_approved,
    }),
    [currentClaim]
  );
  const confirm = useBoolean();

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const selectedStatus = watch('is_approved');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...(data?.notes ? {} : {}),
        ...(data?.is_approved
          ? {
              is_approved: data?.is_approved,
            }
          : {}),
      };
      const res = await axiosPatch(API_ROUTER.claim.update(currentClaim.id), payload);
      if (!res?.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.CLAIM_UPDATE_SUCCESS, TOAST_TYPES.ERROR);
        reset();
        router.push(paths.dashboard.claim.list);
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
    return null;
  });

  const onDeleteClaim = async (id) => {
    try {
      const res = await axiosDelete(API_ROUTER.claim.remove(id));
      if (!res.status) {
        return enqueueSnackbar(!res.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.CLAIM_DELETE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        reset();
        router.push(paths.dashboard.claim.list);
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
      });
    }
    return null;
  };

  const renderBusinessOverview = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(1, 1fr)',
      }}
      sx={{
        mb: 3,
      }}
    >
      {[
        {
          label: t('claim.detail.label1'),
          value: currentClaim?.request_for?.name,
          icon: <Iconify icon="ion:business" />,
        },
        {
          label: t('claim.detail.label2'),
          value: `${currentClaim?.request_for?.address}, ${currentClaim?.request_for?.location}, ${currentClaim?.request_for?.city}, ${currentClaim?.request_for?.state}, ${currentClaim?.request_for?.zipcode}`,
          icon: <Iconify icon="mdi:address-marker" />,
        },
        {
          label: t('claim.detail.label3'),
          value: `+${currentClaim?.request_for?.phone_number}`,
          icon: <Iconify icon="ph:phone-fill" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Box>
  );

  const renderClaimantOverview = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
      sx={{
        mb: 3,
      }}
    >
      {[
        {
          label: t('claim.detail.label4'),
          value: currentClaim?.request_by?.username,
          icon: <Iconify icon="solar:user-bold" />,
        },
        {
          label: t('claim.detail.label5'),
          value: `${currentClaim?.request_by?.mobile_number}`,
          icon: <Iconify icon="ph:phone-fill" />,
        },
        {
          label: t('claim.detail.label6'),
          value: `${currentClaim?.request_by?.email}`,
          icon: <Iconify icon="ic:round-email" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={5}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Typography variant="h6" sx={{ position: 'absolute', top: 24, left: 24 }}>
              {t('claim.detail.details_heading')}
            </Typography>
            {currentClaim && (
              <Label
                color={(selectedStatus && 'success') || (!selectedStatus && 'warning') || 'default'}
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {selectedStatus ? 'Approved' : 'Pending'}
              </Label>
            )}

            <Box sx={{ m: 2 }}>
              <Stack justifyContent="center" alignItems="center">
                <Avatar
                  src={currentClaim?.request_for?.profile_image}
                  sx={{ height: 120, width: 120 }}
                />
              </Stack>
            </Box>

            {renderBusinessOverview}

            {!currentClaim?.is_approved && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="is_approved"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {t('claim.detail.status')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t('claim.detail.approve_claim')}
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            {!currentClaim?.is_approved && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error" onClick={() => confirm.onTrue()}>
                  {t('claim.detail.button.delete_Claim')}
                </Button>
                <ConfirmDialog
                  open={confirm.value}
                  onClose={confirm.onFalse}
                  title="Delete"
                  content="Are you sure want to delete this claim?"
                  action={
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onDeleteClaim(currentClaim.id)}
                    >
                      {t('claim.detail.button.delete')}
                    </Button>
                  }
                />
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }} gutterBottom>
              {t('claim.detail.details_heading')}
            </Typography>
            <Box sx={{ m: 4 }}>
              <Stack justifyContent="center" alignItems="center">
                <Avatar
                  src={currentClaim?.request_by?.profile_image}
                  sx={{ height: 120, width: 120 }}
                >
                  {currentClaim?.request_by?.username}
                </Avatar>
              </Stack>
            </Box>
            {renderClaimantOverview}
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField
                name="notes"
                label={t('claim.detail.notes.label')}
                multiline
                rows={6}
                disabled={currentClaim?.is_approved}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              {isDirty && !currentClaim?.is_approved ? (
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {t('claim.detail.notes.button.save')}
                </LoadingButton>
              ) : null}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ClaimEditForm.propTypes = {
  currentClaim: PropTypes.object,
};
