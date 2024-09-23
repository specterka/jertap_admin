import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import { Box, Stack, alpha } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useLightBox } from 'src/components/lightbox';
import Lightbox from 'src/components/lightbox/lightbox';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function CollaboratorTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { full_name, profile_pic, created_at, modified_at, is_active, email, whatsapp } = row;
  const { t } = useTranslate();

  const confirm = useBoolean();

  const popover = usePopover();

  const SLIDES = useMemo(
    () => [
      {
        id: row.id,
        postedAt: '',
        title: full_name,
        src: profile_pic,
      },
    ],
    [row, full_name, profile_pic]
  );

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
              alt={full_name}
              src={profile_pic}
              sx={{ mr: 2, cursor: 'pointer', width: 52, height: 52 }}
            />
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              className="upload-placeholder"
              onClick={() => lightbox.onOpen(profile_pic)}
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

          <ListItemText
            primary={full_name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{whatsapp}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(is_active && 'success') || (!is_active === 'pending' && 'error') || 'default'}
          >
            {is_active ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {created_at ? fDateTime(created_at) : '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {modified_at ? fDateTime(modified_at) : '-'}
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
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('collaborator.table_row.button.delete')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('collaborator.table_row.button.edit')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('collaborator.table_row.confirmation.title')}
        content={`Are you sure want to delete ${full_name} collaborator?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('collaborator.table_row.confirmation.delete_button')}
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

CollaboratorTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
