import { storageUrl } from "@/lib/storage";

const BlogHead = () => {
  return (
    <div
      className="bg-no-repeat bg-cover bg-center py-10 px-10 h-[50vh] flex flex-col items-center justify-center text-white transition-all"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url('${storageUrl("bg/bg-2.webp")}')`,
      }}
    >
      <p className="text-sm font-medium uppercase pt-10">
            Tambah Wawasanmu Bersama
      </p>
      <h1 className="text-4xl lg:text-5xl font-bold italic">BERITA RATIH</h1>
    </div>
  )
}

export default BlogHead
