import { useState, useEffect } from 'react';

const useTimer = (initialTime, callback) => {
  // States
  const [seconds, setSeconds] = useState(initialTime);

  // Effects
  useEffect(() => {
    let intervalId;
    const decrementTime = () => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    };
    if (seconds > 0) {
      intervalId = setInterval(decrementTime, 1000);
    } else {
      callback();
    }
    return () => clearInterval(intervalId);
  }, [seconds, callback]);

  const resetTimer = () => {
    setSeconds(initialTime);
  };

  return { seconds, resetTimer };
};

export default useTimer;
