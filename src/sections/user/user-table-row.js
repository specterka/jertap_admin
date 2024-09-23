import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Box, Chip, Stack, alpha, Checkbox } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import { getFullName, getUserRole } from 'src/utils/misc';

import { useTranslate } from 'src/locales';
import { USER_TYPES_MAPPER } from 'src/constants';

import Iconify from 'src/components/iconify';
import { useLightBox } from 'src/components/lightbox';
import Lightbox from 'src/components/lightbox/lightbox';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { username, profile_image, email, mobile_number, created_at, ...rest } = row;
  const { t } = useTranslate();

  const confirm = useBoolean();

  const SLIDES = useMemo(
    () => [
      {
        id: row.id,
        postedAt: '',
        title: username,
        src: profile_image,
      },
    ],
    [row, username, profile_image]
  );

  const popover = usePopover();
  const lightbox = useLightBox(SLIDES);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Avatar
              alt={username}
              src={profile_image}
              sx={{ mr: 2, cursor: 'pointer', width: 42, height: 42 }}
            />
            {profile_image ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={1}
                className="upload-placeholder"
                onClick={() => lightbox.onOpen(profile_image)}
                sx={{
                  top: 0,
                  left: 0,
                  width: 42,
                  height: 42,
                  zIndex: 9,
                  borderRadius: '50%',
                  position: 'absolute',
                  color: 'text.disabled',
                  cursor: 'pointer',
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                  transition: (theme) =>
                    theme.transitions.create(['opacity'], {
                      duration: theme.transitions.duration.shorter,
                    }),
                  '&:hover': {
                    opacity: 0.72,
                  },
                  ...(true && {
                    zIndex: 9,
                    opacity: 0,
                    color: 'common.white',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
                  }),
                }}
              >
                <Iconify icon="material-symbols:pan-zoom-rounded" width={32} />
              </Stack>
            ) : null}
          </Box>

          <ListItemText
            primary={username}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{getFullName(row)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{mobile_number}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip variant="outlined" label={USER_TYPES_MAPPER[getUserRole(rest)]} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {created_at ? fDateTime(created_at) : '-'}
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          component={RouterLink}
          href={paths.dashboard.user.view(rest.id)}
          sx={{ color: 'default' }}
        >
          <Iconify icon="carbon:view-filled" />
          {t('user.table_row.button.view')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('user.table_row.button.delete')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('user.table_row.button.edit')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('user.table_row.confirmation.title')}
        content={`Are you sure want to delete ${username} user?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('user.table_row.confirmation.delete_button')}
          </Button>
        }
      />

      <Lightbox
        index={lightbox.selected}
        slides={SLIDES}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
