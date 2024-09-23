import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { Marker, GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Card, Chip, Tooltip } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { getUserName, getPhoneNumber, getFullAddress, getTranslatedData } from 'src/utils/misc';

import { useLocales } from 'src/locales';
import { GOOGLE_MAP_KEY } from 'src/config-global';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { varFade, MotionContainer } from 'src/components/animate';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';

export default function BusinessDetailsContent({ business }) {
  const {
    owner,
    manager,
    name,
    phone_number,
    business_whatsapp,
    city,
    is_approved,
    is_disabled,
    profile_image,
    business_description,
    cuisines,
    type,
    known_for,
    must_order,
    year_of_established,
    rating_count,
    restaurant_images,
    average_rating,
    restaurant_services,
    restaurants_timings,
    latitude,
    longitude,
  } = business;

  const slides = [
    profile_image,
    ...(restaurant_images?.length > 0 ? restaurant_images.map(({ image }) => image) : []),
  ].map((slide, index) => ({
    id: index,
    title: '',
    description: '',
    coverUrl: slide,
  }));

  const carousel = useCarousel({
    speed: 800,
    autoplay: true,
    ...CarouselDots({
      sx: {
        top: 16,
        left: 16,
        position: 'absolute',
        color: 'primary.light',
      },
    }),
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_KEY,
    libraries: ['places'],
  });

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  const { currentLang } = useLocales();

  const renderGallery = (
    <>
      <Box
        gap={1}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(1, 1fr)',
        }}
        sx={{
          mb: { xs: 3 },
        }}
      >
        <Card>
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {slides.map((app, index) => (
              <CarouselItem
                key={app.id}
                item={app}
                active={index === carousel.currentIndex}
                onClickImage={(srcImage) => handleOpenLightbox(srcImage)}
              />
            ))}
          </Carousel>
          <CarouselArrows
            onNext={carousel.onNext}
            onPrev={carousel.onPrev}
            sx={{ top: 8, right: 8, position: 'absolute', color: 'common.white' }}
          />
        </Card>
      </Box>

      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  );

  const renderHead = (
    <>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Stack direction="row" flex={1} alignItems="center" gap={1}>
          <Typography variant="h4">{name}</Typography>
          <Tooltip title={is_approved ? 'Approved' : 'Pending'}>
            <Iconify
              icon={is_approved ? 'pajamas:partner-verified' : 'bi:clock-fill'}
              sx={{ color: is_approved ? 'success.main' : 'warning.main' }}
            />
          </Tooltip>
          <Tooltip title={type ? getTranslatedData(currentLang, type, 'type') : '-'}>
            <Iconify icon="material-symbols:restaurant" sx={{ color: 'info.main' }} />
          </Tooltip>
        </Stack>
        <Chip
          variant="filled"
          color={is_disabled ? 'error' : 'success'}
          label={is_disabled ? 'CLOSED' : 'OPEN'}
          sx={{
            fontWeight: 'bold',
          }}
        />
      </Stack>

      <Stack direction="row" sx={{ mb: 3 }}>
        <Typography variant="body1">{business_description}</Typography>
      </Stack>

      <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {average_rating}
          </Box>
          <Link sx={{ color: 'text.secondary' }}>{`(${rating_count} reviews)`}</Link>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
          {city ? getTranslatedData(currentLang, city, 'city') : '-'}
        </Stack>
        {owner ? (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
            <Iconify icon="mdi:crown" sx={{ color: 'warning.main' }} />
            <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
              Owned by
            </Box>
            {getUserName(owner)}
          </Stack>
        ) : null}
        {manager ? (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
            <Iconify icon="material-symbols:manage-accounts" sx={{ color: 'info.main' }} />
            <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
              Managed by
            </Box>
            {getUserName(manager)}
          </Stack>
        ) : null}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
          <Iconify icon="solar:calendar-date-bold-duotone" />

          {year_of_established}
        </Stack>
      </Stack>
    </>
  );

  const renderOverview = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
    >
      {[
        {
          label: 'Address',
          value: getFullAddress(business, currentLang) || '-',
          icon: <Iconify icon="mingcute:location-fill" />,
        },
        {
          label: 'Email Address',
          value: owner?.email || '-',
          icon: <Iconify icon="solar:mailbox-bold-duotone" />,
        },
        {
          label: 'Contact',
          value: phone_number ? getPhoneNumber(phone_number) : '-',
          icon: <Iconify icon="solar:phone-bold" />,
        },
        {
          label: 'Whatsapp contact',
          value: business_whatsapp ? getPhoneNumber(business_whatsapp) : '-',
          icon: <Iconify icon="mingcute:whatsapp-fill" />,
        },
        {
          label: 'Cuisines',
          value:
            cuisines && cuisines?.length > 0
              ? cuisines?.reduce((accumulator, currentValue, index) => {
                  const separator = index > 0 ? ', ' : '';
                  return (
                    accumulator +
                    separator +
                    getTranslatedData(currentLang, currentValue?.cuisine, 'cuisines')
                  );
                }, '')
              : '-',
          icon: <Iconify icon="map:food" />,
        },
        {
          label: 'Known for',
          value: known_for || '-',
          icon: <Iconify icon="clarity:info-solid" />,
        },
        {
          label: 'Must order',
          value: must_order || '-',
          icon: <Iconify icon="material-symbols:order-approve" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Box>
  );

  const renderService = (
    <Stack spacing={2}>
      <Typography variant="h6"> Services</Typography>
      {restaurant_services?.length > 0 ? (
        <Box
          rowGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          {restaurant_services.map((service) => (
            <Stack key={service.service} spacing={1} direction="row" alignItems="center">
              <Iconify
                icon="eva:checkmark-circle-2-outline"
                sx={{
                  color: 'primary.main',
                }}
              />
              {service.service}
            </Stack>
          ))}
        </Box>
      ) : (
        <EmptyContent filled title="No Services" sx={{ p: 2 }} />
      )}
    </Stack>
  );

  const renderTimings = (
    <Stack spacing={2}>
      <Typography variant="h6"> Timings</Typography>

      <Box
        rowGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
        }}
      >
        {restaurants_timings?.map(({ weekday, from_hour, to_hour, ...rest }) => (
          <Stack direction="row" alignItems="center" sx={{ typography: 'subtitle2' }} key={rest.id}>
            <Stack direction="row" spacing={0.5} flex={1}>
              <Iconify icon="meteocons:clear-day-fill" sx={{ color: 'warning.main' }} />
              <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
                {weekday}
              </Box>
            </Stack>
            {from_hour && to_hour ? `${from_hour} to ${to_hour}` : 'Not Available'}
          </Stack>
        ))}
      </Box>
    </Stack>
  );

  const renderDirection = (
    <Stack spacing={2}>
      <Typography variant="h6">Get Direction</Typography>
      {isLoaded ? (
        <GoogleMap
          zoom={16}
          center={{
            lat: latitude,
            lng: longitude,
          }}
          mapContainerStyle={{
            width: '100%',
            height: '200px',
            borderRadius: '18px',
          }}
        >
          <Marker
            position={{
              lat: latitude,
              lng: longitude,
            }}
            draggable={false}
          />
        </GoogleMap>
      ) : (
        <LoadingScreen />
      )}
    </Stack>
  );

  return (
    <>
      {renderGallery}

      <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderOverview}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderTimings}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderDirection}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderService}
      </Stack>
    </>
  );
}

BusinessDetailsContent.propTypes = {
  business: PropTypes.object,
};

function CarouselItem({ item, active, onClickImage }) {
  const theme = useTheme();

  const { coverUrl, title, description } = item;

  const renderImg = (
    <Image
      alt={title}
      src={coverUrl}
      onClick={() => onClickImage(coverUrl)}
      overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${
        theme.palette.grey[900]
      } 75%)`}
      sx={{
        width: 1,
        height: {
          xs: 280,
          xl: 320,
        },
      }}
    />
  );
  return (
    <MotionContainer action animate={active} sx={{ position: 'relative' }}>
      <Stack
        spacing={1}
        sx={{
          p: 3,
          width: 1,
          bottom: 0,
          zIndex: 9,
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <m.div variants={varFade().inRight}>
          <Link color="inherit" underline="none">
            <Typography variant="h5" noWrap>
              {title}
            </Typography>
          </Link>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Typography variant="body2" noWrap>
            {description}
          </Typography>
        </m.div>
      </Stack>

      {renderImg}
    </MotionContainer>
  );
}

CarouselItem.propTypes = {
  active: PropTypes.bool,
  item: PropTypes.object,
  onClickImage: PropTypes.func,
};
