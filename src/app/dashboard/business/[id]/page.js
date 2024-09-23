import PropTypes from 'prop-types';

import { BusinessProfileView } from 'src/sections/business/view';

export const metadata = {
  title: 'Dashboard: Business Details',
};

export default function BusinessProfilePage({ params }) {
  const { id } = params;

  return <BusinessProfileView id={id} />;
}

BusinessProfilePage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
