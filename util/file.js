const fs = require('fs');

exports.deleteFile = (imageUrl) => {

    fs.unlink(imageUrl, (err) => {
        if (err) {
            console.log(err);
        }
        // console.log('path/file.txt was deleted');

    })
}