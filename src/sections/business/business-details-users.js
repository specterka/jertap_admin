import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { getUserName, getUserRole, getPhoneNumber } from 'src/utils/misc';

import { USER_TYPES_MAPPER } from 'src/constants';

export default function BusinessDetailsUsers({ business }) {
  // Hooks
  const USERS = useMemo(
    () => [
      ...(business?.owner ? [business?.owner] : []),
      ...(business?.manager ? [business.manager] : []),
    ],
    [business]
  );

  return (
    <>
      <Stack
        spacing={2}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ my: 5 }}
      >
        <Typography variant="h4">Users</Typography>
      </Stack>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {USERS?.length
          ? USERS.map((user) => <BusinessUser key={user.id} user={user} />)
          : 'No Users Available'}
      </Box>
    </>
  );
}

BusinessDetailsUsers.propTypes = {
  business: PropTypes.object,
};

function BusinessUser({ user }) {
  return (
    <Card
      sx={{
        py: 5,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Avatar
        alt={getUserName(user)}
        src={user?.profile_image}
        sx={{ width: 64, height: 64, mb: 3 }}
      />

      <Link variant="subtitle1" color="text.primary">
        {getUserName(user)}
      </Link>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, mt: 0.5 }}>
        {USER_TYPES_MAPPER[getUserRole(user)]}
      </Typography>

      {user?.email ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          {user?.email || '-'}
        </Typography>
      ) : null}

      {user?.mobile_number ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          {getPhoneNumber(user?.mobile_number) || '-'}
        </Typography>
      ) : null}
    </Card>
  );
}

BusinessUser.propTypes = {
  user: PropTypes.object,
};
