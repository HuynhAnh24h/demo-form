import React, { useState } from 'react'
import SurvayForm from './components/common/SurvayForm'
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from 'react-toastify'
import Header from './components/common/Header'
const App = () => {
  const [go,setGo] = useState(false)
  return (
    <div className='flex justify-center items-center min-h-screen'>
      {
        go ? <SurvayForm/> : <Header go={go} setGo={setGo}/>
      }
      <ToastContainer/>
    </div>
  )
}

export default App