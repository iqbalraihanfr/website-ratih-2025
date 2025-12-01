import { socialMedia } from "@/constants"
import Link from "next/link"

const SocialMedia = () => {
  return (
    <div className="flex flex-row mt-2 gap-2">
        {socialMedia.map((media) => (
          <Link 
            key={media.id} 
            href={media.href}
            className="text-xl hover:text-yellow-500 transition-all"
          >
            <i className={media.logo} />
          </Link>
      ))}
    </div>
  )
}

export default SocialMedia