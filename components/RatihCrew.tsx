import { ratihCrew } from "@/constants"
import Image from "next/image"
import { storageUrl } from "@/lib/storage"

const RatihCrew = () => {
  return (
      <section className="container mt-30 mb-10">
          <p className="md:text-sm text-xs text-center font-medium uppercase pt-10">Creative Team</p>
          <h2 className="text-center md:text-4xl text-2xl font-bold italic uppercase">Dibalik Layar Ratih</h2>
          {ratihCrew.map((crew) => (
          <article className="lg:mx-20 mx-10 mt-10" key={crew.id}>
              <div className="flex flex-col items-center lg:items-start mt-5">
                  <span className="text-xs xl:text-sm font-semibold italic uppercase opacity-50 xl:text-left text-center">{crew.role}</span>
                  <h3 className="w-fit md:text-3xl text-2xl font-bold italic uppercase hover:text-yellow-500 transition-all xl:text-left text-center">{crew.name}</h3>
              </div>
              <div className="lg:flex-row flex flex-col items-center lg:gap-10">
                  <Image
                      src={storageUrl(crew.imgURL)}
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
                          {crew.desc}
                      </span>
                  </div>
              </div>
          </article>
          ))}
      </section>
  );
}

export default RatihCrew
