import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import BusinessItem from './business-item';

export default function BusinessList({
  businesses,
  handleDeleteRow,
  businessResponse,
  page,
  onChangePage,
  handleApproveRow,
}) {
  const router = useRouter();

  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.business.view(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.dashboard.business.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback(
    (id) => {
      handleDeleteRow(id);
    },
    [handleDeleteRow]
  );

  const handleApprove = useCallback(
    (id) => {
      handleApproveRow(id);
    },
    [handleApproveRow]
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {businesses?.map((business) => (
          <BusinessItem
            key={business.id}
            business={business}
            onView={() => handleView(business.id)}
            onEdit={() => handleEdit(business.id)}
            onDelete={() => handleDelete(business.id)}
            onApprove={() => handleApprove(business.id)}
          />
        ))}
      </Box>

      {businessResponse?.count > 15 && (
        <Pagination
          count={Math.ceil(businessResponse.count / 15)}
          page={page}
          onChange={onChangePage}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

BusinessList.propTypes = {
  businesses: PropTypes.array,
  handleDeleteRow: PropTypes.func,
  businessResponse: PropTypes.func,
  page: PropTypes.number,
  onChangePage: PropTypes.func,
  handleApproveRow: PropTypes.func,
};
