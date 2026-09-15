import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

// Wraps html5-qrcode's self-rendering scanner UI (camera picker, scan
// region, and a "scan an image file" fallback for devices without a camera
// or in restrictive browser contexts). onScan is kept in a ref so the
// camera isn't torn down and reinitialized on every parent re-render — only
// `elementId` unmounting/changing does that.
export function QrScanner({ elementId, onScan }: { elementId: string; onScan: (text: string) => void }) {
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(elementId, { fps: 10, qrbox: 250 }, false);
    scanner.render(
      (decodedText) => onScanRef.current(decodedText),
      () => {} // per-frame "no QR found this frame" — not an error, ignore
    );
    return () => {
      scanner.clear().catch(() => {
        // clear() rejects if the scanner never fully started (e.g. unmounted
        // mid-permission-prompt) — nothing meaningful to recover from here.
      });
    };
  }, [elementId]);

  return <div id={elementId} className="w-full overflow-hidden rounded-xl [&_button]:rounded-lg [&_button]:!bg-primary" />;
}
