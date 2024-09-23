import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { getFullAddress } from 'src/utils/misc';

import { BUSINESS_TYPES_MAPPER } from 'src/constants';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

export default function ProfileBusinessItem({ business, onView }) {
  const {
    id,
    name,
    phone_number,
    profile_image,
    business_description,
    cuisines,
    type,
    average_rating,
  } = business;

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        zIndex: 9,
        borderRadius: 1,
        position: 'absolute',
        p: '2px 6px 2px 4px',
        typography: 'subtitle2',
        bgcolor: 'warning.lighter',
      }}
    >
      <Iconify icon="eva:star-fill" sx={{ color: 'warning.main', mr: 0.25 }} /> {average_rating}
    </Stack>
  );

  const renderType = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        left: 8,
        zIndex: 9,
        borderRadius: 1,
        bgcolor: 'grey.800',
        position: 'absolute',
        p: '2px 6px 2px 4px',
        color: 'common.white',
        typography: 'subtitle2',
      }}
    >
      {BUSINESS_TYPES_MAPPER[type]}
    </Stack>
  );

  const renderImages = (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 1),
      }}
    >
      <Stack flexGrow={1} sx={{ position: 'relative' }}>
        {renderType}
        {renderRating}
        <Image
          alt={profile_image}
          src={profile_image || `https://eu.ui-avatars.com/api/?name=${name}&size=164`}
          sx={{ borderRadius: 1, height: 164, width: 1 }}
        />
      </Stack>
    </Stack>
  );

  const renderTexts = (
    <ListItemText
      sx={{
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary={
        <Link component={RouterLink} href={paths.dashboard.business.view(id)} color="inherit">
          {name}
        </Link>
      }
      secondary={business_description}
      primaryTypographyProps={{
        color: 'text.primary',
        typography: 'subtitle1',
        noWrap: true,
      }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
        color: 'text.disabled',
      }}
    />
  );

  const renderInfo = (
    <Stack
      spacing={1.5}
      sx={{
        position: 'relative',
        p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5),
      }}
    >
      {[
        {
          label: getFullAddress(business),
          icon: <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />,
        },
        {
          label: phone_number ? `+${phone_number}` : '-',
          icon: <Iconify icon="ion:call" sx={{ color: 'info.main' }} />,
        },
        {
          label: cuisines?.cuisines || '-',
          icon: <Iconify icon="zondicons:location-food" sx={{ color: 'primary.main' }} />,
        },
      ].map((item) => (
        <Stack
          key={item.label}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ typography: 'body2' }}
        >
          {item.icon}
          {item.label}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Card>
      {renderImages}

      {renderTexts}

      {renderInfo}
    </Card>
  );
}

ProfileBusinessItem.propTypes = {
  onView: PropTypes.func,
  business: PropTypes.object,
};
