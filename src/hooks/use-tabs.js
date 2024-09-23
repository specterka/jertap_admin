'use client';

import { useState } from 'react';

const useTabs = (defaultValues) => {
  // States
  const [currentTab, setCurrentTab] = useState(defaultValues || '');

  return {
    currentTab,
    onChangeTab: (event) => setCurrentTab(event),
    setCurrentTab,
  };
};

export default useTabs;
