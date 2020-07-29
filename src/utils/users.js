const users = []
//id is server id
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return  user.username === username && user.room === room // already same name exist
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'this Username is already in use plz choose some other name!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
  //  console.log(id)
    const index = users.findIndex((user) =>user.id == id)


    if (index !== -1) {

        return users.splice(index, 1)[0]// delete from array
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) =>{// check in users array
       user.room === room})
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
