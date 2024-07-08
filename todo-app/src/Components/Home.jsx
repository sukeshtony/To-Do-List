import React, { useEffect, useState } from 'react'
import "../Styles/Home.css"
import { AiOutlineDelete } from 'react-icons/ai'
import { BsCheckLg } from 'react-icons/bs'
import axios from 'axios'
const Home = () => {
    const [isCompleteScreen,setIsCompleteScreen]=useState(false)
    const [allTodos,setTodos]=useState([])
    const [newTitle,setNewTitle]=useState("")
    const [newDescription,setNewDescription]=useState("")
    const [refresh,setRefresh]=useState(false)
    const [completedTodos,setCompletedTodos]=useState([])
    useEffect(()=>{
        axios.get("http://localhost:5000/element")
        .then((res)=>{
            setTodos(res.data)
            setRefresh(false)
        })
        axios.get("http://localhost:5000/element2")
        .then((res)=>{
            setCompletedTodos(res.data)
            setRefresh(false)
        })
    },[refresh])
    const handleAdd=(title)=>{

        if(title===""){

        }else{
            let newTodoItem={
                title:newTitle,
                description:newDescription
            }
            
            axios.post("http://localhost:5000/element",newTodoItem) 
            setRefresh(true)
            setNewTitle(""); // Clear input fields
            setNewDescription(""); 
        } 
    }

    const handleDelete=(index)=>{
        axios.delete(`http://localhost:5000/element/${index}`)
        setRefresh(true)
    }
    const handleCompleteDelete=(index)=>{
        axios.delete(`http://localhost:5000/element2/${index}`)
        setRefresh(true)
    }
    
    const handleComplete=(index,id)=>{
        let now=new Date;
        let dd=now.getDate();
        let mm=now.getMonth();
        let yyyy=now.getFullYear()
        let h=now.getHours()
        let m=now.getMinutes()
        let s=now.getSeconds()
        let completedOn=dd+"-"+mm+"-"+yyyy+" at "+h+":"+m+":"+s
        
        let filtereditem={
            ...allTodos[index],
            completedOn:completedOn
        }
        console.log(filtereditem.id);
        let payLoad={
           id:filtereditem.id,
           title:filtereditem.title,
           description:filtereditem.description,
           completedOn:filtereditem.completedOn
        }
        
        axios.post(`http://localhost:5000/element2`,payLoad)  
        handleDelete(id)
    }
  return (
    <div>
        <div className='todo-wrapper'>
            <div className='todo-input'>
                <div className='todo-input-item'>
                    <label htmlFor="">Title</label>
                    <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder='What is the task title' />

                </div>
                <div className='todo-input-item'>
                    <label htmlFor="">Description</label>
                    <input type="text" value={newDescription} onChange={(e)=>setNewDescription(e.target.value)} placeholder='What is the task description' />
                </div>
                <div className='todo-input-item'>
                    <button type='button' onClick={()=>handleAdd(newTitle)} className='primaryBtn'>Add</button>
                </div>
            </div>
            <div className='btn-area'>
                <button className= { `secondary-btn ${isCompleteScreen===false && 'active'}` }
                 onClick={()=>{setIsCompleteScreen(false)}}>Todo</button>
                <button className={`secondary-btn ${isCompleteScreen===true && 'active'}` }
                 onClick={()=>{setIsCompleteScreen(true)}}>Completed</button>
            </div>
            
               {isCompleteScreen===false && allTodos.map((item,index)=>{
                return(
                    <div className='todo-list' key={index}>
                    <div className='todo-list-item'>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                </div>
                <div key={index}>
                    <AiOutlineDelete onClick={()=>handleDelete(item.id)} className='icon'/>
                    <BsCheckLg onClick={()=>handleComplete(index,item.id)} className='check-icon'/>
                </div>
                </div>
                )

               })}
               {isCompleteScreen===true && completedTodos.map((item,index)=>{
                return(
                    <div className='todo-list' key={index}>
                    <div className='todo-list-item'>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed On :{item.completedOn}</small></p>
                </div>
                <div key={index}>
                    <AiOutlineDelete onClick={()=>handleCompleteDelete(item.id)} className='icon'/>
                    
                </div>
                </div>
                )

               })}
            
        </div>
    </div>
  )
}

export default Home