// all these code will run on the client side brower.

const deleteProduct = (btn) => {
    console.log("hello");
    const prodId = btn.parentNode.querySelector('[name=prodId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    console.log(prodId, csrf);

    const productElement = btn.closest('.book-container');

    // console.log(productElement);            // the result will not printed on the node server side console but the browser's console.

    fetch('/admin/product/' + prodId, {     // fetch is used to retrive or send data from server to the client site browser.
        method: 'DELETE',
        headers: {
            'csrf-token': csrf,
            'Content-Security-Policy' : "default-src 'self'  'unsafe-inline' "
        }
    })
    .then(result => {

        return result.json();
    })
    .then(data => {
        console.log(data, "hello");
        productElement.remove();
        // productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
        console.log(err);
    });
};