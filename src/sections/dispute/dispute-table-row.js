import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Stack, alpha } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { getUserName } from 'src/utils/misc';
import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function DisputeTableRow({ row, selected, onViewRow, onDeleteRow }) {
  const { query_by, created_at, modified_at, is_resolved } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const SLIDES = useMemo(
    () => [
      {
        id: query_by.id,
        postedAt: '',
        title: getUserName(query_by),
        src: query_by?.profile_image,
      },
    ],
    [query_by]
  );

  const lightbox = useLightBox(SLIDES);

  const { t } = useTranslate();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Avatar
              alt={getUserName(query_by)}
              src={query_by?.profile_image}
              sx={{ mr: 2, cursor: 'pointer', width: 52, height: 52 }}
            />
            {query_by?.profile_image && (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={1}
                className="upload-placeholder"
                onClick={() => lightbox.onOpen(query_by?.profile_image)}
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
            )}
          </Box>

          <ListItemText
            primary={getUserName(query_by)}
            secondary={query_by?.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(is_resolved && 'success') || (!is_resolved && 'warning') || 'default'}
          >
            {is_resolved
              ? t('keywords.disputeStatus.resolved')
              : t('keywords.disputeStatus.pending')}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {created_at ? fDateTime(created_at) : '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {modified_at ? fDateTime(modified_at) : '-'}
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title={t('dispute.tooltips.view')} placement="top" arrow>
            <IconButton color="inherit" onClick={onViewRow}>
              <Iconify icon="solar:eye-bold" />
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
          {t('dispute.button.delete')}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('dispute.button.delete')}
        content={t('dispute.confirmation.disputeDeleteText')}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t('dispute.button.delete')}
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

DisputeTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
