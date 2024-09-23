import PropTypes from 'prop-types';

import { CollaboratorEditView } from 'src/sections/collaborator/view';

export const metadata = {
  title: 'Dashboard: Update Collaborator',
};

export default function CollaboratorEditPage({ params }) {
  const { id } = params;
  return <CollaboratorEditView id={id} />;
}

CollaboratorEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
