/* eslint-disable no-nested-ternary */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

export default function ProfileHome({ info }) {
  const renderAbout = (
    <Card>
      <CardHeader title="Details" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {info?.date_of_birth ? (
          <Stack direction="row" spacing={2}>
            <Iconify icon="icon-park-solid:birthday-cake" width={24} />
            <Box sx={{ typography: 'body2' }}>
              <Link variant="subtitle2" color="inherit">
                {info?.date_of_birth ? fDate(new Date(info?.date_of_birth)) : '-'}
              </Link>
            </Box>
          </Stack>
        ) : null}

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          <Link variant="subtitle2" color="inherit" href={`mailto:${info?.email}`}>
            {info?.email}
          </Link>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="ion:call" width={24} />
          <Box sx={{ typography: 'body2' }}>
            <Link
              variant="subtitle2"
              color="inherit"
              href={info?.mobile_number ? `tel:+${info?.mobile_number}` : '#'}
            >
              {info?.mobile_number
                ? info?.mobile_number.includes('+')
                  ? info?.mobile_number
                  : `+${info?.mobile_number}`
                : '-'}
            </Link>
          </Box>
        </Stack>
        {info?.restaurants?.length > 0 ? (
          <Stack direction="row" spacing={2}>
            <Iconify icon="ic:round-business-center" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {`Owned `}
              <Link variant="subtitle2" color="inherit">
                {info?.restaurants?.length} Businesses
              </Link>
            </Box>
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>{renderAbout}</Grid>
    </Grid>
  );
}

ProfileHome.propTypes = {
  info: PropTypes.object,
};
