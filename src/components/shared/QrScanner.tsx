import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

// Goes straight to the rear/environment-facing camera via a facingMode
// constraint — no manual "pick a camera" dropdown. That's what
// Html5QrcodeScanner (the higher-level, self-rendering class this used to
// use) shows by default on any phone, since it always has at least a front
// (selfie) and back camera; nobody scans a QR code with the selfie camera,
// so that picker was pure friction. Html5Qrcode (this lower-level class)
// gives direct control over which camera starts instead.
export function QrScanner({ elementId, onScan }: { elementId: string; onScan: (text: string) => void }) {
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    const scanner = new Html5Qrcode(elementId);
    let started = false;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => onScanRef.current(decodedText),
        () => {} // per-frame "no QR found this frame" — not an error, ignore
      )
      .then(() => {
        started = true;
      })
      .catch(() => {
        setError('Camera access is needed to scan a QR code.');
      });

    return () => {
      if (!started) return;
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {
          // Already stopped/torn down (e.g. unmounted mid-permission-prompt)
          // — nothing meaningful to recover from here.
        });
    };
  }, [elementId]);

  if (error) {
    return <p className="text-center text-sm text-danger">{error}</p>;
  }

  return <div id={elementId} className="w-full overflow-hidden rounded-xl" />;
}
