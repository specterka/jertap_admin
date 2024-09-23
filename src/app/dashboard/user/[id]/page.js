import PropTypes from 'prop-types';

import { UserProfileView } from 'src/sections/user/view';

export const metadata = {
  title: 'Dashboard: User Details',
};

export default function UserProfilePage({ params }) {
  const { id } = params;

  return <UserProfileView id={id} />;
}

UserProfilePage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
