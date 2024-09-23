from django.shortcuts import render, get_object_or_404, redirect
from .models import Thread, Comment
from .forms import ThreadForm, CommentForm
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required


@login_required
def delete_thread(request, thread_id):
    """ Render delete confirmation page and handle thread deletion. """
    thread = get_object_or_404(Thread, id=thread_id)

    # Ensure only the thread owner can delete the thread
    if request.user != thread.created_by:
        return redirect('forum_home')

    if request.method == 'POST':
        thread.delete()
        return redirect('forum_home')

    return render(request, 'forum/delete_thread_confirmation.html', {'thread': thread})

@login_required(login_url='/accounts/login/')
def create_thread(request):
    if request.method == 'POST':
        form = ThreadForm(request.POST)
        if form.is_valid():
            thread = form.save(commit=False)
            thread.created_by = request.user
            thread.save()
            return redirect('forum_thread_detail', thread_id=thread.id)
    else:
        form = ThreadForm()

    return render(request, 'forum/create_thread.html', {'form': form})


@login_required
def create_comment(request, thread_id):
    thread = get_object_or_404(Thread, id=thread_id)
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.thread = thread
            comment.created_by = request.user
            comment.save()
            return redirect('forum_thread_detail', thread_id=thread.id)
    else:
        form = CommentForm()

    return render(request, 'forum/create_comment.html', {'form': form, 'thread': thread})

@login_required
def delete_thread(request, thread_id):
    thread = get_object_or_404(Thread, id=thread_id, created_by=request.user)
    thread.delete()
    return redirect('forum_home')

@login_required
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id, created_by=request.user)
    comment.is_deleted = True
    comment.save()
    return redirect('forum_thread_detail', thread_id=comment.thread.id)

def forum_home(request):
    threads = Thread.objects.all().order_by('-created_at')
    paginator = Paginator(threads, 10)  # Show 10 threads per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'forum/forum_home.html', {'page_obj': page_obj})

@login_required(login_url='/accounts/login/')
def thread_detail(request, thread_id):
    thread = get_object_or_404(Thread, id=thread_id)
    comments = thread.comments.all()
    
    # Handle comment form submission
    if request.method == 'POST':
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            comment = comment_form.save(commit=False)
            comment.thread = thread
            comment.created_by = request.user
            comment.save()
            return redirect('forum_thread_detail', thread_id=thread.id)
    else:
        comment_form = CommentForm()

    return render(request, 'forum/thread_detail.html', {
        'thread': thread,
        'comments': comments,
        'comment_form': comment_form,
    })

