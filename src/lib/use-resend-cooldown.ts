import { useEffect, useRef, useState } from 'react';

const COOLDOWN_SECONDS = 30; // matches RESEND_COOLDOWN_SECONDS on the backend

export function useResendCooldown() {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startCooldown() {
    setRemainingSeconds(COOLDOWN_SECONDS);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  return { remainingSeconds, canResend: remainingSeconds === 0, startCooldown };
}
