const express = require('express');
const app = express();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// write a json middle ware please
app.use((req, res, next) => {
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };
  next();
});



// app.get('/', (req, res) => {
//   // const randomObject = {};

//   // for (let i = 0; i < 10; i++) {
//   //     const randomKey = Math.random().toString(36).substring(2, 15);
//   //     const randomValue = Math.random().toString(36).substring(2, 15);
//   //     randomObject[randomKey] = randomValue;
//   // }
//   // console.log(randomObject);
//   let asad = 'testing';
//   const data = 'asad';
//   const fileName = asad + '.png';

//   QRCode.toFile(fileName, data, function (err) {
//     if (err) throw err;
//     console.log('QR code saved as ' + fileName);
//   });
// });

app.listen(5001, () => console.log('Server started on port 5001'));
