import { useState } from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Stack, Tooltip, IconButton } from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

export default function BusinessSearch({ query, results, onSearch, hrefItem }) {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const { t } = useTranslate();

  const handleSearch = () => {
    onSearch(searchQuery);
    setIsSearched(true);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ width: { xs: 1, sm: 320 } }}>
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
        <Tooltip title="Search Business">
          <IconButton onClick={handleSearch} color="primary">
            <Iconify icon="eva:search-fill" />
          </IconButton>
        </Tooltip>
      )}
      {isSearched && !searchQuery && (
        <Tooltip title="Reset Search">
          <IconButton onClick={handleSearch} color="primary">
            <Iconify icon="bx:reset" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}

BusinessSearch.propTypes = {
  hrefItem: PropTypes.func,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array,
};
