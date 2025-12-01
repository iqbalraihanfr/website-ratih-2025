import ContactContent from "@/components/ContactContent"
import ContactHead from "@/components/ContactHead"

const page = () => {
  return (
    <div className='mx-auto bg-zinc-950'>
      <ContactHead />
      <ContactContent />
    </div>
  )
}

export default page