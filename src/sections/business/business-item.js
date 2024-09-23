import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Button, Tooltip, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { getTranslatedData } from 'src/utils/misc';

import { useLocales } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function BusinessItem({ business, onView, onEdit, onDelete, onApprove }) {
  const popover = usePopover();
  const confirm = useBoolean();
  const approveConfirm = useBoolean();

  const { currentLang } = useLocales();

  const {
    name,
    profile_image,
    phone_number,
    id,
    year_of_established,
    is_approved,
    city,
    average_rating,
    type,
  } = business;

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        zIndex: 9,
        borderRadius: 1,
        position: 'absolute',
        p: '2px 6px 2px 4px',
        typography: 'subtitle2',
        bgcolor: 'warning.lighter',
      }}
    >
      <Iconify icon="eva:star-fill" sx={{ color: 'warning.main', mr: 0.25 }} />{' '}
      <Typography variant="subtitle1">{average_rating}</Typography>
    </Stack>
  );

  const renderPrice = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        left: 8,
        zIndex: 9,
        borderRadius: 1,
        bgcolor: 'grey.800',
        position: 'absolute',
        p: '2px 6px 2px 4px',
        color: 'common.white',
        typography: 'subtitle2',
      }}
    >
      {type ? getTranslatedData(currentLang, type, 'type') : '-'}
    </Stack>
  );

  const renderImages = (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 1),
      }}
    >
      <Stack flexGrow={1} sx={{ position: 'relative' }}>
        {renderPrice}
        {renderRating}
        <Image
          alt={profile_image}
          src={profile_image || `https://eu.ui-avatars.com/api/?name=${name}&size=164`}
          sx={{ borderRadius: 1, height: 164, width: 1 }}
        />
      </Stack>
    </Stack>
  );

  const renderTexts = (
    <ListItemText
      sx={{
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link component={RouterLink} href={paths.dashboard.business.view(id)} color="inherit">
            {name}
          </Link>
          <Tooltip title={is_approved ? 'Approved' : 'Pending'}>
            <Iconify
              icon={is_approved ? 'pajamas:partner-verified' : 'bi:clock-fill'}
              sx={{ color: is_approved ? 'success.main' : 'warning.main' }}
            />
          </Tooltip>
        </Stack>
      }
      secondary=""
      primaryTypographyProps={{
        color: 'text.primary',
        typography: 'subtitle1',
        noWrap: true,
      }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
        color: 'text.disabled',
      }}
    />
  );

  const renderInfo = (
    <Stack
      spacing={1.5}
      sx={{
        position: 'relative',
        p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5),
      }}
    >
      <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', bottom: 20, right: 8 }}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      {[
        {
          label: city ? getTranslatedData(currentLang, city, 'city') : '-',
          icon: <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />,
        },
        {
          label: phone_number ? `+${phone_number}` : '-',
          icon: <Iconify icon="ion:call" sx={{ color: 'info.main' }} />,
        },
        {
          label: year_of_established || '-',
          icon: <Iconify icon="solar:calendar-bold-duotone" sx={{ color: 'primary.main' }} />,
        },
      ].map((item) => (
        <Stack
          key={item.label}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ typography: 'body2' }}
        >
          {item.icon}
          {item.label}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Card>
        {renderImages}

        {renderTexts}

        {renderInfo}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {'is_approved' in business && !business.is_approved && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              approveConfirm.onTrue();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="ph:seal-check-fill" />
            Approve
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${name} business?`}
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />

      <ConfirmDialog
        open={approveConfirm.value}
        onClose={approveConfirm.onFalse}
        title="Approve"
        content={
          <>
            Are you sure want to approve <b>{name}</b> business?
          </>
        }
        action={
          <Button variant="contained" color="success" onClick={onApprove}>
            Approve
          </Button>
        }
      />
    </>
  );
}

BusinessItem.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  business: PropTypes.array,
  onApprove: PropTypes.func,
};
