import Image from "next/image"
import SocialMedia from "./SocialMedia"
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
          className="mb-5"
          >
        </Image>
      </Link>
      <h1 className="text-center text-6xl font-bold italic">
        RATIH CREATIVE MEDIA
      </h1>
      <span className="text-md mt-3 font-semibold">
        A Digital Creative Agency Based On Madiun.
      </span>
    </div>
  )
}

export default HomeSection