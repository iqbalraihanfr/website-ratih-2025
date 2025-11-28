import { socialMedia } from "@/constants"
import Link from "next/link"

const SocialMedia = () => {
  return (
    <div className="flex flex-row mt-2 gap-3">
        {socialMedia.map((media) => (
          <Link 
            key={media.id} 
            href={media.href}
            className="text-lg hover:text-yellow-500 transition-all"
          >
            <i className={media.logo} />
          </Link>
      ))}
    </div>
  )
}

export default SocialMedia