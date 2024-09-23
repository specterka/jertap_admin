import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { Card, Table, TableBody, TableContainer } from '@mui/material';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';
import { fTime } from 'src/utils/format-time';

import { axiosPatch } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { useTable, emptyRows, TableEmptyRows, TableHeadCustom } from 'src/components/table';

import TimingTableRow from './timing-table-row';

const TABLE_HEAD = [
  { id: 'day', label: 'Day', width: 20 },
  { id: 'from_hour', label: 'Open At', width: 140 },
  { id: 'to_hour', label: 'Close At', width: 140 },
  { id: '', width: 40 },
];

const BusinessTiming = ({ currentBusiness }) => {
  // States
  const [timings, setTimings] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Hooks
  const [businessTimings, isFetching, fetchTimings] = useMetaData(
    API_ROUTER.business.timings.list(currentBusiness.id)
  );
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultRowsPerPage: 10 });

  const denseHeight = table.dense ? 56 : 56 + 20;

  // Effects
  useEffect(() => {
    if (businessTimings && businessTimings.length > 0) {
      setTimings(businessTimings);
    } else setTimings([]);
  }, [businessTimings]);

  // Handlers
  const onChangeTimings = (index, key, value) => {
    const clonedTimings = [...timings];
    clonedTimings[index] = { ...clonedTimings[index], [key]: value };
    setTimings(clonedTimings);
  };

  const onUpdate = async (timingId) => {
    try {
      const selected = timings.find((item) => item.id === timingId);
      if (!timingId || !selected)
        return enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, { variant: TOAST_TYPES.ERROR });
      setIsUpdating(timingId);
      const payload = {
        from_hour:
          typeof selected?.from_hour === 'string'
            ? selected?.from_hour
            : fTime(selected?.from_hour, 'HH:mm:ss'),
        to_hour:
          typeof selected?.to_hour === 'string'
            ? selected?.to_hour
            : fTime(selected?.to_hour, 'HH:mm:ss'),
      };
      const res = await axiosPatch(
        API_ROUTER.business.timings.edit(currentBusiness.id, timingId),
        payload
      );
      setIsUpdating(false);

      if (!res.status) {
        return enqueueSnackbar(res?.message || TOAST_ALERTS.GENERAL_ERROR, {
          variant: TOAST_TYPES.ERROR,
        });
      }
      if (res.status) {
        enqueueSnackbar(TOAST_ALERTS.BUSINESS_TIMING_UPDATE_SUCCESS, {
          variant: TOAST_TYPES.SUCCESS,
        });
        fetchTimings();
      }
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, { variant: TOAST_TYPES.ERROR });
    }
    return null;
  };

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  return isFetching ? (
    renderLoading
  ) : (
    <Card>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={7}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {timings?.map((row, index) => (
                <TimingTableRow
                  key={row.id}
                  row={row}
                  onChangeTimings={onChangeTimings}
                  rowIndex={index}
                  onEditRow={onUpdate}
                  isUpdating={isUpdating}
                />
              ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, [].length)}
              />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
};

export default BusinessTiming;

BusinessTiming.propTypes = {
  currentBusiness: PropTypes.object.isRequired,
};
