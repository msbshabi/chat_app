import json
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from chat.models import Thread
from chat.models import ChatMessage

User = get_user_model()


class ChatConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        print("########## Connected ..", event)

        send_by_user = self.scope['user']

        send_by_chat_room = f'user_chat_room_{send_by_user.id}'
        self.send_by_chat_room = send_by_chat_room

        await self.channel_layer.group_add(
            send_by_chat_room,
            self.channel_name
        )

        await self.send({
            'type': 'websocket.accept'
        })

    async def websocket_receive(self, event):
        print("########## Recieved ..", event)

        received_data = json.loads(event['text'])
        message = received_data.get('message')
        send_to_id = received_data.get('send_to')
        send_by_id = received_data.get('send_by')
        thread_id = received_data.get('chat_id')

        if (not message) or (not send_to_id) or (not send_by_id):
            print("########## Error:: Invalid arguments")
            return False

        # send_by_user = self.scope['user']
        send_by_user = await self.get_user_object(self.scope['user'].id)

        # print("#################### ..", send_by_id,  send_by_user.id, (send_by_id == send_by_user.id), (send_by_id != send_by_user.id), not (send_by_id == send_by_user.id))

        # if (not (send_by_id == send_by_user.id)):
        #     print("########## Error:: Send by user not found!")
        #     return False

        send_to_user = await self.get_user_object(send_to_id)

        if (not send_to_user):
            print("########## Error:: Send to user not found!")
            return False

        thread = await self.get_thread_object(thread_id)

        if (not send_to_user):
            print("########## Error:: Invalid chat id!")
            return False

        await self.create_chat_message(thread, send_by_user, message)

        send_to_chat_room = f'user_chat_room_{send_to_id}'

        response = {
            'message': message,
            'chat_id': thread_id,
            'send_by': {'user_id': send_by_user.id, 'name': send_by_user.profile.full_name, 'avatar': send_by_user.profile.avatar_url}
        }

        await self.channel_layer.group_send(
            self.send_by_chat_room,
            {
                'type': 'chat_message',
                'text': json.dumps(response)
            }
        )

        await self.channel_layer.group_send(
            send_to_chat_room,
            {
                'type': 'chat_message',
                'text': json.dumps(response)
            }
        )

    async def chat_message(self, event):
        print("########## Chat message ..", event)

        await self.send({
            'type': 'websocket.send',
            'text': event['text']
        })

    async def websocket_disconnect(self, event):
        print("########## Disconnected ..", event)

    @database_sync_to_async
    def get_user_object(self, user_id):
        qs = User.objects.prefetch_related('profile').filter(id=user_id)
        if qs.exists():
            obj = qs.first()
        else:
            obj = None
        return obj

    @database_sync_to_async
    def get_thread_object(self, thread_id):
        qs = Thread.objects.filter(id=thread_id)
        if qs.exists():
            obj = qs.first()
        else:
            obj = None
        return obj

    @database_sync_to_async
    def create_chat_message(self, thread, user, message):
        ChatMessage.objects.create(thread=thread, user=user, message=message)
