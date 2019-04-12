import ChatMessage from './modules/ChatMessage.js';
const socket = io();

function logConnect({sID, currentusers}) { //{sID, message}
    console.log(sID, currentusers);
    vm.socketID = sID;
    vm.currentusers = currentusers;
}

function announcement({notifications}){
    vm.notifications.push(notifications);
}

function userDisconnect({disconnection}){
    vm.disconnections.push(disconnection);
}

function appendMessage(message) {
    vm.messages.push(message);
}



// creates Vue instances here
const vm = new Vue({

    data: {
        socketID: "",
        nickname: "",
        message: "",
        notification: "",
        notifications: [],
        disconnection: "", 
        disconnections: [],
        userconnect: "",
        typing: false,
        messages: []

    },



    watch: {
        message(write) {
            if(write){
                socket.emit('typing', this.nickname);
            }else{
                socket.emit('stoptyping');
            }
        }
      },



    created() {
        socket.on('typing', (name) => {
            this.typing = name || "Anonymous";
          });
          socket.on('stoptyping', () => {
            this.typing = false;
          });
        socket.on('userconnect', (currentusers) => {
            vm.userconnect = currentusers;
        });
    },

    mounted() {
        var changeTheme = document.querySelector('#theme');
        changeTheme.addEventListener('click', function () {
            document.querySelector("body").classList.toggle('themeChange');
        });
    },

    methods: {
        dispatchMessage() {
            // creates message events from the client side
            socket.emit('chat message', { content: this.message, name: this.nickname || "Anonymous"});

            // reset the message field here
            this.message = "";

        },
        isTyping() {
            socket.emit('typing', this.nickname);
        },
    },
    components: {
        newmessage: ChatMessage
    }
}).$mount(`#app`);

socket.on('connected', logConnect);

socket.on('joined', announcement);

socket.addEventListener('chat message', appendMessage);
// userdiscconnected option
socket.addEventListener('disconnect', userDisconnect); n