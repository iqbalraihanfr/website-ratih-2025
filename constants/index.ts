import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"

export const headerData = [
    { id: "1", title: "About", href: "/about"},
    { id: "2", title: "Portfolio", href: "/portfolio"},
    { id: "3", title: "Logo", href: "/", isLogo: true, logoURL: "/images/logo-ratih.svg", altText:"Logo Ratih"},
    { id: "4", title: "Contact", href: "/contact"},
    { id: "5", title: "Blog", href: "/blog"}
]

export const footerData = [
    { id: "1", title: "About", href: "/about"},
    { id: "2", title: "Portfolio", href: "/portfolio"},
    { id: "3", title: "Contact", href: "/contact"},
    { id: "4", title: "Blog", href: "/blog"}
]

export const socialMedia = [
    {id: "1", logo: "ri-instagram-line", href: "/"},
    {id: "2", logo: "ri-facebook-fill", href: "/"},
    {id: "3", logo: "ri-whatsapp-line", href: "/"},
    {id: "4", logo: "ri-twitter-x-fill", href: "/"},
    {id: "5", logo: "ri-linkedin-box-fill", href: "/"},
]

export const ratihCrew = [
    {id: "1", name: "Afrizal Ahmad", role: "Graphic Designer", imgURL: "/images/crew/rijal-bg.png", altIMG: "Foto Rijal", desc: ""},
    {id: "2", name: "Andra Ariloka", role: "Content Writer", imgURL: "/images/crew/ndar-bg.png", altIMG: "Foto Andra", desc: ""},
    {id: "4", name: "Favian Rifqi", role: "Photographer", imgURL: "/images/crew/yan-bg.png", altIMG: "Foto Pap", desc: ""},
    {id: "6", name: "Valentinus Nathanael", role: "Videographer", imgURL: "/images/crew/nathann-bg.png", altIMG: "Foto Nathan", desc: ""},
    {id: "3", name: "Jiersa Hilal", role: "Video Editor", imgURL: "/images/crew/sastra-bg.png", altIMG: "Foto Jiersa", desc: ""},
    {id: "5", name: "Afif Satrio", role: "Web Developer", imgURL: "/images/crew/pipp-bg.png", altIMG: "Foto Apip", desc: ""},
    {id: "7", name: "Iqbal Raihan", role: "Web Developer", imgURL: "/images/crew/raihaan-bg.png", altIMG: "Foto Iqbal", desc: ""}
]

export const portfolio = [
    {id: "1", title: "Gebyar Festival Dongkrek", imgURL: "/images/portfolio/festival-dongkrek.png", category: "photography"},
    {id: "2", title: "Kirab Budaya Mejayan", imgURL: "/images/portfolio/kirab-budaya-mejayan.png", category: "photography"},
    {id: "3", title: "Pahlawan Car Free Night", imgURL: "/images/portfolio/pahlawan-cfn.png", category: "photography"},
    {id: "4", title: "Promosi UMKM", imgURL: "/images/portfolio/promosi-umkm.png", category: "photography"}
]

export const services = [
    {id: "1st", serviceTitle: "Fotografi", serviceDesc: "Layanan fotografi yang fokus pada visual yang kuat, detail yang rapi, dan mood yang sesuai karakter brand. Cocok untuk kebutuhan produk, campaign, company profile, hingga dokumentasi event sampai acara penting seperti wisuda dan acara pernikahan dengan tampilan yang lebih estetik, rapi dan  tetap standout.", serviceIMG: "/images/services/fotografi.png", altIMG: "Layanan Fotografi"},
    {id: "2nd", serviceTitle: "Videografi", serviceDesc: "Produksi video dengan pendekatan visual yang cinematic dan storytelling yang relevan. Mulai dari video branding, company video, creative video, hingga short cinematic clip. Semuanya dirancang untuk ningkatin persepsi dan daya tarik brand di mata audiens.", serviceIMG: "/images/services/videografi.png", altIMG: "Layanan Videografi"},
    {id: "3rd", serviceTitle: "Branding & Visual Identity", serviceDesc: "Ngebangun identitas brand dari dasar lewat logo, warna, tipografi, dan brand guideline yang terstruktur. Fokus kami adalah menciptakan identitas yang jelas, terstruktur, dan punya karakter yang kuat tapi mudah diingat, sehingga brand kalian tampil lebih baik dan profesional.", serviceIMG: "/images/services/branding.png", altIMG: "Layanan Branding"},
    {id: "4th", serviceTitle: "Graphic Design", serviceDesc: "Desain visual untuk kebutuhan brand seperti poster, banner, feed, layout, dan kebutuhan promosi lainnya. Setiap desain dibuat dengan gaya modern dan komposisi yang bersih, biar pesan brand tersampaikan dengan kuat dan estetik.", serviceIMG: "/images/services/branding.png", altIMG: "Layanan Branding"},
    {id: "5th", serviceTitle: "Short Movie Production", serviceDesc: "Produksi short movie dengan kualitas visual yang cinematic dan konsep cerita yang matang. Cocok untuk karya kreatif, campaign story, maupun konten yang butuh pendekatan storytelling yang lebih dalam dan emosional.", serviceIMG: "/images/services/branding.png", altIMG: "Layanan Branding"}
]

export const blog = [
    {id: "", blogTitle: "", blogIMG: "", blogAltIMG: "", blogContent: "", blogAuthor: "", dateTime: ""},
]