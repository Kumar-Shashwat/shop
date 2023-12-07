exports.error404 = (req, res, next) => {
    res.status(404);
    // res.sendFile(path.join(__dirname, '../', 'view', 'error.html'));
    res.render('error', {title: 'Error 404'});
} 

exports.error500 = (req, res, next) => {
    res.status(505);
    res.render('error500', {title : 'error occured ', path: 'error500'});
}

