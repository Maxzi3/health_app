"use client";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex justify-between items-center h-16">
        <Image
          src="/images/Logo-Light.png"
          alt="logo"
          width={150}
          height={300}
          className="block dark:hidden p-2"
          priority
        />
        <Image
          src="/images/Logo-Dark.png"
          alt="logo"
          width={150}
          height={300}
          className="hidden dark:block p-2"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
