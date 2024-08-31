import QRCode from "qrcode";
import { useEffect, useState } from "react";
import Image from 'next/image';

const QRCodeComponent = ({ randomCode }: { randomCode: string }) => {
  const [qrSrc, setQRSrc] = useState<string>("");

  useEffect(() => {
    if (randomCode) {
      QRCode.toDataURL(randomCode).then(setQRSrc);
    }
  }, [randomCode]);

  return (
    <>
      <Image src={qrSrc} alt="qrCode" width={172} height={168} />
    </>
  );
};

export default QRCodeComponent;