'use client';

import { useMemo, useState } from 'react';
import QRCode from 'qrcode';

type CreateAccountRes = { accountId: string; recoveryCode: string };

type InviteRes = {
  inviteCode: string;
  expiresAt: string;
  qrPayload: { baseUrl: string; inviteCode: string };
};

export default function PairPage() {
  const [account, setAccount] = useState<CreateAccountRes | null>(null);
  const [invite, setInvite] = useState<InviteRes | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const dopamineBase = useMemo(
    () => (process.env.NEXT_PUBLIC_CLAWDOPAMINE_BASE_URL ?? 'http://localhost:8787'),
    []
  );

  async function createAccount() {
    setErr(null);
    setInvite(null);
    setQrDataUrl(null);

    const res = await fetch(`${dopamineBase}/v1/accounts/create`, { method: 'POST' });
    if (!res.ok) throw new Error(await res.text());
    const data = (await res.json()) as CreateAccountRes;
    setAccount(data);
  }

  async function createInvite() {
    if (!account) return;
    setErr(null);
    setInvite(null);
    setQrDataUrl(null);

    const res = await fetch(`${dopamineBase}/v1/pairing/invite`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ accountId: account.accountId, recoveryCode: account.recoveryCode, ttlSeconds: 300 })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = (await res.json()) as InviteRes;
    setInvite(data);

    const payload = JSON.stringify(data.qrPayload);
    const url = await QRCode.toDataURL(payload, { margin: 1, width: 280 });
    setQrDataUrl(url);
  }

  return (
    <main>
      <h1>QR Pairing (claw-dopamine)</h1>
      <p>This creates an account + a short-lived invite you can scan on another machine.</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button onClick={() => createAccount().catch((e) => setErr(String(e)))}>
          1) Create account
        </button>
        <button disabled={!account} onClick={() => createInvite().catch((e) => setErr(String(e)))}>
          2) Create QR invite
        </button>
      </div>

      {err ? (
        <pre style={{ background: '#fee', padding: 12, marginTop: 12, whiteSpace: 'pre-wrap' }}>{err}</pre>
      ) : null}

      {account ? (
        <div style={{ marginTop: 16 }}>
          <div>
            <b>accountId:</b> <code>{account.accountId}</code>
          </div>
          <div>
            <b>recoveryCode:</b> <code>{account.recoveryCode}</code> (store this somewhere safe)
          </div>
        </div>
      ) : null}

      {invite ? (
        <div style={{ marginTop: 16 }}>
          <div>
            <b>inviteCode:</b> <code>{invite.inviteCode}</code>
          </div>
          <div>
            <b>expiresAt:</b> <code>{invite.expiresAt}</code>
          </div>
          <div style={{ marginTop: 12 }}>
            {qrDataUrl ? <img src={qrDataUrl} alt="pairing qr" /> : null}
          </div>
          <details style={{ marginTop: 12 }}>
            <summary>QR payload JSON</summary>
            <pre style={{ background: '#f6f6f6', padding: 12, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(invite.qrPayload, null, 2)}
            </pre>
          </details>
        </div>
      ) : null}

      <hr style={{ margin: '24px 0' }} />
      <p>
        Next step on the new machine: generate a device keypair and call <code>POST /v1/devices/claim</code> with the
        inviteCode + publicKey.
      </p>
    </main>
  );
}
