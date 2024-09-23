import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  category: icon('ic_category'),
  subCategory: icon('ic_subcategory'),
  cuisine: icon('ic_cuisine'),
  collaborator: icon('ic_collaborator'),
  claim: icon('ic_claim'),
  user: icon('ic_user'),
  business: icon('ic_business'),
  service: icon('ic_service'),
  ads: icon('ic_ads'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  reportReview: icon('ic_reportreview'),
  dispute: icon('ic_dispute'),
  menuType: icon('ic_menutype'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('dashboard.layout.sidebar.menus.overview'),
        items: [
          {
            title: t('dashboard.layout.sidebar.menus.app'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('dashboard.layout.sidebar.menus.management'),
        items: [
          // CATEGORY
          {
            title: t('dashboard.layout.sidebar.menus.category'),
            path: paths.dashboard.category.root,
            icon: ICONS.category,
            children: [
              {
                title: t('dashboard.layout.sidebar.menus.list'),
                path: paths.dashboard.category.list,
              },
            ],
          },
          // SUB CATEGORY
          {
            title: t('dashboard.layout.sidebar.menus.subCategory'),
            path: paths.dashboard.subCategory.root,
            icon: ICONS.subCategory,
            children: [
              {
                title: t('dashboard.layout.sidebar.menus.list'),
                path: paths.dashboard.subCategory.list,
              },
            ],
          },
          // CUISINE
          {
            title: t('dashboard.layout.sidebar.menus.cuisine'),
            path: paths.dashboard.cuisine.root,
            icon: ICONS.cuisine,
            children: [
              {
                title: t('dashboard.layout.sidebar.menus.list'),
                path: paths.dashboard.cuisine.list,
              },
            ],
          },
          // COLLABORATOR
          {
            title: t('dashboard.layout.sidebar.menus.collaborator'),
            path: paths.dashboard.collaborator.root,
            icon: ICONS.collaborator,
            children: [
              {
                title: t('dashboard.layout.sidebar.menus.list'),
                path: paths.dashboard.collaborator.list,
              },
              {
                title: t('dashboard.layout.sidebar.menus.create'),
                path: paths.dashboard.collaborator.new,
              },
            ],
          },
          // CLAIM
          {
            title: t('dashboard.layout.sidebar.menus.claim'),
            path: paths.dashboard.claim.root,
            icon: ICONS.claim,
            children: [
              { title: t('dashboard.layout.sidebar.menus.list'), path: paths.dashboard.claim.list },
            ],
          },
          // USER
          {
            title: t('dashboard.layout.sidebar.menus.user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: t('dashboard.layout.sidebar.menus.list'), path: paths.dashboard.user.list },
            ],
          },
          // BUSINESS
          {
            title: t('dashboard.layout.sidebar.menus.business'),
            path: paths.dashboard.business.root,
            icon: ICONS.business,
            children: [
              {
                title: t('dashboard.layout.sidebar.menus.list'),
                path: paths.dashboard.business.list,
              },
              {
                title: t('dashboard.layout.sidebar.menus.create'),
                path: paths.dashboard.business.new,
              },
              {
                title: t('dashboard.layout.sidebar.menus.requests'),
                path: paths.dashboard.business.requests,
              },
            ],
          },
          // SERVICE
          {
            title: t('dashboard.layout.sidebar.menus.service'),
            path: paths.dashboard.service.root,
            icon: ICONS.service,
            children: [
              {
                title: t('dashboard.layout.sidebar.menus.list'),
                path: paths.dashboard.service.list,
              },
            ],
          },
          // ADS
          {
            title: t('dashboard.layout.sidebar.menus.ads'),
            path: paths.dashboard.ads.root,
            icon: ICONS.ads,
            children: [
              { title: t('dashboard.layout.sidebar.menus.list'), path: paths.dashboard.ads.list },
            ],
          },
          // REPORTED REVIEWS
          {
            title: t('dashboard.layout.sidebar.menus.reportReviews'),
            path: paths.dashboard.reportReview.root,
            icon: ICONS.reportReview,
            children: [
              {
                title: t('dashboard.layout.sidebar.menus.list'),
                path: paths.dashboard.reportReview.list,
              },
            ],
          },
          // USER DISPUTE
          {
            title: t('dashboard.layout.sidebar.menus.dispute'),
            path: paths.dashboard.dispute.root,
            icon: ICONS.dispute,
            children: [
              {
                title: t('dashboard.layout.sidebar.menus.list'),
                path: paths.dashboard.dispute.list,
              },
            ],
          },
          // MENU TYPES
          {
            title: t('dashboard.layout.sidebar.menus.menuType'),
            path: paths.dashboard.menuType.root,
            icon: ICONS.menuType,
            children: [
              {
                title: t('dashboard.layout.sidebar.menus.list'),
                path: paths.dashboard.menuType.list,
              },
            ],
          },
          // PRODUCT
          // {
          //   title: t('product'),
          //   path: paths.dashboard.product.root,
          //   icon: ICONS.product,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.product.root },
          //     {
          //       title: t('details'),
          //       path: paths.dashboard.product.demo.details,
          //     },
          //     { title: t('create'), path: paths.dashboard.product.new },
          //     { title: t('edit'), path: paths.dashboard.product.demo.edit },
          //   ],
          // },

          // ORDER
          // {
          //   title: t('order'),
          //   path: paths.dashboard.order.root,
          //   icon: ICONS.order,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.order.root },
          //     { title: t('details'), path: paths.dashboard.order.demo.details },
          //   ],
          // },

          // INVOICE
          // {
          //   title: t('invoice'),
          //   path: paths.dashboard.invoice.root,
          //   icon: ICONS.invoice,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.invoice.root },
          //     {
          //       title: t('details'),
          //       path: paths.dashboard.invoice.demo.details,
          //     },
          //     { title: t('create'), path: paths.dashboard.invoice.new },
          //     { title: t('edit'), path: paths.dashboard.invoice.demo.edit },
          //   ],
          // },

          // BLOG
          // {
          //   title: t('blog'),
          //   path: paths.dashboard.post.root,
          //   icon: ICONS.blog,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.post.root },
          //     { title: t('details'), path: paths.dashboard.post.demo.details },
          //     { title: t('create'), path: paths.dashboard.post.new },
          //     { title: t('edit'), path: paths.dashboard.post.demo.edit },
          //   ],
          // },

          // JOB
          // {
          //   title: t('job'),
          //   path: paths.dashboard.job.root,
          //   icon: ICONS.job,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.job.root },
          //     { title: t('details'), path: paths.dashboard.job.demo.details },
          //     { title: t('create'), path: paths.dashboard.job.new },
          //     { title: t('edit'), path: paths.dashboard.job.demo.edit },
          //   ],
          // },

          // TOUR
          // {
          //   title: t('tour'),
          //   path: paths.dashboard.tour.root,
          //   icon: ICONS.tour,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.tour.root },
          //     { title: t('details'), path: paths.dashboard.tour.demo.details },
          //     { title: t('create'), path: paths.dashboard.tour.new },
          //     { title: t('edit'), path: paths.dashboard.tour.demo.edit },
          //   ],
          // },

          // FILE MANAGER
          // {
          //   title: t('file_manager'),
          //   path: paths.dashboard.fileManager,
          //   icon: ICONS.folder,
          // },

          // MAIL
          // {
          //   title: t('mail'),
          //   path: paths.dashboard.mail,
          //   icon: ICONS.mail,
          //   info: <Label color="error">+32</Label>,
          // },

          // CHAT
          // {
          //   title: t('chat'),
          //   path: paths.dashboard.chat,
          //   icon: ICONS.chat,
          // },

          // CALENDAR
          // {
          //   title: t('calendar'),
          //   path: paths.dashboard.calendar,
          //   icon: ICONS.calendar,
          // },

          // KANBAN
          // {
          //   title: t('kanban'),
          //   path: paths.dashboard.kanban,
          //   icon: ICONS.kanban,
          // },
        ],
      },

      // DEMO MENU STATES
      // {
      //   subheader: t(t('other_cases')),
      //   items: [
      //     {
      //       // default roles : All roles can see this entry.
      //       // roles: ['user'] Only users can see this item.
      //       // roles: ['admin'] Only admin can see this item.
      //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
      //       // Reference from 'src/guards/RoleBasedGuard'.
      //       title: t('item_by_roles'),
      //       path: paths.dashboard.permission,
      //       icon: ICONS.lock,
      //       roles: ['admin', 'manager'],
      //       caption: t('only_admin_can_see_this_item'),
      //     },
      //     {
      //       title: t('menu_level'),
      //       path: '#/dashboard/menu_level',
      //       icon: ICONS.menuItem,
      //       children: [
      //         {
      //           title: t('menu_level_1a'),
      //           path: '#/dashboard/menu_level/menu_level_1a',
      //         },
      //         {
      //           title: t('menu_level_1b'),
      //           path: '#/dashboard/menu_level/menu_level_1b',
      //           children: [
      //             {
      //               title: t('menu_level_2a'),
      //               path: '#/dashboard/menu_level/menu_level_1b/menu_level_2a',
      //             },
      //             {
      //               title: t('menu_level_2b'),
      //               path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b',
      //               children: [
      //                 {
      //                   title: t('menu_level_3a'),
      //                   path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3a',
      //                 },
      //                 {
      //                   title: t('menu_level_3b'),
      //                   path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3b',
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     {
      //       title: t('item_disabled'),
      //       path: '#disabled',
      //       icon: ICONS.disabled,
      //       disabled: true,
      //     },
      //     {
      //       title: t('item_label'),
      //       path: '#label',
      //       icon: ICONS.label,
      //       info: (
      //         <Label color="info" startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}>
      //           NEW
      //         </Label>
      //       ),
      //     },
      //     {
      //       title: t('item_caption'),
      //       path: '#caption',
      //       icon: ICONS.menuItem,
      //       caption:
      //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
      //     },
      //     {
      //       title: t('item_external_link'),
      //       path: 'https://www.google.com/',
      //       icon: ICONS.external,
      //     },
      //     {
      //       title: t('blank'),
      //       path: paths.dashboard.blank,
      //       icon: ICONS.blank,
      //     },
      //   ],
      // },
    ],
    [t]
  );

  return data;
}
