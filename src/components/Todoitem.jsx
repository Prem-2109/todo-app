import React from 'react'
import tick from '../assets/images/tick.png';
import nontick from '../assets/images/not_tick.png';
import delete_icon from '../assets/images/delete.png';
const Todoitem = ({text, id, isComplete, deletetodo, toggle}) => {
  return (
    <div className='flex items-center my-3 gap-2'>
      <div onClick={()=>{toggle(id)}} className='flex flex-1 items-center cursor-pointer'>
        <img  src={isComplete ? tick : nontick} alt='' className='w-7'/>
        <p className={`text-slate-700 ml-4 text[17px] decoration-slate-500 ${isComplete ? "line-through" : ""}`}>{text}</p>
      </div>

      <img onClick={()=>{deletetodo(id)}} src={delete_icon} className='w-3.5 cursor-pointer'/>
    </div>
  )
}

export default Todoitem
