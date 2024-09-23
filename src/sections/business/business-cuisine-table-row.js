import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import { getTranslatedData } from 'src/utils/misc';

import { useLocales } from 'src/locales';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function BusinessCuisineTableRow({ row, selected, onEditRow, onDeleteRow }) {
  const { cuisine, created_at, modified_at } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const { currentLang } = useLocales();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{getTranslatedData(currentLang, cuisine, 'cuisines')}</TableCell>

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
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${getTranslatedData(
          currentLang,
          cuisine,
          'cuisines'
        )} cuisine?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

BusinessCuisineTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
