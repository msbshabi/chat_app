from django.contrib.auth.decorators import login_required
from django.shortcuts import render
# from chats.models import Thread

@login_required
def index(request):

    # threads = Thread.objects.by_user(user=request.user).prefetch_related('chatmessage_thread')

    context = {
        # 'Threads' : threads
    }

    return render(request, 'chat.html', context)