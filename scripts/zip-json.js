const fs = require('fs');
const zlib = require('zlib');

// Đường dẫn file JSON và file nén đầu ra
const inputFile = '../resources/recipesDB.recipes.json';
const outputFile = '../resources/recipes.json.gz';

// Tạo luồng đọc và ghi, sử dụng zlib để nén
const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);
const gzip = zlib.createGzip();

readStream
	.pipe(gzip) // Nén dữ liệu
	.pipe(writeStream) // Ghi dữ liệu nén vào file
	.on('finish', () => {
		console.log('Nén file JSON thành công:', outputFile);
	});