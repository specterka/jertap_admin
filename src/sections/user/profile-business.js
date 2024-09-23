import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import SearchNotFound from 'src/components/search-not-found';

import ProfileBusinessItem from './profile-business-item';

// ----------------------------------------------------------------------

export default function ProfileBusiness({ friends, searchFriends, onSearchFriends, businesses }) {
  const dataFiltered = applyFilter({
    inputData: businesses,
    query: searchFriends,
  });

  const notFound = !dataFiltered.length && !!searchFriends;

  const onBusiness = () => {};

  return (
    <>
      <Stack
        spacing={2}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ my: 5 }}
      >
        <Typography variant="h4">Businesses</Typography>

        <TextField
          value={searchFriends}
          onChange={onSearchFriends}
          placeholder="Search business..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: 1, sm: 260 } }}
        />
      </Stack>

      {notFound ? (
        <SearchNotFound query={searchFriends} sx={{ mt: 10 }} />
      ) : (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {dataFiltered?.length > 0 ? (
            dataFiltered.map((business) => (
              <ProfileBusinessItem key={business.id} business={business} onView={onBusiness} />
            ))
          ) : (
            <EmptyContent filled title="No Business Found" />
          )}
        </Box>
      )}
    </>
  );
}

ProfileBusiness.propTypes = {
  friends: PropTypes.array,
  businesses: PropTypes.array,
  onSearchFriends: PropTypes.func,
  searchFriends: PropTypes.string,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, query }) {
  if (query) {
    return inputData.filter(
      (business) => business.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
