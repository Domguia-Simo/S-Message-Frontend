import './styles.css'
import './fontawesome/css/all.css'
import React,{useState,useEffect} from 'react'
const socketClient = require('socket.io-client')
const  io = socketClient.io
//Socket connection with the server
let socket = new io('http://localhost:5000')

// let sender = "peter@gmail.com"
// let receiver = "paul@gmail.com"



const App = () => {

  const [oldMssages ,setOldMessages] = useState([])
  const [message ,setMessage] = useState('')
  const [allUser ,setAllUser] = useState([])
  const [receiver ,setReceiver] = useState(false)
  const [sender ,setSender] = useState(false)
  const [selected ,setSelected] = useState(false)
  const [notification ,setNotification] = useState(false)
  const [typing ,setTyping] = useState(false)

  //Fetching informations of the selected user
useEffect(()=>{
  let nsender
  if(sender){
  nsender = sender.toLowerCase()+'@gmail.com'

  fetch(`http://localhost:5000/getUser/${nsender}`,{
    method:"GET"
  })
  .then(res => res.json())
  .then(data => {
    if(data[0].notification == 'false'){setNotification(false)}
    else{setNotification(true)}
    console.log(data)
  })
  .catch(err => console.log(err))
}
},[sender])

  //Fetching all The users
  useEffect(()=>{
    fetch('http://localhost:5000/getAllUsers',{
      method:"GET"
    })
    .then(res => res.json())
    .then(data => {
      setAllUser(data)
    })
    .catch(err => console.log(err))
  },[0])

  //Fetching for all messages
  useEffect(()=>{
 let nsender
 let nreceiver
 if(sender && receiver){
    nsender = sender.toLowerCase()+'@gmail.com'
    nreceiver = receiver.toLowerCase()+'@gmail.com'
 

    fetch(`http://localhost:5000/getOldMessages/${nsender}/${nreceiver}`,{
      method:"GET",
      headers:{
        'Accept':'application/json',
        'Access-Control-Allow-Origin':'*',
        'Content-Type':'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data)
      setOldMessages(data)
    })
    .catch((err)=>console.log(err))
  }
  },[sender,receiver,oldMssages])


  socket.on('recieved-msg',(received)=>{
      // console.log("Recieved Message",received)
      setOldMessages(received)
  })

  //To verify if the receiver is typing
socket.on('typing',()=>{
  console.log("typing")
  let nsender
  // if(sender){
  //   nsender = sender.toLowerCase()+'@gmail.com'
  
  //   if(userEmail == nsender )
  //   setTyping(true)

  // }
})

  let time = new Date
  // time = time.getDay()+'/'+(time.getMonth()+1)+'/'+time.getFullYear()
  time = time.getHours()+':'+time.getMinutes()
  // console.log(time)
function sendMessage(e){
    e.preventDefault()
    let nsender = sender.toLowerCase()+'@gmail.com'
    let nreceiver = receiver.toLowerCase()+'@gmail.com'
    console.log(time)
    socket.emit('msg',{message,nsender,nreceiver,time})
    setMessage('')
  }

let displayMessage = oldMssages.map(row => {
  if(row.senderEmail == sender.toLowerCase()+'@gmail.com'){
    return (
      <>
    <div className="sender" key={row._id}>
        {row.message}
    <span style={{
      fontSize:"x-small",
      // position:'absolute',
      fontWeight:"lighter",
      marginTop:"20px"
    }}>{row.date}</span>
    </div>
    </>
    )
  }else{
    return(
    <div className="receiver" key={row._id}>
     {row.message}
     <span style={{
      fontSize:"x-small",
      // position:'absolute',
      fontWeight:"lighter",
      marginTop:"20px"
    }}>{row.date}</span>
    </div>
    )
  }
})
let displayUsers = allUser.map(row => {
  return(
      <div key={row._id}
      style={{
          backgroundColor:selected==row.name ? "rgba(50,200,100)":'',
          color:selected==row.name ? "white":''

      }}
       onClick={(e)=>{
         setSelected(row.name)
         setReceiver(row.name)
      }

      }>{row.name}</div>
  )
})
let selectUser = allUser.map(row => {
  return(
      <option key={row._id} >{row.name}</option>
  )
})
// console.log(sender,receiver)


return (
    <React.Fragment>
        <h1>
          S Message &nbsp;&nbsp;&nbsp;&nbsp;
          <select 
          style={{
            padding:"5px"
          }}
          value={sender} 
          onChange={(e)=>setSender(e.target.value)}
          >
            <option>Select A User</option>
          {selectUser}
          </select>&nbsp;&nbsp;&nbsp;
          <span className="far fa-bell" style={{color:"grey"}}></span>
          
          <i className={ notification ? "notif" : ''}></i>
        </h1>
   
    <center>
    <h2>
       {receiver && sender ? `Messaging with ${receiver} ${typing ? 'typing...' :''}` : 'Select a person to message with'}
    </h2>
    <div style={{
      display:"flex",
      width:"100%",
      // border:"solid 1px grey",
      justifyContent:"center"
    }}>
   
    <div className="users">
      {/* <h3>Users</h3> */}
        {displayUsers}
    </div>
    <div id="container" style={{
      width:"500px"
    }}
    >
      
          {displayMessage}
    </div>
    </div>

<br/>
        <form onSubmit={(e)=>sendMessage(e)}>
          <span className='far fa-smile'></span>&nbsp;&nbsp;
          <span className='far fa-file'></span>&nbsp;&nbsp;

          <input type="text" value={message} onChange={(e)=>{
    let nreceiver = receiver.toLowerCase()+'@gmail.com'
            socket.emit('sender-typing',nreceiver)
            setMessage(e.target.value)
            }} />&nbsp;&nbsp;
          <label htmlFor='send'><span className='fab fa-telegram'></span></label>
          <input type="submit" value="Send" id="send" style={{display:"none"}}/>
        </form>
        </center>

    </React.Fragment>
  );
}

export default App;
