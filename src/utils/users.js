users = []

const addUser = (id,username,room)=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //check for existing user
    let existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    //validate the username
    if(existingUser)
    {
        return{
            error:"Username in use"
        }
    }

    user = {
        id,
        username,
        room
    }
    users.push(user)
    return {user:user}
}

const getUser = (id) =>{
    const user = users.find((user)=>{
        return id===user.id
    })
    return user
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index!==-1)
    {
        const removedUser = users[index]
        users.splice(index,1)
        return removedUser
    }
}

module.exports={
    addUser,
    getUser,
    removeUser
}