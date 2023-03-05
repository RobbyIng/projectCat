
const formDataFromLC = localStorage.getItem(document.forms.add_cats_form.name);

const parsedData = formDataFromLC ? JSON.parse(formDataFromLC) : null;

if (parsedData) {
    Object.keys(parsedData).forEach(key => {
        document.forms.add_cats_form[key].value = parsedData[key];
    });
}

document.forms.add_cats_form.addEventListener('input', event =>{

    const formData = Object.fromEntries(new FormData(document.forms.add_cats_form).entries());

    localStorage.setItem(document.forms.add_cats_form.name, JSON.stringify(formData))
});