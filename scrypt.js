const generateCatCard = (cat) => {
  return (
    `<div data-card_id=${cat.id} class="card mb-2" style="width: 18rem">
        <img
          src="${cat.image}"
          class="card-img-top"
          alt="фоточка котенка"
        />
        <div class="card-body">
          <h5 class="card-title">${cat.name}</h5>
          <p class="card-text">${cat.description}</p>
          <div class="btn-cont">
            <button type="button" data-action="open" class="btn btn-primary">Open</button>
            <button type="button" data-action="edit" class="btn btn-warning">Edit</button>
            <button type="button" data-action="delete" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>`
  )
}

$wrapper.addEventListener('click', async (event) => {
  const action = event.target.dataset.action;
  const $currentCard = event.target.closest('[data-card_id]');
  const catId = $currentCard.dataset.card_id;
   switch (action) {
    case 'delete':
      try {
        const res = await api.deleteCat(catId);
        const responce = await res.json();
        if (!res.ok) throw Error(responce.message)
        $currentCard.remove()
      } catch (error) {
        console.log(error);
      }
      break;
      
      case 'open':
        try {
          const res = await api.getCurrentCat(catId);
          const responce = await res.json();
          
          if (!res.ok) throw Error(responceOpen.message)
          $info_cat_name.innerText = responce.name;
          $info_cat_picture.src = responce.image;
          $info_cat_id.innerText = String(responce.id);
          $info_cat_age.innerText = responce.age;
          $info_cat_rate.innerText = responce.rate;
          responce.favorite ? $info_cat_favorite.style.color="green" : $info_cat_favorite.style.color="red";
          $info_cat_description.innerText = responce.description;
          $modalInfo.classList.remove(HIDDEN_INFO) // открываем модалку
          } catch (error) {
            console.log(error);
          }
      break;

    case 'edit':
      try {
        const res = await api.getCurrentCat(catId);
        const responce = await res.json();

        if (!res.ok) throw Error(responceOpen.message)
        $editForm.querySelector('input[name="id"]').value = responce.id;
        $editForm.querySelector('input[name="id"]').readOnly = true;

        $editForm.querySelector('input[name="name"]').value = responce.name;
        $editForm.querySelector('input[name="image"]').value = responce.image;
        $editForm.querySelector('input[name="age"]').value = responce.age;
        $editForm.querySelector('input[name="rate"]').value = responce.rate;
        if (responce.favorite) {
          $editForm.querySelector('input[name="favorite"]').value = "on";
          $editForm.querySelector('input[name="favorite"]').checked = true;
        }
        else{
          $editForm.querySelector('input[name="favorite"]').value = "off";
          $editForm.querySelector('input[name="favorite"]').checked = false;
        }
        $editForm.querySelector('textarea[name="description"]').innerText = responce.description;

        $modalEdit.classList.remove(HIDDEN_EDIT) // открываем модалку

      } catch (error) {
        console.log(error);
      }
      break;

      default:
      break;
  }
})

$addBtn.addEventListener('click', () => {
  $modalAdd.classList.remove(HIDDEN_ADD) // открываем модалку
})

document.forms.add_cats_form.addEventListener('submit', async (event) => {
  event.preventDefault();
  $formErrorMsg.innerText = '';
  const data = Object.fromEntries(new FormData(event.target).entries());

  data.id = Number(data.id)
  data.age = Number(data.age)
  data.rate = Number(data.rate)
  data.favorite = data.favorite == 'on'

  const res = await api.addNewCat(data)
  if (res.ok){
    $wrapper.replaceChildren();
    getCatsFunc()
    $modalAdd.classList.add(HIDDEN_ADD)
    return event.target.reset()
  }
  else{
    const responce = await res.json()
    $formErrorMsg.innerText = responce.message
  }
  event.target.reset() // сброс формы
  $modalAdd.classList.add(HIDDEN_ADD) // убираем модалку
  localStorage.removeItem(event.target.name);
})
document.forms.edit_cats_form.addEventListener('submit', async (event) => {
  event.preventDefault();
  $formErrorMsg.innerText = '';
  const data = Object.fromEntries(new FormData(event.target).entries());

  data.id = Number(data.id)
  data.age = Number(data.age)
  data.rate = Number(data.rate)
  data.favorite = data.favorite == 'on'

  const res = await api.editCat(data.id,data)

  if (res.ok){
    $wrapper.replaceChildren();
    getCatsFunc()
    $modalEdit.classList.add(HIDDEN_EDIT)
    return event.target.reset()
  }
  else {
    console.log(res);
    const responce = await res.json()
    $formErrorMsg.innerText = responce.message
  }
  event.target.reset() // сброс формы
  $modalEdit.classList.add(HIDDEN_EDIT) // убираем модалку
  localStorage.removeItem(event.target.name);
  $editForm.querySelector('textarea[name="description"]').innerText = '';
})

document.forms.add_cats_form.addEventListener('reset', async (event) => {
  event.preventDefault();
  event.target.reset() // сброс формы
  $modalAdd.classList.add(HIDDEN_ADD) // убираем модалку
  localStorage.removeItem(event.target.name);
})
document.forms.info_cats_form.addEventListener('reset', async (event) => {
  event.preventDefault();
  event.target.reset() // сброс формы
  $modalInfo.classList.add(HIDDEN_INFO) // убираем модалку
  localStorage.removeItem(event.target.name);
})
document.forms.edit_cats_form.addEventListener('reset', async (event) => {
  event.preventDefault();
  event.target.reset() // сброс формы
  $modalEdit.classList.add(HIDDEN_EDIT) // убираем модалку
  localStorage.removeItem(event.target.name);
})


$modalInfo.classList.add(HIDDEN_INFO) // убираем модалку
const getCatsFunc = async () => {
  const res = await api.getAllCats();

  if (res.status != 200) {
    const $errorMessage = document.createElement('p');
    $errorMessage.classList.add('error-msg');
    $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';
    $wrapper.appendChild($errorMessage);  
  }
  const data = await res.json();
  
  if (data.length === 0) {
    const $notificationMessage = document.createElement('p');
    $notificationMessage.innerText = 'Список котов пуст, добавьте первого котика';
    $wrapper.appendChild($notificationMessage);  
  }

  data.forEach(cat => {
    $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
  });
}
getCatsFunc();
