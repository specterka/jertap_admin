'use client';

import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CollaboratorNewEditForm from '../collaborator-new-edit-form';

export default function CollaboratorEditView({ id }) {
  const settings = useSettingsContext();

  const [currentCollaborator, isLoading] = useMetaData(API_ROUTER.collaborator.read(id));

  if (isLoading) return <LoadingScreen />;

  if (!currentCollaborator)
    return (
      <EmptyContent
        filled
        title="Details not found!"
        description="Look like collaborator is not exist."
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.collaborator.list}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            Back to List
          </Button>
        }
      />
    );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Collaborators',
            href: paths.dashboard.collaborator.list,
          },
          { name: currentCollaborator?.full_name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CollaboratorNewEditForm currentCollaborator={currentCollaborator || {}} />
    </Container>
  );
}

CollaboratorEditView.propTypes = {
  id: PropTypes.string,
};
