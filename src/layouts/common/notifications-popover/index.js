import { m } from 'framer-motion';
import { useSnackbar } from 'notistack';

import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import useMetaData from 'src/hooks/use-meta-data';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { API_ROUTER } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { axiosPatch } from 'src/services/axiosHelper';
import { TOAST_TYPES, TOAST_ALERTS } from 'src/constants';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
import EmptyContent from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import NotificationItem from './notification-item';

export default function NotificationsPopover() {
  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');
  const { t } = useTranslate();

  const [notifications, isLoading, fetchNotifications] = useMetaData(API_ROUTER.notifications.list);
  const { enqueueSnackbar } = useSnackbar();

  const totalUnRead = notifications?.length;

  const handleMarkAllAsRead = async () => {
    await onReadNotification(notifications?.map(({ id }) => id));
  };

  const onReadNotification = async (notificationIds) => {
    try {
      await Promise.all(
        notificationIds.map(async (id) => {
          await axiosPatch(API_ROUTER.notifications.read(id), { is_read: true });
        })
      );
      enqueueSnackbar(TOAST_ALERTS.NOTIFICATION_MARK_AS_READ, { variant: TOAST_TYPES.SUCCESS });
      fetchNotifications();
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, { variant: TOAST_TYPES.ERROR });
    }
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('dashboard.layout.header.notification.heading')}
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {notifications && notifications?.length > 0 ? (
          notifications?.map((notification) => (
            <NotificationItem
              key={notification?.id}
              notification={notification}
              onReadNotification={() => onReadNotification([notification.id])}
            />
          ))
        ) : (
          <EmptyContent
            filled
            title={t('dashboard.layout.header.notification.emptyMessage')}
            sx={{
              py: 20,
            }}
          />
        )}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Divider />

        {isLoading ? <LoadingScreen /> : renderList}
      </Drawer>
    </>
  );
}
