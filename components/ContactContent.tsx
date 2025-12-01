import SocialMedia from "./SocialMedia"

const ContactContent = () => {
  return (
    <div className="container mx-auto pb-10 mt-20 transition-all">
      <div className="flex flex-col lg:flex-row gap-4 lg:mx-20 mx-10">

        {/* Hubungi Kami */}
        <div className="md:w-1/3 w-full mb-10">
          <h1 className="font-bold uppercase text-2xl italic">Hubungi Kami</h1>
          <div className="mt-10 flex flex-col gap-10 mb-10">  
            <span className="font-bold uppercase italic text-lg">Email
              <p className="font-light lowercase text-lg not-italic">Loremipsum@gmail.com.</p>
            </span>
            <span className="font-bold uppercase italic text-lg">WhatsApp
              <p className="font-light lowercase text-lg not-italic">+62 856123456768</p>
            </span>
          </div>
          <h1 className="font-bold uppercase text-xl italic">Social Media Kami</h1>
          <SocialMedia />
        </div>

        {/* Form */}
        <form className="flex flex-col w-full gap-3 transition-all">
          <label htmlFor="name" className="font-semibold italic opacity-70">Nama Anda</label>
            <input type="text" className="bg-zinc-800 p-4 rounded-md" required/>
          <label htmlFor="email" className="font-semibold italic opacity-70">Email</label>
            <input type="text" className="bg-zinc-800 p-4 rounded-md" required/>
          <label htmlFor="message" className="font-semibold italic opacity-70" >Pesan</label>
          <textarea 
            cols={30}
            rows={5}
            className="bg-zinc-800 p-4 rounded-md">
          </textarea>
          <button className="w-fit bg-zinc-800 px-6 py-2.5 rounded-md mt-4 hover:bg-zinc-600 transition-all cursor-pointer">
            <span className="text-sm font-semibold">Kirim Pesan</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactContent