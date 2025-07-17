import React from 'react'
import { Button } from '../ui/button'

const Header = ({go,setGo}) => {
  return (
    <div className='max-w-md mf:max-w-xl min-h-[500px] flex flex-col items-center justify-center shadow-sm gap-3 mx-3 px-3'>
        <h1 className='text-lg font-bold text-orange-400 text-center'>GIÚP CHANCHAN HIỂU BẠN HƠN NHÉ!</h1>
        <p className='text-sm text-[#60230D] font-medium bg-orange-50 rounded p-3 text-center'>Cảm ơn bạn đã dành thời gian chia sẻ cùng ChanChan! 
            Mỗi phản hồi của bạn giúp ChanChan mang đến những món ăn chất lượng hơn, 
            phục vụ tận tâm hơn và mang lại trải nghiệm ngày càng ấm áp, dễ thương hơn cho mọi người. 🧡
        </p>
        <Button 
         type="button" 
         onClick={() => setGo(!go)}
         className="bg-orange-500 hover:bg-amber-700 text-white mt-2">
            Tham gia khảo sát
        </Button>
    </div>
)
}

export default Header