import { useState } from 'react';

import { broadcastNotification } from '@/lib/api/admin';
import { Button, Card, ErrorText, SuccessText, TextField } from '@/components/shared/ui';

export function NotifyView({ accessToken }: { accessToken: string | null }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!accessToken) return;
    setError('');
    setResult('');
    setSending(true);
    try {
      const res = await broadcastNotification(title.trim(), body.trim(), accessToken);
      setResult(res.sent > 0 ? `Sent to ${res.sent} device${res.sent === 1 ? '' : 's'}.` : 'No devices are registered for push yet.');
      setTitle('');
      setBody('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send notification');
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-text-secondary">
        Sends a push notification to every member (mobile app) who has notifications enabled — use this to announce a new feature or
        anything else worth telling everyone at once.
      </p>

      <TextField value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" maxLength={65} />
      <TextField value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message" />

      <ErrorText>{error}</ErrorText>
      <SuccessText>{result}</SuccessText>

      <Button onClick={handleSend} disabled={sending || !title.trim() || !body.trim()}>
        {sending ? 'Sending…' : 'Send to everyone'}
      </Button>
    </Card>
  );
}
