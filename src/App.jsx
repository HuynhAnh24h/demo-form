import React from 'react'
import SurvayForm from './components/common/SurvayForm'
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from 'react-toastify'
const App = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <SurvayForm/>
      <ToastContainer/>
    </div>
  )
}

export default App