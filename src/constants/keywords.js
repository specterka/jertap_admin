import i18n from 'src/locales/i18n';

const getAlerts = () => {
  if (i18n.isInitialized) {
    return {
      LOGIN_SUCCESS: i18n.t('keywords.toastMessages.auth.login'),
      LOGOUT_SUCCESS: i18n.t('keywords.toastMessages.auth.logout'),

      OTP_SENT_SUCCESS: i18n.t('keywords.toastMessages.auth.otpSent'),
      OTP_VERIFY_SUCCESS: i18n.t('keywords.toastMessages.auth.otpVerify'),

      NOTIFICATION_MARK_AS_READ: i18n.t('keywords.toastMessages.dashboard.notificationRead'),

      BUSINESS_MENU_CREATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.businessMenuCreate'),
      BUSINESS_MENU_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.businessMenuDelete'),
      BUSINESS_MENU_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.businessMenuUpdate'),
      BUSINESS_MENU_UPLOAD_SUCCESS: i18n.t('keywords.toastMessages.dashboard.businessMenuUpload'),

      QA_LIST_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.qaDelete'),
      QA_LIST_UPDATED_SUCCESS: i18n.t('keywords.toastMessages.dashboard.qaUpdate'),

      QUERY_REPLAY_ADD_SUCCESS: i18n.t('keywords.toastMessages.dashboard.queryReplay'),
      QUERY_REPLAY_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.queryReplayUpdate'),

      CATEGORY_CREATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.categoryCreate'),
      CATEGORY_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.categoryDelete'),
      CATEGORIES_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.categoriesDelete'),
      CATEGORY_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.categoryUpdate'),

      SUB_CATEGORY_CREATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.subCategoryCreate'),
      SUB_CATEGORY_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.subCategoryDelete'),
      SUB_CATEGORIES_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.subCategoriesDelete'),
      SUB_CATEGORY_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.subCategoryUpdate'),

      COLLABORATOR_CREATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.collaboratorCreate'),
      COLLABORATOR_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.collaboratorDelete'),
      COLLABORATORS_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.collaboratorsDelete'),
      COLLABORATOR_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.collaboratorUpdate'),

      USER_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.userDelete'),
      USERS_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.usersDelete'),
      USER_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.userUpdate'),

      CLAIM_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.claimDelete'),
      CLAIMS_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.claimsDelete'),
      CLAIM_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.claimUpdate'),

      BUSINESS_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.businessDelete'),
      BUSINESS_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.businessUpdate'),
      BUSINESS_CREATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.businessCreate'),
      BUSINESS_TIMING_UPDATE_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.businessTimingUpdate'
      ),

      SERVICE_CREATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.serviceCreate'),
      SERVICE_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.serviceDelete'),
      SERVICE_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.serviceUpdate'),

      ADS_CREATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.adsCreate'),
      ADS_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.adsDelete'),
      ADS_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.adsUpdate'),

      REPORTED_REVIEW_DELETE_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.reportedReviewDelete'
      ),
      REPORTED_REVIEWS_DELETE_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.reportedReviewsDelete'
      ),
      REPORTED_REVIEW_APPROVED_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.reportedReviewApprove'
      ),

      BUSINESS_REQUEST_DELETE_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.businessRequestDelete'
      ),
      BUSINESS_REQUESTS_DELETE_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.businessRequestsDelete'
      ),
      BUSINESS_REQUEST_APPROVED_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.businessRequestsApprove'
      ),

      DISPUTE_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.disputeDelete'),
      DISPUTES_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.disputesDelete'),
      DISPUTE_RESOLVED_SUCCESS: i18n.t('keywords.toastMessages.dashboard.disputeResolve'),

      CUISINE_CREATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.cuisineCreate'),
      CUISINE_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.cuisineDelete'),
      CUISINE_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.cuisineUpdate'),

      MENU_TYPE_CREATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.menuTypeCreate'),
      MENU_TYPE_DELETE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.menuTypeDelete'),
      MENU_TYPE_UPDATE_SUCCESS: i18n.t('keywords.toastMessages.dashboard.menuTypeUpdate'),

      BUSINESS_CUISINE_CREATE_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.businessCuisineAdd'
      ),
      BUSINESS_CUISINE_DELETE_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.businessCuisineDelete'
      ),

      BUSINESS_PAYMENT_METHOD_CREATE_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.businessPaymentMethodCreate'
      ),
      BUSINESS_PAYMENT_METHOD_DELETE_SUCCESS: i18n.t(
        'keywords.toastMessages.dashboard.businessPaymentMethodDelete'
      ),

      GENERAL_ERROR: i18n.t('toastMessages.common.generalError'),
    };
  }
  return {};
};

export const TOAST_ALERTS = getAlerts();

export const TOAST_TYPES = {
  SUCCESS: 'success',
  WARN: 'warn',
  INFO: 'info',
  ERROR: 'error',
};

export const STORAGE_KEYS = {
  AUTH: '@auth',
  AUTH_TOKEN: '@accessToken',
  AUTH_REFRESH_TOKEN: '@refreshToken',
  SETTINGS: '@settings',
};

export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  MOBILE_NUMBER: 'mobile-number',
};

export const USER_TYPES = {
  VISITOR: 'visitor',
  BUSINESS_OWNER: 'business-owner',
  RESTAURANT_MANAGER: 'restaurant-manager',
  ADMIN: 'admin',
};

export const USER_TYPES_MAPPER = {
  [USER_TYPES.VISITOR]: i18n.t('keywords.userTypes.visitor'),
  [USER_TYPES.BUSINESS_OWNER]: i18n.t('keywords.userTypes.visitor'),
  [USER_TYPES.RESTAURANT_MANAGER]: i18n.t('keywords.userTypes.manager'),
  [USER_TYPES.ADMIN]: i18n.t('keywords.userTypes.admin'),
};

export const BUSINESS_STATUS = {
  NOT_CREATED: i18n.t('keywords.businessStatus.notCreated'),
  UNDER_REVIEW: i18n.t('keywords.businessStatus.underReview'),
  APPROVED: i18n.t('keywords.businessStatus.approved'),
};

export const BUSINESS_TYPES = {
  CAFE: 'cafe',
  RESTAURANT: 'restaurant',
};

export const BUSINESS_TYPES_MAPPER = {
  [BUSINESS_TYPES.CAFE]: i18n.t('keywords.businessTypes.cafe'),
  [BUSINESS_TYPES.RESTAURANT]: i18n.t('keywords.businessTypes.restaurant'),
};
