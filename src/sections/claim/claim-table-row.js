import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, Stack, alpha, ListItemText } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useLightBox } from 'src/components/lightbox';
import Lightbox from 'src/components/lightbox/lightbox';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function ClaimTableRow({ row, selected, onViewRow, onDeleteRow }) {
  const { created_at, modified_at, request_for, request_by, is_approved, id } = row;
  const { t } = useTranslate();

  const confirm = useBoolean();

  const BUSINESS_SLIDES = useMemo(
    () => [
      {
        id: row.id,
        postedAt: '',
        title: request_for?.name,
        src: request_for?.profile_image,
      },
    ],
    [row, request_for]
  );

  const USER_SLIDES = useMemo(
    () => [
      {
        id: row.id,
        postedAt: '',
        title: request_by?.username,
        src: request_by?.profile_image,
      },
    ],
    [row, request_by]
  );

  const lightbox = useLightBox(BUSINESS_SLIDES);

  const userLightbox = useLightBox(USER_SLIDES);

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Box sx={{ position: 'relative', overflow: 'hidden', display: 'flex' }}>
            <Avatar
              alt={request_for?.username}
              src={request_for?.profile_image}
              sx={{ mr: 2, cursor: 'pointer', width: 32, height: 32 }}
              children={request_for?.username}
            />
            {request_for?.profile_image ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={1}
                className="upload-placeholder"
                onClick={() => lightbox.onOpen(request_for?.profile_image)}
                sx={{
                  top: 0,
                  left: 0,
                  width: 32,
                  height: 32,
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
            <ListItemText
              primary={request_for?.name}
              secondary={request_for?.address}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            />
          </Box>
        </TableCell>

        <TableCell>
          <Box sx={{ position: 'relative', overflow: 'hidden', display: 'flex' }}>
            <Avatar
              alt={request_by?.username}
              src={request_by?.profile_image}
              sx={{ mr: 2, cursor: 'pointer', width: 32, height: 32 }}
              children={request_by?.username}
            />
            {request_by?.profile_image ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={1}
                className="upload-placeholder"
                onClick={() => userLightbox.onOpen(request_by?.profile_image)}
                sx={{
                  top: 0,
                  left: 0,
                  width: 32,
                  height: 32,
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
            <ListItemText
              primary={request_by?.username}
              secondary={request_by?.email}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            />
          </Box>
        </TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={(is_approved && 'success') || (!is_approved && 'warning') || 'default'}
          >
            {is_approved ? 'Yes' : 'No'}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(created_at)}
            secondary={fTime(created_at)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(modified_at)}
            secondary={fTime(modified_at)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
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
          href={paths.dashboard.claim.edit(id)}
          sx={{ color: 'default' }}
        >
          <Iconify icon="carbon:view-filled" />
          {t('claim.table_row.button.view')}
        </MenuItem>
        {!is_approved ? (
          <>
            <MenuItem
              sx={{ color: 'success.main' }}
              component={RouterLink}
              href={paths.dashboard.claim.edit(id)}
            >
              <Iconify icon="lets-icons:done-all-round" />
              {t('claim.table_row.button.approve')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              {t('claim.table_row.button.delete')}
            </MenuItem>
          </>
        ) : null}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('claim.table_row.confirmation.title')}
        content={t('claim.table_row.confirmation.description')}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('claim.table_row.button.delete')}
          </Button>
        }
      />

      <Lightbox
        index={lightbox.selected}
        slides={BUSINESS_SLIDES}
        open={lightbox.open}
        close={lightbox.onClose}
      />
      <Lightbox
        index={userLightbox.selected}
        slides={USER_SLIDES}
        open={userLightbox.open}
        close={userLightbox.onClose}
      />
    </>
  );
}

ClaimTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
