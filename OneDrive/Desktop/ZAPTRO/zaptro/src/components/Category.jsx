
import { useNavigate } from 'react-router-dom'
import { getData } from '../context/DataContext'

const Category = () => {
  // const { categoryOnlyData} = getData()
 const navigate = useNavigate()
 const {data} = getData()

 const getUniqueCategory = (data, property)=>{
    let newVal = data?.map((curElem)=>{
      return curElem[property]
    })
    newVal= [...new Set(newVal)]
    return newVal
  }



  const categoryOnlyData = getUniqueCategory(data, "category")

  
  return (
    <div className='bg-[#101829]'>
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 py-7 px-4 justify-items-center">
  {
    categoryOnlyData?.map((item, index)=>(
      <button onClick={()=>navigate(`/category/${item}`)}
        key={index}
        className="uppercase w-[190px] h-[40px] flex items-center justify-center text-center
        bg-gradient-to-r from-red-500 to-purple-500 text-white
        rounded-lg cursor-pointer text-base font-semibold
        hover:scale-105 transition"
      >
        {item}
      </button>
    ))
  }
</div>

    </div>
  )
}

export default Category