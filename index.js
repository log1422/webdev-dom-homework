const listElement = document.getElementById('list');
const deleteLastElementButton = document.getElementById('delete-last-button');
const addFormElement = document.getElementById('add-form');
let nLevel = 0; //уровень вложенности (думал как-то сделать, но не придумал)
let nText = ''; //текст комментария, на который отвечают
let nName = '';

const users = [
  {
    name: 'Глеб Фокин',
    date: '12.02.22 12:18',
    text: 'Это будет первый комментарий на этой странице',
    textReply: '',
    likes: 3,
    likesFlag: false,
    isEdit: false,
    otherEdit: false,
    nestingLevel: 0
  },
  {
    name: 'Варвара Н.',
    date: '13.02.22 19:22',
    text: 'Мне нравится как оформлена эта страница! ❤',
    textReply: '',
    likes: 75,
    likesFlag: true,
    isEdit: false,
    otherEdit: false,
    nestingLevel: 0
  }
]

const renderCommentators = () => {
  const userHTML = users.map((user, index) => {
    return `<li class="comment" data-index=${index}>
  <div class="comment-header">
    <div>${user.name}</div>
    <div>${user.date}</div>
  </div>
  <div class="comment-body">
    <div class="comment-text">
    ${user.nestingLevel === 0 ? ''.trim() : user.textReply.replaceAll("QUOTE_BEGIN", "<div class='quote'>").replaceAll("QUOTE_END", "</div>")}
    ${user.isEdit ? `<textarea type="textarea" class="add-form-text edit-comment" placeholder="Введите ваш коментарий" rows="4" id="comment-edit">${user.text}</textarea>` : user.text}
    </div>
  </div>
  <div class="comment-footer">
  <button class="button-edit-comment" data-index=${index} ${user.otherEdit ? 'disabled' : ''}>${user.isEdit ? 'Сохранить' : 'Редактировать'}</button>
    <div class="likes">
      <span class="likes-counter">${user.likes}</span>
      <button class="like-button ${user.likesFlag ? '-active-like' : ''}" data-index=${index}></button>
    </div>
  </div>
</li>`}).join('');
  listElement.innerHTML = userHTML;
  initEditCommentButtons();
  initEventListenders();
  initReplyComment();
}

const renderAddForm = () => {
  const addFormHTML = ` 
  <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="name-input" />
  <textarea type="textarea" class="add-form-text" placeholder="${nLevel === 0 ? "Введите ваш коментарий" : `Введите ваш ответ пользователю ${nName}`}" rows="4"
    id="text-input"></textarea>
    ${nLevel === 0 ? `
    <div class="add-form-row">
    <button class="add-form-button" id="add-form-button">Написать</button>
    ` :
      `
    <div class="add-form-row-asd">
    <button class="add-form-button" id="cansel-form-button">Отменить</button>
    <button class="add-form-button" id="add-form-button">Написать</button>
    `
    }
  </div>`;
  addFormElement.innerHTML = addFormHTML;
  const canselBattonElement = document.getElementById('cansel-form-button');
  if (canselBattonElement)
    canselBattonElement.addEventListener('click', () => {
      nLevel = 0;
      nText = '';
      nName = '';
      renderAddForm();
    })
  const buttonElement = document.getElementById('add-form-button');
  const nameInputElement = document.getElementById('name-input');
  const textInputElement = document.getElementById('text-input');

  const disabledButton = (ti) => {
    buttonElement.removeAttribute('disabled');
    buttonElement.classList.remove('disabled');
    nameInputElement.classList.remove('error');
    textInputElement.classList.remove('error');
    if (ti.target.value.trim() === '') {
      buttonElement.setAttribute('disabled', '');
      buttonElement.classList.add('disabled');
    }
  }

  const enterInput = (ti) => {
    if (ti.code === 'Enter')
      buttonElement.click();
  }
  nameInputElement.addEventListener('input', disabledButton);
  textInputElement.addEventListener('input', disabledButton);

  nameInputElement.addEventListener('keyup', enterInput);
  textInputElement.addEventListener('keyup', enterInput);

  buttonElement.addEventListener('click', () => {
    nameInputElement.classList.remove('error');
    textInputElement.classList.remove('error');
    if (nameInputElement.value.trim() === '') {
      nameInputElement.classList.add('error');
      return;
    }
    if (textInputElement.value.trim() === '') {
      textInputElement.classList.add('error');
      return;
    }

    const currentDate = new Date();
    users.push({
      name: nameInputElement.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      date: (currentDate.getDate() < 10 ? '0' + (currentDate.getDate()) : currentDate.getDate()) + '.'
        + (currentDate.getMonth() < 9 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1) + '.'
        + currentDate.getFullYear() + ' '
        + (currentDate.getHours() < 10 ? '0' + (currentDate.getHours()) : currentDate.getHours()) + ':'
        + (currentDate.getMinutes() < 10 ? '0' + (currentDate.getMinutes()) : currentDate.getMinutes()) + ':'
        + (currentDate.getSeconds() < 10 ? '0' + (currentDate.getSeconds()) : currentDate.getSeconds()),
      text: textInputElement.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      textReply: nLevel === 0 ? '' : `QUOTE_BEGIN ${nText} QUOTE_END`,
      likes: 0,
      likesFlag: false,
      isEdit: false,
      otherEdit: false,
      nestingLevel: nLevel
    })

    renderCommentators();
    nLevel = 0;
    renderAddForm();
    nameInputElement.value = '';
    textInputElement.value = '';
  })
}

