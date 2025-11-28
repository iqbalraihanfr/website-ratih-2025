import Image from "next/image"

const FooterLogo = () => {
  return (
    <div className="flex flex-row gap-4 items-center">
        <Image 
        src={"/images/logo-ratih.svg"} 
        alt={"Logo Ratih"}
        width={50}
        height={50} 
        />
        <span className="text-lg font-bold italic uppercase">
        Ratih Creative
        </span>
    </div>
  )
}

export default FooterLogo