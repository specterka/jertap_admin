import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import { ListItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { getUserName } from 'src/utils/misc';
import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

export default function DisputeItem({ review }) {
  const { query, query_by, is_resolved, created_at } = review;

  return (
    <ListItem
      sx={{
        p: 0,
        pt: 3,
        alignItems: 'flex-start',
      }}
    >
      <Avatar
        src={query_by?.profile_image}
        alt={getUserName(query_by)}
        sx={{ mr: 2, width: 48, height: 48 }}
      />

      <Stack
        flexGrow={1}
        sx={{
          pb: 3,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {getUserName(query_by)}
        </Typography>
        {is_resolved && (
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              color: 'success.main',
              typography: 'caption',
              mb: 0.5,
            }}
          >
            <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
            Resolved
          </Stack>
        )}
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {created_at ? fDateTime(created_at) : '-'}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {query}
        </Typography>
      </Stack>
    </ListItem>
  );
}

DisputeItem.propTypes = {
  review: PropTypes.object,
};
