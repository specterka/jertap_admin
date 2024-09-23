import PropTypes from 'prop-types';

import { LoadingButton } from '@mui/lab';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { MobileTimePicker } from '@mui/x-date-pickers';

import { getDateFromTimeString } from 'src/utils/misc';

export default function TimingTableRow({ row, onEditRow, isUpdating, rowIndex, onChangeTimings }) {
  const { weekday, from_hour, to_hour, id } = row;

  return (
    <TableRow hover>
      <TableCell>{weekday}</TableCell>

      <TableCell>
        <MobileTimePicker
          value={typeof from_hour === 'string' ? getDateFromTimeString(from_hour) : from_hour}
          onChange={(date) => onChangeTimings(rowIndex, 'from_hour', date)}
          maxTime={
            // eslint-disable-next-line no-nested-ternary
            to_hour
              ? typeof to_hour === 'string'
                ? getDateFromTimeString(to_hour)
                : to_hour
              : null
          }
          ampm={false}
          format="HH:mm:ss"
          disabled={isUpdating && isUpdating === id}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      </TableCell>

      <TableCell>
        <MobileTimePicker
          value={typeof to_hour === 'string' ? getDateFromTimeString(to_hour) : to_hour}
          onChange={(date) => onChangeTimings(rowIndex, 'to_hour', date)}
          minTime={
            // eslint-disable-next-line no-nested-ternary
            from_hour
              ? typeof from_hour === 'string'
                ? getDateFromTimeString(from_hour)
                : from_hour
              : null
          }
          ampm={false}
          format="HH:mm:ss"
          disabled={isUpdating && isUpdating === id}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      </TableCell>

      <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {to_hour && from_hour ? (
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={() => onEditRow(id)}
            loading={isUpdating && isUpdating === id}
            disabled={!to_hour || !from_hour}
          >
            Update
          </LoadingButton>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

TimingTableRow.propTypes = {
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  isUpdating: PropTypes.number,
  rowIndex: PropTypes.number,
  onChangeTimings: PropTypes.func,
};
