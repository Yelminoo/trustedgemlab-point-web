import { Spinner } from '@/components/shared/ui';

// Shown by every auth-gated page while useAuthGate() is still confirming
// the session (or about to redirect an unauthenticated visitor to /) — a
// brief, deliberately quiet placeholder rather than a layout-shifting empty
// div, since this can be visible for a beat on a slow connection.
export function GateLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner className="size-6 text-text-secondary" />
    </div>
  );
}
