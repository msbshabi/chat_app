let url = window.location;
let wsStart = url.protocol === "https" ? "wss://" : "ws://";
let endpoint = wsStart + url.host + url.pathname;
var socket = new WebSocket(endpoint);

let messageInput = $("#message-input");
let sendMessageForm = $("#send-message-form");
let userProfile = $("#user-profile");

const SEND_BY_USER = $("#send-by-user").val();

$(document).ready(function () {
    let liElement = $(".chat-user-list li.active");
    let chatId = liElement.attr("chat-id");
    const chatBox = document.getElementById(`chat-container-${chatId}`);
    chatBox.scrollTop = chatBox.scrollHeight;

    setUserProfile(liElement);
});

socket.onopen = async function (e) {
    console.log("WebSocket open", e);

    sendMessageForm.on("submit", function (e) {
        let chatId = $(".chat-user-list li.active").attr("chat-id");
        e.preventDefault();
        let message = messageInput.val();
        let sendToUser = $("#send-to-user").val();

        let data = JSON.stringify({
            message: message,
            send_to: sendToUser,
            send_by: SEND_BY_USER,
            chat_id: chatId,
        });

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
    let message = data["message"];
    let sendBy = data["send_by"];
    let chatId = data["chat_id"];

    if ($.trim(message) === "") {
        return false;
    }

    let messageElement =
        sendBy["user_id"] == SEND_BY_USER
            ? getChatElement(message, sendBy)
            : getChatElement(message, sendBy, false);

    // let chatBody = $(`#chat-body${chatId}`);
    $(`#chat-body-${chatId}`).append($(messageElement));
    scrollToChatBottom(chatId);
    messageInput.val(null);
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

function scrollToChatBottom(chatId) {
    $(`#chat-container-${chatId}`)
        .stop()
        .animate(
            { scrollTop: $(`#chat-container-${chatId}`)[0].scrollHeight },
            2000
        );
}

$(".chat-user-list li").click(function () {
    // console.log("clicked chat");
    $(".user-chat").addClass("user-chat-show");

    $(".chat-user-list li").removeClass("active");
    $(this).addClass("active");

    let chatId = $(this).attr("chat-id");
    let chatUserId = $(this).attr("user-id");

    $(".chat-window").addClass("d-none");
    $(`#chat-${chatId}`).removeClass("d-none");
    $("#send-to-user").val(chatUserId);

    setUserProfile($(this));
});

function setUserProfile(liElement) {
    userProfile.addClass("d-none");

    let userName = liElement.attr("user-name");
    let userAvatar = liElement.attr("user-avatar");
    let userBio = liElement.attr("user-bio");

    $(".user-profile-name").text(userName);
    $(".user-profile-avatar").attr("src", userAvatar);
    $(".user-profile-bio").text(userBio);
}

$("#user-profile-hide").click(function () {
    userProfile.addClass("d-none");
});

$(".user-profile-show").click(function () {
    userProfile.removeClass("d-none");
});
