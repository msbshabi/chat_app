let url = window.location;
let wsStart = url.protocol === "https" ? "wss://" : "ws://";
let endpoint = wsStart + url.host + url.pathname;
var socket = new WebSocket(endpoint);

let message_input = $("#message-input");
let chat_body = $("#chat-body");
let send_message_form = $("#send-message-form");

const USER_ID = $("#send-by-user").val();
const SEND_TO_USER = $("#send-to-user").val();

$(document).ready(function () {
    const chatBox = document.getElementById("chat-container");
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.onopen = async function (e) {
    console.log("WebSocket open", e);
    send_message_form.on("submit", function (e) {
        e.preventDefault();
        let message = message_input.val();
        let data = JSON.stringify({
            message: message,
            send_to: SEND_TO_USER,
            send_by: USER_ID,
        });

        // console.log(data);
        socket.send(data);
    });
};

socket.onmessage = async function (e) {
    console.log("Message Recieved", e);
    let data = JSON.parse(e.data);

    newMessage(data);
};

socket.onerror = async function (e) {
    console.log("Error Occured", e);
};

socket.onclose = async function (e) {
    console.log("WebSocket Closed", e);
};

function newMessage(data) {
    console.log(data);

    let message = data["message"];

    if ($.trim(message) === "") {
        return false;
    }

    let send_by = data["send_by"];
    let send_to = data["send_to"];

    // let message_element = getChatElement(
    //     message,
    //     send_by,
    //     send_to,
    //     send_by["user_id"] == USER_ID
    // );

    // console.log(send_by["user_id"] == USER_ID, send_by["user_id"], USER_ID);

    let message_element =
        send_by["user_id"] == USER_ID
            ? getChatElement(message, send_by)
            : getChatElement(message, send_by,false);

    chat_body.append($(message_element));
    scrollToChatBottom();
    message_input.val(null);
}

function getChatElement(message, user, rightElement = true) {
    let liClass = rightElement ? "right" : "";
    let userName = rightElement ? "You" : user["name"];
    let userAvatar = user["avatar"];
    let messageTime = "10:00 PM";

    return `<li class="${liClass}">
        <div class="conversation-list">
            <div class="chat-avatar">
                <img src="${userAvatar}" alt="" />
            </div>
            <div class="user-chat-content">
                <div class="ctext-wrap">
                    <div class="ctext-wrap-content">
                        <p class="mb-0">${message}</p>
                        <p class="chat-time mb-0">
                            <i class="ri-time-line align-middle"></i>
                            <span class="align-middle">${messageTime}</span>
                        </p>
                    </div>
                    <div class="dropdown align-self-start">
                        <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="ri-more-2-fill"></i>
                        </a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">
                                Copy
                                <i class="ri-file-copy-line float-end text-muted"></i>
                            </a>
                            <a class="dropdown-item" href="#">
                                Save
                                <i class="ri-save-line float-end text-muted"></i>
                            </a>
                            <a class="dropdown-item" href="#">
                                Forward
                                <i class="ri-chat-forward-line float-end text-muted"></i>
                            </a>
                            <a class="dropdown-item" href="#">
                                Delete
                                <i class="ri-delete-bin-line float-end text-muted"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="conversation-name">${userName}</div>
            </div>
        </div>
    </li>`;
}

function scrollToChatBottom() {
    $("#chat-container")
        .stop()
        .animate({ scrollTop: $("#chat-container")[0].scrollHeight }, 2000);
}
