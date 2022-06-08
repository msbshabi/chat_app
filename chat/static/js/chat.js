let url = window.location;
let wsStart = url.protocol === "https" ? "wss://" : "ws://";
let endpoint = wsStart + url.host + url.pathname;
var socket = new WebSocket(endpoint);

let message_input = $("#message-input");
let chat_body = $("#chat-body");
let send_message_form = $("#send-message-form");

const SEND_BY_USER = $("#send-by-user").val();
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
            send_by: SEND_BY_USER,
        });

        // console.log(data);
        socket.send(data);
    });
};

socket.onmessage = async function (e) {
    console.log("Message Recieved", e);
    let data = JSON.parse(e.data);
    let message = data["message"];
    let send_by = data["send_by"];
    // console.log(data);
    newMessage(message, send_by);
};

socket.onerror = async function (e) {
    console.log("Error Occured", e);
};

socket.onclose = async function (e) {
    console.log("WebSocket Closed", e);
};

function newMessage(message, send_by_id) {
    if ($.trim(message) === "") {
        return false;
    }

    let message_element;

    if (send_by_id == SEND_BY_USER) {
        message_element = `<li class="right">
            <div class="conversation-list">
                <div class="chat-avatar">
                    <img src="img/avatar-1.jpg" alt="" />
                </div>

                <div class="user-chat-content">
                    <div class="ctext-wrap">
                        <div class="ctext-wrap-content">
                            <p class="mb-0">${message}</p>
                            <p class="chat-time mb-0">
                                <i class="ri-time-line align-middle"></i>
                                <span class="align-middle">10:02</span>
                            </p>
                        </div>

                        <div class="dropdown align-self-start">
                            <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="ri-more-2-fill"></i>
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

                    <div class="conversation-name">You</div>
                </div>
            </div>
        </li>`;
    } else {
        message_element = `<li>
            <div class="conversation-list">
                <div class="chat-avatar">
                    <img src="img/avatar-4.jpg" alt="" />
                </div>

                <div class="user-chat-content">
                    <div class="ctext-wrap">
                        <div class="ctext-wrap-content">
                            <p class="mb-0">${message}</p>
                            <p class="chat-time mb-0">
                                <i class="ri-time-line align-middle"></i>
                                <span class="align-middle">10:00</span>
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
                    <div class="conversation-name">Doris Brown</div>
                </div>
            </div>
        </li>`;
    }

    chat_body.append($(message_element));

    scrollToChatBottom();

    message_input.val(null);
}

function scrollToChatBottom() {
    $("#chat-container")
        .stop()
        .animate({ scrollTop: $("#chat-container")[0].scrollHeight }, 2000);
}
