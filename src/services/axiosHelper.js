import axiosInstance from '../utils/axios';

export const axiosPost = async (url, data, contentType = 'application/json') => {
  let response = {};
  try {
    const result = await axiosInstance.post(url, data, {
      headers: {
        'Content-Type': contentType,
      },
    });
    response = result.data;
    response.status = [200, 201].includes(result.status);
  } catch (e) {
    response.status = false;
    response.message =
      e?.response?.data?.detail ||
      e?.response?.data?.details ||
      e?.non_field_errors?.[0] ||
      'Something went wrong';
    response.data = e?.response?.data || e;
  }
  return response;
};

export const axiosGet = async (url, params = {}, contentType = 'application/json') => {
  const response = {};
  try {
    const result = await axiosInstance.get(url, {
      headers: {
        'Content-Type': contentType,
      },
      params,
    });
    response.data = result.data;
    response.status = [200, 201].includes(result.status);
  } catch (e) {
    response.status = false;
    response.message = 'something went wrong';
    response.data = e;
  }
  return response;
};

export const axiosPatch = async (url, data, contentType = 'application/json') => {
  let response = {};
  try {
    const result = await axiosInstance.patch(url, data, {
      headers: {
        'Content-Type': contentType,
      },
    });
    response = result.data;
    response.status = result.data?.status || [200, 201].includes(result.status);
  } catch (e) {
    response.status = false;
    response.message = e?.response?.data?.detail || 'something went wrong';
    response.data = e;
  }
  return response;
};

export const axiosPut = async (url, data, contentType = 'application/json') => {
  let response = {};
  try {
    const result = await axiosInstance.put(url, data, {
      headers: {
        'Content-Type': contentType,
      },
    });
    response = result.data;
    response.status = [200, 201].includes(result.status);
  } catch (e) {
    response.status = false;
    response.message = 'something went wrong';
    response.data = e;
  }
  return response;
};

export const axiosDelete = async (url, data, contentType = 'application/json') => {
  let response = {};
  try {
    const result = await axiosInstance.delete(url, {
      headers: {
        'Content-Type': contentType,
      },
    });
    response = result.data;
    response.status = [200, 201].includes(result.status);
  } catch (e) {
    response.status = false;
    response.message = 'something went wrong';
    response.data = e;
  }
  return response;
};
