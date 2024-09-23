import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Box, Stack, alpha } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import { getTranslatedData } from 'src/utils/misc';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useLightBox } from 'src/components/lightbox';
import Lightbox from 'src/components/lightbox/lightbox';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function BusinessMenuTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { Item_name, cover_image, created_at, modified_at, price, menu_type, description, is_veg } =
    row;
  const { t } = useTranslate();
  const { currentLang } = useLocales();

  const confirm = useBoolean();

  const SLIDES = useMemo(
    () => [
      {
        id: row.id,
        postedAt: '',
        title: Item_name,
        src: cover_image,
      },
    ],
    [row, Item_name, cover_image]
  );

  const lightbox = useLightBox(SLIDES);

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Avatar
              alt={Item_name}
              src={cover_image}
              sx={{ mr: 2, cursor: 'pointer', width: 52, height: 52 }}
            />
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              className="upload-placeholder"
              onClick={() => lightbox.onOpen(cover_image)}
              sx={{
                top: 0,
                left: 0,
                width: 52,
                height: 52,
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
          </Box>
        </TableCell>
        <TableCell>{Item_name}</TableCell>
        <TableCell>{price}</TableCell>
        <TableCell>
          {menu_type?.type ? getTranslatedData(currentLang, menu_type, 'type') : '-'}
        </TableCell>

        <TableCell>{description || '-'}</TableCell>

        <TableCell>{is_veg ? 'Yes' : 'No'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {created_at ? fDateTime(created_at) : '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {modified_at ? fDateTime(modified_at) : '-'}
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title={t('category.table_row.edit')} placement="top" arrow>
            <IconButton color="inherit" onClick={onEditRow}>
              <Iconify icon="solar:pen-bold" />
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
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('business.tabs.menus.list.table_row.button.delete')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('business.tabs.menus.list.table_row.button.delete')}
        content={`${t(
          'business.tabs.menus.list.table_row.confirmation.description'
        )} ${Item_name} ${t('business.tabs.menus.list.table_row.confirmation.menu')}`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('business.tabs.menus.list.table_row.button.delete')}
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

BusinessMenuTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
