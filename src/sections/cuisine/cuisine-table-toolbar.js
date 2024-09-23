import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Tooltip, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

export default function CuisineTableToolbar({ filters, onFilters, onSearch = () => {} }) {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const handleFilterName = useCallback(() => {
    onFilters('cuisines', searchQuery);
    setIsSearched(true);
  }, [onFilters, searchQuery]);

  const { t } = useTranslate();

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
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={({ target: { value } }) => setSearchQuery(value)}
          placeholder={t('cuisine.toolbar.search')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        {searchQuery && (
          <Tooltip title="Search Cuisine">
            <IconButton onClick={handleFilterName} color="primary">
              <Iconify icon="eva:search-fill" />
            </IconButton>
          </Tooltip>
        )}
        {isSearched && !searchQuery && (
          <Tooltip title="Reset Search">
            <IconButton onClick={handleFilterName} color="primary">
              <Iconify icon="bx:reset" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
}

CuisineTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onSearch: PropTypes.func,
};
