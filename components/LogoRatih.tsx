import Image from 'next/image'

const LogoRatih = () => {
  return (
    <div className='mx-10 lg:flex lg:flex-row flex flex-col items-center'>
        <Image 
            src={'/images/logo-ratih.svg'} 
            alt={'Logo Ratih'}
            width={250}
            height={40}
            className='scale-80 lg:scale-100'
        >
        </Image>
    </div>
  )
}

export default LogoRatih