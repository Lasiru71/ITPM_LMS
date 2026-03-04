import { QRCodeCanvas } from "qrcode.react";

interface Props {
  token: string;
}

export default function QRDisplay({ token }: Props) {

  if (!token) return null;

  const qrUrl = `http://localhost:5173/scan?token=${token}`;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Scan this QR to mark attendance</h3>

      <QRCodeCanvas value={qrUrl} size={220} />

      <p>{qrUrl}</p>
    </div>
  );
}