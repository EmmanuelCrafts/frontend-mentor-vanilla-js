const main = document.querySelector("main");
let  commentsData = null;
let clickCount = 0;

async function fetchComments() {
    const response = await fetch('./data.json');
    const data =  await response.json();
    commentsData = data;

    commentsData.comments.forEach(comment => {
        renderComment(comment);
    });

    main.appendChild(createReplyBox('send','Send', 'Add a comment...'));
}

fetchComments();

main.addEventListener('click' , handleClick);

function renderComment(comment, container = main) {
  const isCurrentUser = comment.user.username === commentsData.currentUser.username;

  const article = document.createElement('article');
  article.dataset.id = comment.id;
  article.classList.add('comment');

  const commentHeader = document.createElement('div');
  commentHeader.classList.add('comment-header');

  const userImage = document.createElement('img');
  userImage.classList.add('comment-avatar');
  userImage.src = comment.user.image.png;
  userImage.alt = comment.user.username;

  const username = document.createElement('span');
  username.classList.add('comment-username');
  username.textContent = comment.user.username;

  const createdAt = document.createElement('span');
  createdAt.classList.add('comment-date');
  createdAt.textContent = comment.createdAt;

  commentHeader.appendChild(userImage);
  commentHeader.appendChild(username);

  if(isCurrentUser) {
    const youBadge = document.createElement('span');
    youBadge.classList.add('comment-you-badge');
    youBadge.textContent = 'you';
    commentHeader.appendChild(youBadge);
  }

  commentHeader.appendChild(createdAt);

//   content
  const commentContent = document.createElement('p');
  commentContent.classList.add('comment-content');

  if (comment.replyingTo) {
    const replyingTo = document.createElement('span');
    replyingTo.classList.add('replying-to');
    replyingTo.textContent = `@${comment.replyingTo}`;
    
    commentContent.append(replyingTo, ' ');
}

  commentContent.append(comment.content);

// footer
  const commentFooter = document.createElement('div');
  commentFooter.classList.add('comment-footer');

//   score container
  const commentScore = document.createElement('div');
  commentScore.classList.add('comment-score')

  const scorePlusBtn = document.createElement('button');
  scorePlusBtn.classList.add('comment-score-btn');
  scorePlusBtn.dataset.action = 'upvote';

  const plusIcon = document.createElement('img');
  plusIcon.classList.add('plus-icon')
  plusIcon.src = "./images/icon-plus.svg";
  plusIcon.alt = "plus icon";
  scorePlusBtn.appendChild(plusIcon);

  const commentScoreCount = document.createElement('span');
  commentScoreCount.classList.add('score-count');
  commentScoreCount.textContent = comment.score;

  const scoreMinusBtn = document.createElement('button')
  scoreMinusBtn.classList.add('comment-score-btn')
  scoreMinusBtn.dataset.action = 'downvote';

  const minusIcon = document.createElement('img');
  minusIcon.classList.add('minus-icon')
  minusIcon.src = "./images/icon-minus.svg";
  minusIcon.alt = "minus icon";
  scoreMinusBtn.appendChild(minusIcon);

  commentScore.appendChild(scorePlusBtn);
  commentScore.appendChild(commentScoreCount);
  commentScore.appendChild(scoreMinusBtn);

//   reply container
  const replyBtn = document.createElement("button");
  replyBtn.classList.add("comment-reply-btn");
  replyBtn.dataset.action = "reply";

  const replyIcon = document.createElement("img");
  replyIcon.classList.add('reply-icon')
  replyIcon.src = "./images/icon-reply.svg";
  replyIcon.alt = "";

  const replyText = document.createElement("span");
  replyText.classList.add('reply-text');
  replyText.textContent = "Reply";


  replyBtn.append(replyIcon, replyText);

  commentFooter.appendChild(commentScore);

  if (isCurrentUser) {
    const actions = document.createElement('div');
    actions.classList.add('comment-actions');

    // delete
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('comment-delete-btn');
    deleteBtn.dataset.action = 'delete';

    const deleteIcon = document.createElement('img');
    deleteIcon.src = './images/icon-delete.svg';
    deleteIcon.alt = '';

    const deleteText = document.createElement('span');
    deleteText.textContent = 'Delete';

    deleteBtn.append(deleteIcon, deleteText);

    // edit
    const editBtn = document.createElement('button');
    editBtn.classList.add('comment-edit-btn');
    editBtn.dataset.action = 'edit';

    const editIcon = document.createElement('img');
    editIcon.src = './images/icon-edit.svg';
    editIcon.alt = '';

    const editText = document.createElement('span');
    editText.textContent = 'Edit';

    editBtn.append(editIcon, editText);

    actions.append(deleteBtn, editBtn);
    commentFooter.appendChild(actions);

  } else {
    commentFooter.appendChild(replyBtn);
  }


  article.appendChild(commentHeader);
  article.appendChild(commentContent);
  article.appendChild(commentFooter);

  container.appendChild(article);

  if(comment.replies && comment.replies.length > 0){
    const replies = document.createElement('div');
    replies.classList.add('replies');

    comment.replies.forEach(reply => {
        renderComment(reply, replies);
    });
    
    container.appendChild(replies);
  }
}


