const socket = io()

//utils function
const getTime = ()=>{
    const date = new Date()
    let str = date.getHours().toString()
    str+=":"
    str+=date.getMinutes().toString()
    return str
}

//elements
const $messageForm = document.querySelector("#message-form")
const $messageContainer = document.querySelector(".message-container")
const $locationButton = document.querySelector("#location")
const $userContainer = document.querySelector(".user-container")

socket.on("message",(messageObj)=>{
    let html = $messageContainer.innerHTML
    if(messageObj.position==="left"){
        html += `
            <div class="messages ${messageObj.position}">
                <p class="time-name">
                    <span class="name">${messageObj.username}</span>
                    <span class="time">${getTime()}</span>
                </p>
                <p>${messageObj.message}</p>
            </div>
        `
    }
    else    //for center message no need of username and time
    {
        html+= `
            <div class="messages ${messageObj.position}">
                <p>${messageObj.message}</p>
            </div>
        `
    }
    $messageContainer.innerHTML=html
})

socket.on("locationMessage",(messageObj)=>{
    let html = $messageContainer.innerHTML
    html+=`
        <div class="messages left">
            <p class="time-name">
                <span class="name">${messageObj.username}</span>
                <span class="time">${getTime()}</span>
            </p>
            <a href="${messageObj.message}" target="_blank">My current location</a>
        </div>
    `
    $messageContainer.innerHTML=html
})

socket.on("roomData",({users,room})=>{
    document.querySelector(".room-name").innerText = room
    let html = ""
    users.forEach((user)=>{
        html += `<div>${user.username}</div>`
    })
    $userContainer.innerHTML = html
})

//getting username and room name
let query = location.search     
query=query.substring(1)    //now remove ? at 0th index
let arr = query.split("&")  //separate by & sign
let obj={}  //store queries in obj
arr.forEach((item)=>{
    obj[item.split("=")[0]]=item.split("=")[1]
})

//send warning if username and room is not in query
if(obj["username"]===undefined || obj["room"]===undefined)  
{
    alert("Please enter username and room name")
    location.href="/"
}
//now emit username and room 
socket.emit("join",{username:obj["username"],room:obj["room"]},(error)=>{
    if(error)
    {
        alert(error)
        location.href="/"
    }
})

$messageForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    const message = document.getElementById("message").value
    let html = $messageContainer.innerHTML
    html += `
        <div class="messages right">
            <p class="time-name">
                <span class="name">You</span>
                <span class="time">${getTime()}</span>
            </p>
            <p>${message}</p>
        </div>
    `
    $messageContainer.innerHTML=html
    
    socket.emit("sendMessage",message)
    document.getElementById("message").value = ""
})

$locationButton.addEventListener("click",()=>{
    if(!navigator.geolocation)
    {
        return alert("geolocation is not supported by your system")
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        const location = {
            latitude :position.coords.latitude,
            longitude: position.coords.longitude
        }
        let html = $messageContainer.innerHTML
        html+=`
            <div class="messages right">
                <p class="time-name">
                    <span class="name">You</span>
                    <span class="time">${getTime()}</span>
                </p>
                <a href="https://google.com/maps?q=${location.latitude},${location.longitude}" target="_blank">My current location</a>
            </div>   `
        $messageContainer.innerHTML=html
        socket.emit("sendLocation",location)
    })
})