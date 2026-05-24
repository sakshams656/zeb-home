import Image from "next/image";

export function Logo() {
  return (
    <Image src="/ZebLogo.png" alt="ZebPay" width={180} height={80}  priority />
  );
}
