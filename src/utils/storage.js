'use client';

import { SECRET_KEY } from 'src/config-global';

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jwt-simple');

export const encodeData = (data) => jwt.encode(data, SECRET_KEY);

export const decodeData = (encryptedData) => jwt.decode(encryptedData, SECRET_KEY);

export const saveData = (key, value) => {
  if (window) {
    try {
      const encryptedData = encodeData(value);
      window.localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.warn(error);
    }
  }
};

export const getData = (key) => {
  if (window) {
    try {
      const localEncryptedData = window.localStorage.getItem(key);
      if (localEncryptedData) {
        return decodeData(localEncryptedData);
      }
    } catch (error) {
      return '';
    }
  }
  return '';
};

export const removeData = (key) => {
  if (window) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(error);
    }
  }
};

export const updateData = (key, value) => {
  if (window) {
    try {
      removeData(key);
      saveData(key, value);
    } catch (error) {
      console.warn(error);
    }
  }
};

export const removeAll = () => {
  if (window) {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.warn(error);
    }
  }
};
