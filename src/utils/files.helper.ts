





export const renameFile = (req, file, callback) => {
    const name = file.originalName.split('.')[0];
    const fileName = file.originalName;
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');

    callback(null, `${name}-${randomName}${fileName}`);
}


export const fileFilter = (req, file, callback) => {
    if(!file.originalName.match(/\.(pdf)$/)) {
        return callback(new Error('Invalid format type'), false)
    }

    callback(null, true);
}