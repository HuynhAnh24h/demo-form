import logo from "@/assets/logo.png"
const ThanhYou = () => {
  return (
    <div className='max-w-md mf:max-w-xl min-h-[500px] flex flex-col items-center justify-center shadow-sm gap-3 mx-3 px-3'>
     <div className="w-[150px] h-[150px]">
       <img src={logo} alt="Logo ChanChan" className="w-full h-full mb-4" />
     </div>
        <h1 className='text-lg font-bold text-orange-400 text-center'>CHANCHAN CẢM ƠN BẠN RẤT NHIỀU 🧡</h1>
    </div>
  )
}

export default ThanhYou