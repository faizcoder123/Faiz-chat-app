const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix: true})//getting room user info from url in form of object

const autoscroll = () => {
  // //  New message element
  //   const $newMessage = $messages.lastElementChild
  //
  //   // Height of the new message
  //   const newMessageStyles = getComputedStyle($newMessage)
  //   const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  //   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
  //
  //   // Visible height
  //   const visibleHeight = $messages.offsetHeight
  //
  //   // Height of messages container
  //   const containerHeight = $messages.scrollHeight
  //
  //   // How far have I scrolled?
  //   const scrollOffset = $messages.scrollTop + visibleHeight
  //
  //   if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    //}
}

socket.on('message', (message) => {
    //console.log(message)
    const html = Mustache.render(messageTemplate, {// render template
      name:message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)// dynamic
    autoscroll()

})

socket.on('locationMessage', (message) => {
  //  console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
      username:message.username,
      url: message.url,
      createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()// not refresh

    $messageFormButton.setAttribute('disabled', 'disabled')//disable button

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')//re enable after sending\

        $messageFormInput.value = ''//clear
        
        $messageFormInput.focus()// cursor focus

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')//disable

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')//reenable
            console.log('Location shared!')
        })
    })
})


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'// goto home after error
    }
})
