const form = document.querySelector('form')
const submitButton = document.querySelector('#submit-button')
submitButton.addEventListener('click', event => {
  form.classList.add('was-validated')
})

form.addEventListener('submit', () => {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
    alert('有些欄位沒有填寫喔!')
  }
})
