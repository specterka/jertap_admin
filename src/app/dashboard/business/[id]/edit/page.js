import PropTypes from 'prop-types';

import { BusinessEditView } from 'src/sections/business/view';

export const metadata = {
  title: 'Dashboard: Business Edit',
};

export default function BusinessEditPage({ params }) {
  const { id } = params;

  return <BusinessEditView id={id} />;
}

BusinessEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
