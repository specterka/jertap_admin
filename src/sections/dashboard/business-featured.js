import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';
import { getTranslatedData } from 'src/utils/misc';

import { useLocales } from 'src/locales';

import Image from 'src/components/image';
import { varFade, MotionContainer } from 'src/components/animate';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';

export default function BusinessFeatured({ ...other }) {
  // Hooks
  const [businesses, isLoading] = useMetaData(API_ROUTER.business.list);

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

  if (isLoading) return <Skeleton />;

  return (
    <Card {...other}>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {businesses?.results?.map((app, index) => (
          <CarouselItem key={app.id} item={app} active={index === carousel.currentIndex} />
        ))}
      </Carousel>

      <CarouselArrows
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
        sx={{ top: 8, right: 8, position: 'absolute', color: 'common.white' }}
      />
    </Card>
  );
}

BusinessFeatured.propTypes = {
  list: PropTypes.array,
};

// ----------------------------------------------------------------------

function CarouselItem({ item, active }) {
  const theme = useTheme();
  const { currentLang } = useLocales();
  const { profile_image, name, city, type } = item;

  const renderImg = (
    <Image
      alt={name}
      src={profile_image || `https://eu.ui-avatars.com/api/?name=${name}&size=164`}
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
          <Typography variant="overline" sx={{ color: 'primary.light' }}>
            {type ? getTranslatedData(currentLang, type, 'type') : '-'}
          </Typography>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Link color="inherit" underline="none">
            <Typography variant="h5" noWrap>
              {name}
            </Typography>
          </Link>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Typography variant="body2" noWrap>
            {city ? getTranslatedData(currentLang, city, 'city') : '-'}
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
};
