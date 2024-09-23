import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, Stack, alpha, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';
import { getUserName, getRequestType, getTranslatedData } from 'src/utils/misc';

import { useLocales } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useLightBox } from 'src/components/lightbox';
import Lightbox from 'src/components/lightbox/lightbox';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function BusinessRequestTableRow({ row, selected, onViewRow, onDeleteRow }) {
  const { created_at, modified_at, restaurant, request_by, is_approved } = row;

  const confirm = useBoolean();

  const BUSINESS_SLIDES = useMemo(
    () => [
      {
        id: restaurant.id,
        postedAt: '',
        title: restaurant?.name,
        src: restaurant?.profile_image,
      },
    ],
    [restaurant]
  );

  const USER_SLIDES = useMemo(
    () => [
      {
        id: request_by.id,
        postedAt: '',
        title: request_by?.username,
        src: request_by?.profile_image,
      },
    ],
    [request_by]
  );

  const lightbox = useLightBox(BUSINESS_SLIDES);

  const userLightbox = useLightBox(USER_SLIDES);

  const popover = usePopover();

  const currentLang = useLocales();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Box sx={{ position: 'relative', overflow: 'hidden', display: 'flex' }}>
            <Avatar
              alt={restaurant?.name}
              src={restaurant?.profile_image}
              sx={{ mr: 2, cursor: 'pointer', width: 32, height: 32 }}
              children={restaurant?.name}
            />
            {restaurant?.profile_image ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={1}
                className="upload-placeholder"
                onClick={() => lightbox.onOpen(restaurant?.profile_image)}
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
              primary={restaurant?.name}
              secondary={
                restaurant?.city ? getTranslatedData(currentLang, restaurant?.city, 'city') : '-'
              }
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
              primary={getUserName(request_by)}
              secondary={request_by?.email}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            />
          </Box>
        </TableCell>
        <TableCell>{getRequestType(row)}</TableCell>
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
          <Tooltip title="View Request" placement="top" arrow>
            <IconButton color="inherit" onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip>

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
          sx={{ color: 'default' }}
          onClick={() => {
            popover.onClose();
            onViewRow();
          }}
        >
          <Iconify icon="carbon:view-filled" />
          View
        </MenuItem>
        {!is_approved ? (
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
        ) : null}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete this request?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
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

BusinessRequestTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
