import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Tooltip, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

export default function CategoryTableToolbar({
  filters,
  onFilters,
  roleOptions,
  search = '',
  onSearch = () => {},
}) {
  const { t } = useTranslate();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={search}
          onChange={handleFilterName}
          placeholder={t('category.list.toolbar.search')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title={t('category.list.toolbar.searchCategory')}>
          <IconButton onClick={onSearch} color="primary">
            <Iconify icon="eva:search-fill" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

CategoryTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  roleOptions: PropTypes.array,
  search: PropTypes.string,
  onSearch: PropTypes.func,
};
