const update = document.querySelector('#update-button');
const deleteQuote = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message');

//allowing users to create a put request from the client side using fetch api
update.addEventListener('click', ()=>{
    fetch('/quotes', {
        //set a put request
        method: 'put',
        //tell server we're sending JSON data by setting request header
        headers: {'Content-Type':'application/json'},
        //add request data via the body and convert it to JSON format
        body: JSON.stringify({
            name: 'Darth Vader',
            quote: 'I find your lack of faith disturbing.'
        })
    })
    .then(res => {
        //only calls res.json() if request succeeded (i.e ok == true)
        if (res.ok) return res.json()
        else return Promise.reject({      
        status: response.status,
        statusText: response.statusText})
    })
    .then(response => {
        window.location.reload(true); //refresh the browser page --> if working with react or another framework we could update the DOM here
    })
    .catch(err => console.log(err))
})

deleteQuote.addEventListener('click', ()=>{
    fetch('/quotes', {
        method: 'delete',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            name: 'Darth Vader'
        })
    })
    .then(res => {
        if(res.ok){
            return res.json();
        }
    })
    .then(res => {
        if(res === "No quote to delete"){
            messageDiv.textContent = 'No Darth Vader quote to delete';
        }
        else{
            window.location.reload(true);
        }
    })
})