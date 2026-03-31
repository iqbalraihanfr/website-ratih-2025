import { socialMedia } from "@/constants"

const SocialMedia = () => {
  return (
    <div className="flex flex-row gap-2" aria-label="Channel kontak Ratih Creative">
        {socialMedia.map((media) => (
          <a
            key={media.id} 
            href={media.href}
            className="text-xl hover:text-yellow-500 transition-all"
            aria-label={media.label}
            title={media.label}
          >
            <i className={media.logo} />
          </a>
      ))}
    </div>
  )
}

export default SocialMedia
