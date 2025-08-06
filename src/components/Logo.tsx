import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex justify-between items-center h-16">
      <Image
        src="/images/Logo-Light.png"
        alt="logo"
        width={150}
        height={300}
        className="block dark:hidden p-2"
      />

      <Image
        src="/images/Logo-Dark.png"
        alt="logo"
        width={150}
        height={300}
        className="hidden dark:block p-2"
      />
    </div>
  );
};

export default Logo;
