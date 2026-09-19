import { Button } from '@/components/shared/ui';
import { useInstallPrompt } from '@/lib/use-install-prompt';

export function InstallPromptButton() {
  const { canPrompt, installed, promptInstall } = useInstallPrompt();

  if (installed) {
    return <p className="text-sm font-medium text-primary">✓ Installed — look for Trusted Gemlab on your home screen.</p>;
  }

  if (!canPrompt) return null; // no native prompt available — the manual steps below cover this browser

  return <Button onClick={() => promptInstall()}>Install Trusted Gemlab</Button>;
}
