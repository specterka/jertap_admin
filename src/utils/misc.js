import { USER_TYPES } from 'src/constants';

export const getUserRole = (user) => {
  if (!user) return '';
  if (user?.is_superuser) return USER_TYPES.ADMIN;
  if (user?.is_cafe_owner) return USER_TYPES.BUSINESS_OWNER;
  if (user?.is_cafe_manager) return USER_TYPES.RESTAURANT_MANAGER;
  if (user?.is_visitor) return USER_TYPES.VISITOR;
  return USER_TYPES.VISITOR;
};

export const getUserName = (user) => {
  if (!user) return '';
  if (user?.first_name && user?.last_name) return `${user?.first_name} ${user?.last_name}`;
  return user?.username;
};

export const getFullName = (user) => {
  let updatedUser = '';
  if (!user) updatedUser = '-';
  if (user?.first_name) {
    updatedUser += user.first_name;
  }
  if (user?.last_name) {
    updatedUser += ` ${user.last_name}`;
  }
  return updatedUser || '-';
};

export const getFullAddress = (addressObj, currentLang = '') => {
  let addressText = '';
  const { location, address, city, state, zipcode } = addressObj;
  if (address)
    addressText += currentLang ? getTranslatedData(currentLang, addressObj, 'address') : address;
  if (location) addressText += `, ${location}`;
  if (city)
    addressText += currentLang ? `, ${getTranslatedData(currentLang, city, 'city')}` : `, ${city}`;
  if (state)
    addressText += currentLang
      ? `, ${getTranslatedData(currentLang, state, 'state')}`
      : `, ${state}`;
  if (zipcode) addressText += `, ${zipcode}`;

  return `${addressText}`;
};

export const getPastYears = (count = 20) => {
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: count + 1 }, (_, index) => currentYear - index);

  return years;
};

export const getPhoneNumber = (phoneNumber, isExtract = false) => {
  if (isExtract) {
    return phoneNumber.includes('+') ? phoneNumber.replace(/\+/g, '') : phoneNumber;
  }
  return phoneNumber.includes('+') ? phoneNumber : `+${phoneNumber}`;
};

export const generateArray = (length = 0) => Array.from({ length }, (_, index) => index + 1);

export function getDateFromTimeString(timeString) {
  const dateTime = new Date();
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  dateTime.setHours(hours, minutes, seconds);
  return dateTime;
}

export const getRequestType = (request) => {
  let type = '';
  if (request?.name) type += 'Name';
  if (request?.location) type += 'Location ';
  if (request?.address) type += 'Address ';
  if (request?.city) type += 'City ';
  if (request?.state) type += 'State ';
  if (request?.zipcode) type += 'Zipcode ';
  if (request?.country) type += 'Country ';
  if (request?.latitude && request?.longitude) type += 'Location PinPoint';
  return type?.replaceAll(' ', ', ');
};

export const getTranslatedData = (currentLang, data, key) => {
  if (!data[key]) return '';
  switch (currentLang.value) {
    case 'en':
      return data[key];
    case 'ru':
      return data[`${key}_${currentLang.value}`] || data[key];
    default:
      return data[key];
  }
};
