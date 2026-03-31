const Client = () => {
    const slides = [
        {num: 1},
        {num: 2},
        {num: 3},
        {num: 4},
        {num: 5},
        {num: 6},
    ]

    const duplicateSlides = [...slides, ...slides];

  return (
    <div className="w-full relative overflow-hidden ">
        <div className="flex">
        {duplicateSlides.map((slide, index) => {
            return <div key={index} className="shrink-0" style={{width: `${100/slides.length}%`}}>
                <div className="flex items-center justify-center text-6xl">
                    {slide.num}
                </div>
            </div>
        })}
        </div>
    </div>
  )
}

export default Client
