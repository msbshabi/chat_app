from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from chat.models import Thread

# from chats.models import Thread

User = get_user_model()


@login_required
def index(request):

    # print("################", request.user.profile.full_name)

    threads = Thread.objects.by_user(user=request.user).prefetch_related('chatmessage_thread')
    chat_users = User.objects.all().exclude(id=request.user.id)

    context = {
        'Threads' : threads,
        'ChatUsers': chat_users
    }

    return render(request, 'chat.html', context)
