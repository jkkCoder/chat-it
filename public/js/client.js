const socket = io()

//elements
const $messageForm = document.querySelector("#message-form")
const $messageContainer = document.querySelector(".message-container")
const $locationButton = document.querySelector("#location")

socket.on("message",(messageObj)=>{
    let html = $messageContainer.innerHTML
    html += `
        <div class="messages ${messageObj.position}">
            <p>${messageObj.message}</p>
        </div>
    `
    $messageContainer.innerHTML=html
})

socket.on("locationMessage",(text)=>{
    let html = $messageContainer.innerHTML
    html+=`
        <div class="message left">
            <a href="${text}" target="_blank">My current location</a>
        </div>
    `
    $messageContainer.innerHTML=html
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

$messageForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    const message = document.getElementById("message").value
    let html = $messageContainer.innerHTML
    html += `
        <div class="messages right">
            <p>${message}</p>
        </div>
    `
    $messageContainer.innerHTML=html
    
    socket.emit("sendMessage",{
        message:message,
        position:"right"
    })
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
            <div class="message right">
                <a href="https://google.com/maps?q=${location.latitude},${location.longitude}" target="_blank">My current location</a>
            </div>   `
        $messageContainer.innerHTML=html
        socket.emit("sendLocation",location)
    })
})