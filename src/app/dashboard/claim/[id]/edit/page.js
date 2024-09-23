import PropTypes from 'prop-types';

import { ClaimDetailView } from 'src/sections/claim/view';

export const metadata = {
  title: 'Dashboard: Claim Detail',
};

export default function ClaimDetailPage({ params }) {
  const { id } = params;

  return <ClaimDetailView id={id} />;
}

ClaimDetailPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
