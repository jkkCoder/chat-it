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