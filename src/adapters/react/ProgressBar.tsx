import { useEffect, useState, useRef } from 'react';
import { useCompassContext } from './CompassContext';

type ProgressBarProps = {
  color?: string;
  height?: number;
  delay?: number;
  duration?: number;
};

const STYLES = {
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    pointerEvents: 'none' as const,
  },
  bar: {
    height: 3,
    transition: 'width 200ms ease-out, opacity 200ms ease-out',
  },
};

export const ProgressBar = ({
  color = '#3b82f6',
  height = 3,
  delay = 100,
  duration = 300,
}: ProgressBarProps): JSX.Element | null => {
  const { state } = useCompassContext();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.isNavigating) {
      timeoutRef.current = setTimeout(() => {
        setVisible(true);
        setProgress(10);
        
        intervalRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              return prev;
            }
            return prev + Math.random() * 10;
          });
        }, 200);
      }, delay);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      if (visible) {
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, duration);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isNavigating, delay, duration, visible]);

  if (!visible && progress === 0) return null;

  return (
    <div style={STYLES.container}>
      <div
        style={{
          ...STYLES.bar,
          height,
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          opacity: visible ? 1 : 0,
          boxShadow: `0 0 10px ${color}80, 0 0 5px ${color}40`,
        }}
      />
    </div>
  );
};

