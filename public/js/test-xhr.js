const myForm = document.forms.xForm,
    action = myForm.getAttribute('action'),
    xhr = new XMLHttpRequest(),
    formData = new FormData(myForm);
//formData.append("patronym", "Робертович");

myForm.onsubmit = (e)=>{
e.preventDefault();
for (var p of formData) {
  console.log(p);
}
xhr.open('POST', action);

//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8')
xhr.send(formData);

};