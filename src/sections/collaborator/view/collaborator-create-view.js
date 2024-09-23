'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CollaboratorNewEditForm from '../collaborator-new-edit-form';

export default function CollaboratorCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('collaborator.create.heading')}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Collaborators',
            href: paths.dashboard.collaborator.list,
          },
          { name: 'New collaborator' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CollaboratorNewEditForm />
    </Container>
  );
}
