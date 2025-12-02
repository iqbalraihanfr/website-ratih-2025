import { ratihCrew } from "@/constants"
import Image from "next/image"
import SocialMedia from "./SocialMedia"

const RatihCrew = () => {
  return (
      <div className="container mt-30 mb-10">
          <h1 className="md:text-sm text-xs text-center font-medium uppercase pt-10">Creative Team</h1>
          <h1 className="text-center md:text-4xl text-2xl font-bold italic uppercase">Dibalik Layar Ratih</h1>
          {ratihCrew.map((crew) => (
          <div className="lg:mx-20 mx-10 mt-10" key={crew.id}>
              <div className="flex flex-col items-center lg:items-start mt-5">
                  <span className="text-xs xl:text-sm font-semibold italic uppercase opacity-50 xl:text-left text-center">{crew.role}</span>
                  <p className="w-fit md:text-3xl text-2xl font-bold italic uppercase hover:text-yellow-500 transition-all xl:text-left text-center">{crew.name}</p>
              </div>
              <div className="lg:flex-row flex flex-col items-center lg:gap-10">
                  <Image
                      src={crew.imgURL}
                      alt={crew.altIMG}
                      width={550}
                      height={50}
                      loading="lazy"
                      className="rounded-md my-5"
                      style={{
                          maxWidth: "100%",
                          height: "auto"
                      }} />
                  <div className="flex flex-col items-center lg:items-start gap-0">
                      <span className="text-justify text-base/relaxed font-normal opacity-70">
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur minima quasi atque earum ducimus eveniet facere cum error quam, ullam aliquam asperiores harum optio? Modi officia consequatur aspernatur, ab quam, nulla quod repellendus, harum inventore vel voluptas earum quas! Delectus cumque magnam qui omnis atque dolorem accusamus aliquam ab accusantium.
                      </span>
                      <SocialMedia />
                  </div>
              </div>
          </div>
          ))}
      </div>
  );
}

export default RatihCrew