renderAddForm();

const initReplyComment = () => {
  const replyComments = document.querySelectorAll('.comment');
  for (let replyComment of replyComments) {
    let tIndex = replyComment.dataset.index;
    replyComment.addEventListener('click', (event) => {
      //event.stopPropagation();
      nLevel = users[tIndex].nestingLevel + 1;
      nText = `${users[tIndex].text}\n\tот ${users[tIndex].name}`;
      nName = users[tIndex].name;
      renderAddForm();
    })
  }
}

const initEventListenders = () => {
  const likeButtonsElements = document.querySelectorAll('.like-button');
  for (let likeButtonElement of likeButtonsElements)
    likeButtonElement.addEventListener('click', (event) => {
      event.stopPropagation();
      let tIndex = likeButtonElement.dataset.index;
      if (users[tIndex].likesFlag) {
        users[tIndex].likes--;
        users[tIndex].likesFlag = false;
      } else {
        users[tIndex].likes++;
        users[tIndex].likesFlag = true;
      }
      renderCommentators();
    })
}

const initTextAreaEdit = () => {
  const textEdits = document.getElementById('comment-edit');
  textEdits.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

const initEditCommentButtons = () => {
  const buttonsEditComment = document.querySelectorAll('.button-edit-comment');
  const textEdits = document.getElementById('comment-edit');
  for (let buttonEditComment of buttonsEditComment) {
    buttonEditComment.addEventListener('click', (event) => {
      event.stopPropagation();
      let tIndex = buttonEditComment.dataset.index;
      if (users[tIndex].isEdit) {
        users[tIndex].text = textEdits.value;
        users[tIndex].isEdit = false;
        for (let otherButtons of buttonsEditComment) {
          if (otherButtons.dataset.index != tIndex)
            users[otherButtons.dataset.index].otherEdit = false;
        }
        renderCommentators();
      } else {
        users[tIndex].isEdit = true;
        for (let otherButtons of buttonsEditComment) {
          if (otherButtons.dataset.index != tIndex)
            users[otherButtons.dataset.index].otherEdit = true;
        }
        renderCommentators();
        initTextAreaEdit();
      }
    })
  }
}

deleteLastElementButton.addEventListener('click', (event) => {
  event.stopPropagation();
  listElement.innerHTML = listElement.innerHTML.slice(0, listElement.innerHTML.lastIndexOf(`< li class="comment" > `));
  users.pop();
  renderCommentators();
})

renderCommentators();