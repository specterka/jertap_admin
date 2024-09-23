import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  category: {
    list: '/super_admin/category-list/',
  },
};

const getAdminRouter = (path) => `super_admin/${path}/`;

export const API_ROUTER = {
  // AUTH
  login: (provider) => getAdminRouter(`login-with-${provider}`),
  verify: getAdminRouter(`verify-login-otp`),
  tokenRefresh: getAdminRouter('token-refresh'),
  getUser: getAdminRouter('get-user'),

  // DASHBOARD
  category: {
    all: getAdminRouter('category-dropdown'),
    list: getAdminRouter('category-list'),
    create: getAdminRouter('add-category'),
    update: (id) => getAdminRouter(`category/${id}`),
    remove: (id) => getAdminRouter(`category/${id}`),
  },
  subCategory: {
    list: getAdminRouter('sub-category-list'),
    create: getAdminRouter('add-sub-category'),
    update: (id) => getAdminRouter(`sub-category/${id}`),
    remove: (id) => getAdminRouter(`sub-category/${id}`),
  },
  collaborator: {
    list: getAdminRouter('collaborator-list'),
    create: getAdminRouter('add-collaborator'),
    update: (id) => getAdminRouter(`collaborator/${id}`),
    remove: (id) => getAdminRouter(`collaborator/${id}`),
    read: (id) => getAdminRouter(`collaborator/${id}`),
  },
  claim: {
    list: getAdminRouter('claim-list'),
    update: (id) => getAdminRouter(`claim/${id}`),
    remove: (id) => getAdminRouter(`claim/${id}`),
    read: (id) => getAdminRouter(`claim/${id}`),
  },
  user: {
    list: getAdminRouter('user-list'),
    update: (id) => getAdminRouter(`user/${id}`),
    remove: (id) => getAdminRouter(`user/${id}`),
    read: (id) => getAdminRouter(`user/${id}`),
  },
  business: {
    list: getAdminRouter('restaurant-list'),
    update: (id) => getAdminRouter(`restaurant/${id}`),
    remove: (id) => getAdminRouter(`restaurant/${id}`),
    read: (id) => getAdminRouter(`restaurant/${id}`),
    create: getAdminRouter('restaurant-create'),
    services: {
      list: (id) => getAdminRouter(`restaurant-services/${id}`),
      remove: (businessId, id) => getAdminRouter(`remove-services/${businessId}/${id}`),
      create: (businessId) => getAdminRouter(`add-services/${businessId}`),
    },
    timings: {
      list: (businessId) => getAdminRouter(`restaurant-timings/${businessId}`),
      edit: (businessId, id) => getAdminRouter(`restaurant-time-update/${businessId}/${id}`),
    },
    requests: {
      list: getAdminRouter(`restaurant-details-change-requests`),
      update: (id) => getAdminRouter(`restaurant-details-change-request/${id}`),
      remove: (id) => getAdminRouter(`restaurant-details-change-request/${id}`),
      read: (id) => getAdminRouter(`restaurant-details-change-request/${id}`),
    },
    menus: {
      list: (businessId) => getAdminRouter(`restaurant-menu/${businessId}`),
      create: (businessId) => getAdminRouter(`restaurant-add-menu-item/${businessId}`),
      update: (businessId, id) => getAdminRouter(`restaurant-update-menu-item/${businessId}/${id}`),
      remove: (businessId, id) => getAdminRouter(`restaurant-menu-item/delete/${businessId}/${id}`),
      get: (businessId, id) => getAdminRouter(`restaurant-menu-item/${businessId}/${id}`),
      upload: (businessId) => getAdminRouter(`restaurant-upload-menu-csv/${businessId}`),
    },
  },
  notifications: {
    list: getAdminRouter('admin-notifications'),
    read: (id) => getAdminRouter(`admin-notifications/mark-as_read/${id}`),
  },
  service: {
    list: (id = 0) => getAdminRouter(`all-services/${id}`),
    update: (id) => getAdminRouter(`service/${id}`),
    remove: (id) => getAdminRouter(`service/${id}`),
    read: (id) => getAdminRouter(`service/${id}`),
    create: getAdminRouter('service'),
  },
  ads: {
    list: getAdminRouter('ads'),
    update: (id) => getAdminRouter(`ads-detail/${id}`),
    remove: (id) => getAdminRouter(`ads-detail/${id}`),
    read: (id) => getAdminRouter(`ads-detail/${id}`),
    create: getAdminRouter('ads'),
  },
  reportReview: {
    list: getAdminRouter('reported-reviews'),
    update: (id) => getAdminRouter(`reported-reviews-action/${id}`),
    remove: (id) => getAdminRouter(`reported-reviews-action/${id}`),
  },
  disputes: {
    list: getAdminRouter(`user-dispute-list`),
    update: (id) => getAdminRouter(`user-dispute/${id}`),
    remove: (id) => getAdminRouter(`user-dispute/${id}`),
    get: (id) => getAdminRouter(`user-dispute/${id}`),
  },
  dashboard: {
    list: getAdminRouter(`dashboard-data`),
  },
  cuisine: {
    list: getAdminRouter('cuisines-list'),
    create: getAdminRouter('add-cuisines'),
    update: (id) => getAdminRouter(`cuisines/${id}`),
    remove: (id) => getAdminRouter(`cuisines/${id}`),
  },
  menuType: {
    list: getAdminRouter('menu-type-list'),
    create: getAdminRouter('add-menu-type'),
    update: (id) => getAdminRouter(`menu-type/${id}`),
    remove: (id) => getAdminRouter(`menu-type/${id}`),
  },

  getCities: getAdminRouter('all-cities'),
  getStates: getAdminRouter('all-states'),
  getBusinessTypes: getAdminRouter('all-business-types'),
  getAllCuisines: (businessId) => getAdminRouter(`all-cuisines/${businessId}`),
  getBusinessCuisines: (businessId) => getAdminRouter(`restaurant-cuisine/${businessId}`),
  addCuisineToBusiness: (businessId) => getAdminRouter(`add-cuisine/${businessId}`),
  deleteCuisineFromBusiness: (businessId, id) =>
    getAdminRouter(`remove-cuisine/${businessId}/${id}`),
  getAllPaymentMethods: (businessId) => getAdminRouter(`all-payment-modes/${businessId}`),
  getBusinessPaymentMethods: (businessId) =>
    getAdminRouter(`restaurant-payment-methods/${businessId}`),
  addPaymentMethodToBusiness: (businessId) => getAdminRouter(`add-payment-method/${businessId}`),
  deletePaymentMethodFromBusiness: (businessId, id) =>
    getAdminRouter(`remove-payment-method/${businessId}/${id}`),
  getSubCategories: (businessId) => getAdminRouter(`restaurant-sub-categories/${businessId}`),
  removeBusinessMenuIngredientItem: (businessId, id) =>
    getAdminRouter(`restaurant-delete-menu-item-ingredient/${businessId}/${id}`),
  uploadBusinessMenu: (businessId) => getAdminRouter(`restaurant-upload-menu-csv/${businessId}`),
};
