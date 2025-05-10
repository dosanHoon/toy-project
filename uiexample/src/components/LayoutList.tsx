import Image from "next/image";
import Link from "next/link";

const MainCarousel = () => {
  const mainBanner = {
    title: "Limited-Time Free",
    description:
      "Get the latest limited-time free content. Available until May 20 at 9:59 AM ET",
    imageUrl: "/main.jpeg",
    href: "#",
  };

  const subBanners = [
    {
      title: "Stars and Galaxies",
      imageUrl: "/main.jpeg",
      href: "#",
    },
    {
      title: "Derelict Corridor Megapack",
      imageUrl: "/main.jpeg",
      href: "#",
    },
    {
      title: "Get Free Substance Packs",
      imageUrl: "/main.jpeg",
      href: "#",
    },
    {
      title: "Get Free Substance Packs",
      imageUrl: "/main.jpeg",
      href: "#",
    },
  ];

  return (
    <div className="flex gap-4 p-4 max-w-[760px]">
      <div className="flex-1 relative h-[440px] rounded-lg overflow-hidden bg-black">
        <Image
          src={mainBanner.imageUrl}
          alt={mainBanner.title}
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 p-6 flex flex-col justify-end space-y-4 text-white">
          <div className="uppercase text-sm font-semibold">
            Featured Content
          </div>
          <h2 className="text-4xl font-bold">{mainBanner.title}</h2>
          <p className="text-lg">{mainBanner.description}</p>
          <Link
            href={mainBanner.href}
            target="_blank"
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Explore now
          </Link>
        </div>
      </div>
      <div className="w-[25%] flex flex-col gap-4">
        {subBanners.map((banner, index) => (
          <Link
            key={index}
            href={banner.href}
            target="_blank"
            className="relative h-[100px] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-start gap-4 p-4 hover:bg-gray-700 transition"
          >
            <div className="w-1/3 h-full rounded-lg overflow-hidden">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center text-white">
              <div className="uppercase text-xs font-semibold">
                Featured Content
              </div>
              <div className="text-sm font-bold truncate">{banner.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainCarousel;
