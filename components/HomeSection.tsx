import Image from "next/legacy/image"
import Link from "next/link"

const HomeSection = () => {
  return (
    <div className='pt-60 flex flex-col items-center'>
      <Link href={"/about"}>
        <Image
          src={"/images/logo-ratih-2.svg"}
          alt={"Logo Ratih"}
          width={80}
          height={0}
          className="mb-5 scale-85 md:scale-100 transition-all"
          >
        </Image>
      </Link>
      <h1 className="text-center md:text-6xl font-bold italic text-3xl transition-all">
        RATIH CREATIVE MEDIA
      </h1>
      <span className="md:text-base text-xs mt-3 font-semibold transition-all">
        A Digital Creative Agency Based On Madiun.
      </span>
    </div>
  )
}

export default HomeSection