import { Suspense, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Table from './components/Table'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-2xl font-bold  italic text-center shadow-lg p-3 tracking-widest'>Daily Run rate Calc by Manish Panda for Hunt Digital Media</h1>


      <Table />

    
    

    
    </>
  )
}

export default App
