
const formDataFromLC = localStorage.getItem(document.forms.form_test.name);


const parsedData = formDataFromLC ? JSON.parse(formDataFromLC) : null;

if (parsedData) {
    Object.keys(parsedData).forEach(key => {
        document.forms.form_test[key].value = parsedData[key];
    });
}
document.forms.form_test.addEventListener('input', event =>{

    const formData = Object.fromEntries(new FormData(document.forms.form_test).entries());

    localStorage.setItem(document.forms.form_test.name, JSON.stringify(formData))
});

document.querySelector('[data-clear_btn]').addEventListener('click', event => {
    event.preventDefault();
    localStorage.removeItem(document.forms.form_test.name);
    console.log(formDataFromLC);
    document.forms.form_test.reset();
})