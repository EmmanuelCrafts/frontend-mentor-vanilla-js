const main = document.querySelector("main");
const modal = document.querySelector('.delete-dialog');
let  commentsData = null;
let articleToDelete = null;

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

// event delegation for all click events
main.addEventListener('click' , handleClick);

main.addEventListener('input', (e) => {
  const textArea = e.target.closest('.reply-input');
  if(!textArea) return;
  textArea.classList.remove('input-error')
})

modal.addEventListener('click', (e) => {
  handleModalClick(e);
})

modal.addEventListener('close', () => { articleToDelete = null; })



// functions

function renderComment(comment, container = main, referenceNode = null) {
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
  createdAt.textContent = typeof comment.createdAt === 'number'
  ? timeAgo(comment.createdAt)
  : comment.createdAt;
  
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

  container.insertBefore(article, referenceNode);

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

  if (action === 'submit-reply') return submitReply(btn);
  if (action === 'send') return submitComment(btn);

  handleCommentAction(action, btn);
}


function handleCommentAction(action, btn) {
  const article = btn.closest('.comment');
  if (!article) return;

  const comment = findCommentById(article.dataset.id);

  switch (action) {
    case 'upvote':
      upvoteComment(comment, article);
      break;
    case 'downvote':
      downvoteComment(comment, article);
      break;
    case 'reply':
      handleReply(comment, article);
      break;
    case 'delete':
      openDeleteModal(article);
      break;
    case 'edit':
      editComment(article);
      break;
    case 'update':
      updateComment(article, comment);
      break;
  }
}

function openDeleteModal(article) {
  articleToDelete = article;
  modal.showModal();
}

function handleModalClick(e) {
 const button = e.target.closest('[data-action]');
  if(!button) return;

  const action = button.dataset.action;

  if(action === 'cancel') {
    modal.close();
    return;
  }

  if(action === 'delete') {
    deleteComment(articleToDelete);
    modal.close();
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
  const score = article.querySelector('.score-count');
  const oldVote = (comment.userVote || 0)

  if(oldVote === newVote) return;

  const newScore = comment.score + newVote - oldVote;
  if (newScore < 0) return;

  comment.score += newVote - oldVote;
  comment.userVote = newVote;

  score.textContent = comment.score;
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

function submitReply(btn) {
  const div = btn.closest('.reply-box')
  if(!div) return;

  const previous = div.previousElementSibling;
  const id = previous.dataset.id;
  const content = getValidContent(div);
  if(!content) return;
  
  const parent = findParentComment(id)
  const comment = findCommentById(id);

  const reply = {...createComment(content), replyingTo: comment.user.username} 
  parent.replies.push(reply);

  placeReply(reply, previous, div);
  div.remove();
}

function submitComment(btn) {
 const div = btn.closest('.reply-box');
 if (!div) return;

 const content = getValidContent(div);
 if(!content) return;
 const comment = {...createComment(content), replies: []};

 commentsData.comments.push(comment);
 renderComment(comment, main, div);

 clearInput(div);
}



function placeReply(reply, previous, replyBox) {
  const parentDiv = previous.parentElement;
  const element = replyBox.nextElementSibling;

  if (parentDiv === main) {
    if (element && element.classList.contains('replies')) {
      renderComment(reply, element);
    } else {
      const repliesDiv = document.createElement('div');
      repliesDiv.classList.add('replies');
      renderComment(reply, repliesDiv);
      previous.after(repliesDiv);
    }
  } else {
    renderComment(reply, parentDiv);
  }
}

function getValidContent(replyBox) {
    const textArea = replyBox.querySelector('.reply-input');
    const content = extractContent(replyBox);

    if(!content) {
      textArea.classList.add('input-error');
      textArea.focus();
      return null;
     }

  return content;
}


function extractContent(div) {
  const textArea = div.querySelector('.reply-input');
  const content = textArea.value.trim();

  const wordArr = content.split(' ');
  const symbol = wordArr[0].slice(0,1);

  if(symbol === '@') {
    return wordArr.slice(1).join(' ');
  }

  return content;
}


function createId() {
  const ids = commentsData.comments.flatMap(comment => [
    comment.id, ...comment.replies.map(replies => replies.id)
  ])
  
  return Math.max(...ids) + 1;
}

function createComment(content) {
   return {
    id: createId(),
    content: content,
    createdAt: Date.now(),
    score: 0,
    user: {
      image: {
        png: commentsData.currentUser.image.png,
        webp: commentsData.currentUser.image.webp
      },
      username: commentsData.currentUser.username
    },
  }
}

function clearInput(replyBox) {
  const textArea = replyBox.querySelector('.reply-input')
  textArea.value = '';
}

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp)/1000);
  const minutes = Math.floor(seconds/60);
  const hours = Math.floor(minutes/60);
  const days = Math.floor(hours/24);
  const months = Math.floor(days/30);
  const years = Math.floor(months/12);

  if(seconds < 60) {
    return 'Now'
  }

  if(minutes < 60) {
    return pluralize(minutes, 'minute')
  }

  if (hours < 24) {
    return pluralize(hours, 'hour')
  }

  if(days < 30) {
    return pluralize(days, 'day')
  }

  if(months < 12) {
    return pluralize(months, 'month')
  }

  return pluralize(years, 'year')
}


function pluralize(count, unit) {
  const word = count === 1 ? unit : unit + 's';
  return `${count} ${word} ago`;
}

function findParentComment(id) {
  for(const comment of commentsData.comments) {
    if(comment.id === Number(id)) return comment;
   
    const child = comment.replies.find(reply => reply.id === Number(id));
    if(child) return comment;
  }
}

function deleteComment(article) {
  const id = article.dataset.id;
  const parent = findParentComment(id);
  
  if(parent.id === Number(id)) {
    commentsData.comments = commentsData.comments.filter(comment => comment.id !== Number(id));
    const next = article.nextElementSibling;

    if(next && next.classList.contains('replies')) next.remove();
  } else {
    parent.replies = parent.replies.filter(reply => reply.id !== Number(id));
  }
  article.remove();
}

function editComment(article) {
 const p = article.querySelector('.comment-content');
 const footer = article.querySelector('.comment-footer');
 
 const textArea = document.createElement('textarea');
 textArea.classList.add('reply-input');
 textArea.rows = 5;
 textArea.value = p.textContent;

 const updateBtn = document.createElement('button');
 updateBtn.classList.add('box-btn');
 updateBtn.dataset.action = 'update';
 updateBtn.textContent = 'update';

 footer.classList.toggle('is-editing');
 p.replaceWith(textArea, updateBtn);
 textArea.focus();
}

function updateComment(article, comment) {
  const content = extractContent(article);
  const textArea = article.querySelector('.reply-input');

    if(!content) {
      textArea.classList.add('input-error');
      textArea.focus();
      return ;
    }
  
  comment.content = content;

  const p = document.createElement('p');
  p.classList.add('comment-content');
  p.textContent = content;

  const footer = article.querySelector('.comment-footer');
  const updateBtn = article.querySelector('[data-action="update"]');
  
  footer.classList.toggle('is-editing');

  textArea.replaceWith(p);
  updateBtn.remove();
}
