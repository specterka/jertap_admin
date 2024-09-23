import { useState, useEffect } from 'react';

import { axiosGet, axiosPost } from '../services/axiosHelper';

const useMetaData = (
  apiRoute,
  payLoad = {},
  initial = false,
  isPost = false,
  needTimeStamp = false
) => {
  // States
  const [metaData, setMetaData] = useState(null);
  const [timeStamp, setTimeStamp] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  let isRender = false;

  // Effects
  useEffect(() => {
    if (initial) return;
    if (!isRender) {
      fetchMetaData(payLoad);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isRender = true;
    }
  }, []);

  const fetchMetaData = async (payload, queryParam = '', targetParam = '') => {
    setIsFetching(true);

    try {
      const res = isPost
        ? await axiosPost(apiRoute, payload)
        : await axiosGet(
            queryParam ? apiRoute.replace(targetParam, queryParam) : apiRoute,
            payload
          );
      setIsFetching(false);
      if (res.status) {
        if (needTimeStamp) setTimeStamp(new Date());
        setMetaData(res.data);
      } else {
        if (needTimeStamp) setTimeStamp(null);
        setMetaData(null);
      }
    } catch (error) {
      setIsFetching(false);
    }
  };

  // Return
  return [metaData, isFetching, fetchMetaData, timeStamp];
};

export default useMetaData;
