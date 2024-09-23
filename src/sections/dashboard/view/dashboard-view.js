'use client';

import { useMemo } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import useMetaData from 'src/hooks/use-meta-data';

import { API_ROUTER } from 'src/utils/axios';
import { getTranslatedData } from 'src/utils/misc';

import { _bookingsOverview } from 'src/_mock';
import { useLocales, useTranslate } from 'src/locales';
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from 'src/assets/illustrations';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

import BookingBooked from '../booking-booked';
import BusinessTypeChart from '../business-type';
import BusinessFeatured from '../business-featured';
import BookingTotalIncomes from '../booking-total-incomes';
import BookingWidgetSummary from '../booking-widget-summary';
import BookingCheckInWidgets from '../booking-check-in-widgets';

const SPACING = 3;

export default function OverviewBookingView() {
  const settings = useSettingsContext();
  const { currentLang } = useLocales();
  const { t } = useTranslate();

  const [insights, isLoading] = useMetaData(API_ROUTER.dashboard.list);

  const TYPES = useMemo(() => {
    if (insights?.types && insights?.types.length > 0) {
      return insights?.types?.map((type) => ({
        label: getTranslatedData(currentLang, type, 'type'),
        value: type.count,
      }));
    }
    return [];
  }, [insights, currentLang]);

  if (isLoading) return <LoadingScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={SPACING} disableEqualOverflow>
        <Grid xs={12}>
          <BusinessFeatured />
        </Grid>
        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title={t('dashboard.app.placeholders.activeBusiness')}
            total={insights?.active_restaurant}
            icon={<BookingIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title={t('dashboard.app.placeholders.totalBusinessOwner')}
            total={insights?.owner_count}
            icon={<CheckInIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title={t('dashboard.app.placeholders.totalVisitors')}
            total={insights?.visitor_count || '0'}
            icon={<CheckoutIllustration />}
          />
        </Grid>

        <Grid container xs={12}>
          <Grid container xs={12} md={8}>
            <Grid xs={12} md={6}>
              <BookingTotalIncomes
                title="Total Incomes"
                total={18765}
                percent={2.6}
                chart={{
                  series: [
                    { x: 2016, y: 111 },
                    { x: 2017, y: 136 },
                    { x: 2018, y: 76 },
                    { x: 2019, y: 108 },
                    { x: 2020, y: 74 },
                    { x: 2021, y: 54 },
                    { x: 2022, y: 57 },
                    { x: 2023, y: 84 },
                  ],
                }}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <BookingBooked title="Booked" data={_bookingsOverview} />
            </Grid>

            <Grid xs={12}>
              <BookingCheckInWidgets
                chart={{
                  series: [
                    {
                      label: t('dashboard.app.placeholders.pendingClaimRequest'),
                      percent: insights?.pending_claim_requests,
                      total: insights?.pending_claim_requests || '0',
                    },
                    {
                      label: t('dashboard.app.placeholders.pendingDetailRequest'),
                      percent: insights?.pending_details_update_requests,
                      total: insights?.pending_details_update_requests || '0',
                    },
                    {
                      label: t('dashboard.app.placeholders.pendingBusiness'),
                      percent: insights?.pending_restaurant_approval,
                      total: insights?.pending_restaurant_approval || '0',
                    },
                  ],
                }}
              />
            </Grid>

            {/* <Grid xs={12}>
              <BookingStatistics
                title="Statistics"
                subheader="(+43% Sold | +12% Canceled) than last year"
                chart={{
                  colors: [theme.palette.primary.main, theme.palette.error.light],
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                  series: [
                    {
                      type: 'Week',
                      data: [
                        {
                          name: 'Sold',
                          data: [10, 41, 35, 151, 49, 62, 69, 91, 48],
                        },
                        {
                          name: 'Canceled',
                          data: [10, 34, 13, 56, 77, 88, 99, 77, 45],
                        },
                      ],
                    },
                    {
                      type: 'Month',
                      data: [
                        {
                          name: 'Sold',
                          data: [148, 91, 69, 62, 49, 51, 35, 41, 10],
                        },
                        {
                          name: 'Canceled',
                          data: [45, 77, 99, 88, 77, 56, 13, 34, 10],
                        },
                      ],
                    },
                    {
                      type: 'Year',
                      data: [
                        {
                          name: 'Sold',
                          data: [76, 42, 29, 41, 27, 138, 117, 86, 63],
                        },
                        {
                          name: 'Canceled',
                          data: [80, 55, 34, 114, 80, 130, 15, 28, 55],
                        },
                      ],
                    },
                  ],
                }}
              />
            </Grid> */}
          </Grid>

          <Grid xs={12} md={4}>
            <BusinessTypeChart
              title={t('dashboard.app.placeholders.businessTypes')}
              chart={{
                series: TYPES,
              }}
            />
            {/* <BookingCustomerReviews
              title="Customer Reviews"
              subheader={`${_bookingReview.length} Reviews`}
              list={_bookingReview}
              sx={{ mt: SPACING }}
            /> */}
          </Grid>
        </Grid>
        {/* 
        <Grid xs={12}>
          <BookingNewest title="Newest Booking" subheader="12 Booking" list={_bookingNew} />
        </Grid>

        <Grid xs={12}>
          <BookingDetails
            title="Booking Details"
            tableData={_bookings}
            tableLabels={[
              { id: 'destination', label: 'Destination' },
              { id: 'customer', label: 'Customer' },
              { id: 'checkIn', label: 'Check In' },
              { id: 'checkOut', label: 'Check Out' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}
