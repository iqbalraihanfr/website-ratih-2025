import Image from "next/image"
import { createServerClient } from "@/lib/supabase-server"
import { storageUrl } from "@/lib/storage"
import type { TeamMember } from "@/lib/types/database"

const RatihCrew = async () => {
  const supabase = createServerClient()
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true })

  const crew = (data as TeamMember[]) ?? []

  if (!crew.length) return null

  return (
    <section className="container mt-30 mb-10">
      <p className="md:text-sm text-xs text-center font-medium uppercase pt-10">Creative Team</p>
      <h2 className="text-center md:text-4xl text-2xl font-bold italic uppercase">Dibalik Layar Ratih</h2>
      {crew.map((member) => (
        <article className="lg:mx-20 mx-10 mt-10" key={member.id}>
          <div className="flex flex-col items-center lg:items-start mt-5">
            <span className="text-xs xl:text-sm font-semibold italic uppercase opacity-50 xl:text-left text-center">{member.role}</span>
            <h3 className="w-fit md:text-3xl text-2xl font-bold italic uppercase hover:text-yellow-500 transition-all xl:text-left text-center">{member.name}</h3>
          </div>
          <div className="lg:flex-row flex flex-col items-center lg:gap-10">
            {member.image_path && (
              <Image
                src={storageUrl(member.image_path)}
                alt={member.name}
                width={550}
                height={50}
                loading="lazy"
                className="rounded-md my-5"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
            <div className="flex flex-col items-center lg:items-start gap-0">
              <span className="text-justify text-base/relaxed font-normal opacity-70">
                {member.bio}
              </span>
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

export default RatihCrew
