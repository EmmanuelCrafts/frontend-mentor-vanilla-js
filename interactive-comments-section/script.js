const main = document.querySelector("main");
let  commentsData = null;

async function fetchComments() {
    const response = await fetch('/data.json');
    console.log(response);
    const data =  await response.json();
    commentsData = data;
    console.log(commentsData)
}

fetchComments();

const {currentUser, comments} = commentsData;

function renderComments() {
  const article = document.createElement('article');
  article.classList.add('comment');

  const commentHeader = document.createElement('div');
  commentHeader.classList.add('comment-header');

  const userImage = document.createElement('img');
  userImage.classList.add('comment-avatar');
  userImage.src = currentUser.image.png;
  userImage.alt = currentUser.username;

  const username = document.createElement('span');
  username.classList.add('comment-username');
  username.textContent = currentUser.username;

  const createdAt = document.createElement('span');
  createdAt.classList.add('comment-date');
  createdAt.textContent = comments[0].createdAt;

  commentHeader.appendChild(userImage);
  commentHeader.appendChild(username);
  commentHeader.appendChild(createdAt);

  const commentContent = document.createElement('p');
  commentContent.classList.add('comment-content');
  commentContent.textContent = comments[0].content;

  const commentFooter = document.createElement('div');
  commentFooter.classList.add('comment-footer');

//   score container
  const commentScore = document.createElement('div');
  commentScore.classList.add('comment-score')

  const scorePlusBtn = document.createElement('button');
  scorePlusBtn.classList.add('comment-score-btn');
  scorePlusBtn.textContent = '+';

  const commentScoreCount = document.createElement('span');
  commentScoreCount.classList.add('score-count');
  commentScoreCount.textContent = 12 ;

  const scoreMinusBtn = document.createElement('button')
  scoreMinusBtn.classList.add('comment-score-btn')
  scoreMinusBtn.textContent = '-';

  commentScore.appendChild(scorePlusBtn);
  commentScore.appendChild(commentScoreCount);
  commentScore.appendChild(scoreMinusBtn);

//   reply container
  const replyBtn = document.createElement("button");
  replyBtn.classList.add("comment-reply-btn");

  const replyIcon = document.createElement("img");
  replyIcon.classList.add('reply-icon')
  replyIcon.src = "./images/icon-reply.svg";
  replyIcon.alt = "";

  const replyText = document.createElement("span");
  replyText.classList.add('reply-text');
  replyText.textContent = "Reply";

  replyBtn.append(replyIcon, replyText);

  commentFooter.appendChild(commentScore);
  commentFooter.appendChild(replyBtn);

  article.appendChild(commentHeader);
  article.appendChild(commentContent);
  article.appendChild(commentFooter);

  main.appendChild(article);
}