import { createServerSupabase } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"

const RatihCrew = async () => {
  const supabase = createServerSupabase();
  const { data: dbCrew, error } = await supabase
    .from("crew")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching crew from Supabase:", error);
  }

  const displayCrew = dbCrew || [];

  return (
      <div className="container mt-30 mb-10">
          <h1 className="md:text-sm text-xs text-center font-medium uppercase pt-10">Creative Team</h1>
          <h1 className="text-center md:text-4xl text-2xl font-bold italic uppercase">Dibalik Layar Ratih</h1>
          {displayCrew.map((crew) => (
          <div className="lg:mx-20 mx-10 mt-10" key={crew.id}>
              <div className="flex flex-col items-center lg:items-start mt-5">
                  <span className="text-xs xl:text-sm font-semibold italic uppercase opacity-50 xl:text-left text-center">{crew.role}</span>
                  <p className="w-fit md:text-3xl text-2xl font-bold italic uppercase hover:text-yellow-500 transition-all xl:text-left text-center">{crew.name}</p>
              </div>
              <div className="lg:flex-row flex flex-col items-center lg:gap-10">
                  <Image
                      src={crew.img_url}
                      alt={crew.alt_img || crew.name}
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
                          {crew.description || "Bio menyusul."}
                      </span>
                      
                      {/* Social Media Links */}
                      {(crew.instagram_url || crew.facebook_url || crew.whatsapp_url || crew.x_url || crew.linkedin_url) && (
                          <div className="flex flex-row gap-4 mt-5">
                              {crew.instagram_url && (
                                  <Link href={crew.instagram_url} target="_blank" rel="noopener noreferrer" className="text-xl hover:text-yellow-500 transition-all text-white/70">
                                      <i className="ri-instagram-line" />
                                  </Link>
                              )}
                              {crew.facebook_url && (
                                  <Link href={crew.facebook_url} target="_blank" rel="noopener noreferrer" className="text-xl hover:text-yellow-500 transition-all text-white/70">
                                      <i className="ri-facebook-fill" />
                                  </Link>
                              )}
                              {crew.whatsapp_url && (
                                  <Link href={crew.whatsapp_url} target="_blank" rel="noopener noreferrer" className="text-xl hover:text-yellow-500 transition-all text-white/70">
                                      <i className="ri-whatsapp-line" />
                                  </Link>
                              )}
                              {crew.x_url && (
                                  <Link href={crew.x_url} target="_blank" rel="noopener noreferrer" className="text-xl hover:text-yellow-500 transition-all text-white/70">
                                      <i className="ri-twitter-x-fill" />
                                  </Link>
                              )}
                              {crew.linkedin_url && (
                                  <Link href={crew.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xl hover:text-yellow-500 transition-all text-white/70">
                                      <i className="ri-linkedin-box-fill" />
                                  </Link>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>
          ))}
      </div>
  );
}

export default RatihCrew