import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function SearchNotFound({ query, sx, ...other }) {
  const { t } = useTranslate();

  return query ? (
    <Paper
      sx={{
        bgcolor: 'unset',
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        {t('dashboard.layout.header.search.notFound')}
      </Typography>

      <Typography variant="body2">
        {t('dashboard.layout.header.search.noResults')} &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> {t('dashboard.layout.header.search.typo')}
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      {t('dashboard.layout.header.search.empty')}
    </Typography>
  );
}

SearchNotFound.propTypes = {
  query: PropTypes.string,
  sx: PropTypes.object,
};
