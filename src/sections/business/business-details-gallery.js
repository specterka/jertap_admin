import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import Image from 'src/components/image';
import EmptyContent from 'src/components/empty-content';
import Lightbox, { useLightBox } from 'src/components/lightbox';

export default function BusinessDetailGallery({ business }) {
  const theme = useTheme();

  const slides = business?.restaurant_images?.map((slide) => ({
    src: slide.image,
  }));

  const lightbox = useLightBox(slides);

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Gallery
      </Typography>
      {business?.restaurant_images?.length > 0 ? (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {business?.restaurant_images?.map((image) => (
            <Card key={image.id} sx={{ cursor: 'pointer', color: 'common.white' }}>
              <ListItemText
                sx={{
                  p: 3,
                  left: 0,
                  width: 1,
                  bottom: 0,
                  zIndex: 9,
                  position: 'absolute',
                }}
                primary={image?.title}
                secondary=""
                primaryTypographyProps={{
                  noWrap: true,
                  typography: 'subtitle1',
                }}
                secondaryTypographyProps={{
                  mt: 0.5,
                  color: 'inherit',
                  component: 'span',
                  typography: 'body2',
                  sx: { opacity: 0.48 },
                }}
              />

              <Image
                alt="gallery"
                ratio="1/1"
                src={image.image}
                onClick={() => lightbox.onOpen(image.image)}
                overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${
                  theme.palette.grey[900]
                } 75%)`}
              />
            </Card>
          ))}
        </Box>
      ) : (
        <EmptyContent filled title="No Photos Available" sx={{ p: 2 }} />
      )}

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}

BusinessDetailGallery.propTypes = {
  business: PropTypes.object,
};