function createReplyBox(action, label, placeholder, initialText = '') {
  const replyBox = document.createElement('div');
  replyBox.classList.add('reply-box');

  const input = document.createElement('textarea');
  input.classList.add('reply-input');
  input.placeholder = placeholder;
  input.value = initialText;
  input.rows = 3;
  input.setAttribute('aria-label', 'Add a comment')

  const boxFooter = document.createElement('div');
  boxFooter.classList.add('box-footer');

  const avatar = document.createElement('img');
  avatar.classList.add('comment-avatar');
  avatar.src = commentsData.currentUser.image.png;
  avatar.alt = '';

  const actionBtn = document.createElement('button');
  actionBtn.classList.add('box-btn');
  actionBtn.dataset.action = action;
  actionBtn.textContent = label;

  boxFooter.append(avatar, actionBtn);

  replyBox.append(input, boxFooter);
  replyBox.dataset.type = action;
  return replyBox;
}

function handleClick (e) {
  const btn = e.target.closest('[data-action]');
  if(!btn) return;

  const action = btn.dataset.action;

  if(action === 'send') {
    handleSend();
    return;
  }

  const article = btn.closest('.comment')
  const id = article.dataset.id;
  const comment = findCommentById(id);

  if (action === 'upvote') {
    upvoteComment(comment, article);
  } else if (action === 'downvote') {
      downvoteComment(comment, article);
  } else if(action === 'reply') {
      handleReply(comment, article);
  }
}

function findCommentById(id) {
  const result = commentsData.comments.find((comment) => comment.id === Number(id));
  if (result) return result;

  for(const comment of commentsData.comments) {
    const reply = comment.replies.find(reply => reply.id === Number(id));

    if (reply) return reply;
  }

  return undefined;
}

function setVote(comment,article,newVote) {
  const oldVote = (comment.userVote || 0)

  if(oldVote === newVote) return;

  comment.score += newVote - oldVote;
  comment.userVote = newVote;

  article.querySelector('.score-count').textContent = comment.score;
}

function upvoteComment(comment, article) {
  setVote(comment, article, 1)
}

function downvoteComment(comment, article) {
  setVote(comment, article, -1)
}


function handleReply(comment, article) {
  const next = article.nextElementSibling;

  if (next && next.dataset.type === 'submit-reply') {
      next.remove();
  } else {
    const box = createReplyBox('submit-reply', 'reply', 'Add a reply...', `@${comment.user.username} `);
    article.after(box);
  
    const textArea = box.querySelector('.reply-input');
    textArea.focus();
  }
}

