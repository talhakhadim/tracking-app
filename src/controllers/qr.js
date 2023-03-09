const invoiceQr = require('../models/invoice-qr');
const verification = require('../models/verification');
const customerverification = require('../models/customerverification');
const path = require('path');
const QRCode = require('qrcode');
const { Op } = require('sequelize');
const sequelize = require('../../connection');
const template = require('../utils/template');

const fs = require('fs');

// import the node mailer from utils
const sendMail = require('../utils/sendemail');

const baseUrl = 'https://tracking-app-production.up.railway.app/';
module.exports = {
  createInvoice: async (req, res) => {
    if (!req.body.invoiceId) {
      return res.json({ message: 'No invoice id found' });
    }
    const checkInvoice = await invoiceQr.findOne({
      where: { invoiceId: req.body.invoiceId },
    });
    if (checkInvoice) {
      return res.json({ message: 'Invoice already exists' });
    }
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const invoice = {
      invoiceId: req.body.invoiceId,
      qrCode: `${baseUrl}/${req.body.invoiceId}_${uniqueId}_invoice.png`,
      userId: req.body.userId,
      uniqueKey: uniqueId,
      customerId: req.body.customerId,
    };
    const invoiceData = baseUrl + 'invoice/active/' + uniqueId;
    const invoiceAr = await invoiceQr.create(invoice);
    if (invoiceAr) {
      const folderPath = path.join(__dirname, 'temp');
      const fileName = path.join(folderPath, `${req.body.invoiceId}_${uniqueId}_invoice.png`);
      QRCode.toFile(fileName, invoiceData, async function (err) {
        if (err) throw err;
        console.log('QR code saved as ' + fileName);
        // res.sendFile(fileName, { root: __dirname });
        return res.json(invoiceAr);
      });
    }
  },
  // templateSecurity: async (req, res) => {
  //     try {
  //         if (!req.params.id) {
  //             return res.json({ message: 'No id found' });
  //         }
  //         const qrCode = req.params.id;
  //         // const emailCode = Math.random().toString(36).substring(2, 8) + Date.now();
  //         let emailCode = '123';
  //         const verificationCode = await verification.update(
  //             {
  //                 qrcode: qrCode,
  //                 code: emailCode,
  //             },
  //             {
  //                 where: {}
  //             }
  //         );
  //         if (!verificationCode) {

  //             return res.json({ message: 'Something Went Wrong, Please try again' });
  //         }
  //         // Email needs to sent here
  //         // Note : Sent email to abhai0548@gmail.com just sent verification code

  //         res.sendFile(__dirname + '/index.html');
  //     } catch (error) {
  //         return res.json({ message: error.message });
  //     }
  // },
  sendingInvoice: async (req, res) => {
    // Verification
    try {
      let verify = await invoiceQr.findOne({
        where: { uniqueKey: req.params.id },
      });
      if (!verify) {
        return res.json({
          status: false,
          message: 'There an error with invoice check manually, Please try again',
        });
      }

      verify = JSON.parse(JSON.stringify(verify));
      if (verify.verification === false) {
        let details = {
          invoiceId: verify.invoiceId,
          userId: verify.userId,
          generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
        };
        return res.send(template(details, 'public'));
        // return res.sendFile(__dirname + '/customer.html', { locals: { details } });
        // return res.json({
        //     status: true,
        //     message: 'Invoice Fetched Successfully',

        // })
      }

      const checkifAlredy = await customerverification.findOne({
        where: { invoiceId: verify.id },
      });
      if (checkifAlredy) {
        await invoiceQr.update(
          {
            verification: false,
          },
          {
            where: { id: verify.id },
          }
        );
        let details = {
          message: 'Invoice Fetched Successfully, Timer is already started and email has been sent already to customer',
        };
        return res.send(template(details, 'admin'));
        // return res.json({
        //     status: true,
        //     message: 'Invoice Fetched Successfully, Timer is already started and email has been sent already to customer',
        //     data: {
        //         invoiceId: verify.invoiceId,
        //         userId: verify.userId,
        //         generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
        //     }
        // })
      }
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const invoice = {
        invoiceId: verify.id,
        qrcode: verify.qrCode,
        employeeId: verify.userId,
        customerId: verify.customerId,
        uniqueKey: uniqueId,
        status: 'active',
      };
      console.log('Invoice=====>', invoice);
      const invoiceAr = await customerverification.create(invoice);
      if (invoiceAr) {
        await invoiceQr.update(
          {
            verification: false,
          },
          {
            where: { id: verify.id },
          }
        );
        const invoiceData = baseUrl + 'invoice/acepted/' + verify.uniqueKey;
        const folderPath = path.join(__dirname, 'customers');
        const fileName = path.join(folderPath, `${verify.id}_${uniqueId}_invoice.png`);
        QRCode.toFile(fileName, invoiceData, async (err) => {
          if (err) throw err;
          console.log('QR code saved as ' + fileName);
          const customerEmail = 'asad.shahab@thecybercell.co.uk';
          // Send email to customer
          await sendMail(customerEmail, fileName);
          // res.sendFile(fileName, { root: __dirname });
          // return res.json(invoiceAr);
        });
        let details = {
          invoiceId: verify.invoiceId,
          userId: verify.userId,
          generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
          message: 'Invoice Fetched Successfully, Timer has been started and email has been sent successfully',
        };
        return res.send(template(details, 'admin'));
        // return res.json({
        //     status: true,
        //     message: 'Invoice Fetched Successfully, Timer has been started and email has been sent successfully',
        //     data: {
        //         invoiceId: verify.invoiceId,
        //         userId: verify.userId,
        //         generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
        //     }
        // })
      }
    } catch (error) {
      return res.json({ message: error.message });
    }
  },
  customerAcept: async (req, res) => {
    try {
      let newverify = await invoiceQr.findOne({
        where: { uniqueKey: req.params.id },
      });

      if (!newverify) {
        return res.json({
          status: false,
          message: 'There an error with invoice check manually, Please try again',
        });
      }

      let verify = JSON.parse(JSON.stringify(newverify));
      console.log('verify====>', verify);
      if (verify.verification === false) {
        let details = {
          invoiceId: verify.invoiceId,
          userId: verify.userId,
          generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
          // completed: new Date(verify.updatedAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
        };
        return res.send(template(details, 'public'));
        // return res.json({
        //     status: true,
        //     message: 'Invoice Fetched Successfully',
        //     data: {
        //         invoiceId: verify.invoiceId,
        //         userId: verify.userId,
        //         generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
        //         // completed: new Date(verify.updatedAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
        //     }
        // })
      }
      let already = await customerverification.findOne({
        where: { qrcode: verify.qrCode },
      });
      already = JSON.parse(JSON.stringify(already));
      if (already.status === 'active') {
        const check = await customerverification.update(
          {
            status: 'completed',
          },
          {
            where: { qrcode: verify.qrCode },
          }
        );
        if (check) {
          await invoiceQr.update(
            {
              verification: false,
            },
            {
              where: { id: verify.id },
            }
          );
          let details = {
            message: 'Invoice Completed Successfully',
          };
          return res.send(template(details, 'admin'));
          // return res.json({
          //     status: true,
          //     message: 'Invoice Completed Successfully',
          // })
        }
      }
      await invoiceQr.update(
        {
          verification: false,
        },
        {
          where: { id: verify.id },
        }
      );
      let details = {
        message: `Invoice is already ${already.status}`,
      };
      return res.send(template(details, 'admin'));
      // return res.json({
      //     status: false,
      //     message: `You cannot complete this. Invoice is already ${already.status}`,
      // })
    } catch (error) {
      return res.json({ message: error.message });
    }

    // Sent an email to abhai0548@gmail.com, that Invoice is acepted
  },
  rejected: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.json({ message: 'No id found' });
      }
      const qrCode = req.params.id;
      const check = await customerverification.findOne({
        where: { qrcode: qrCode },
      });
      if (check.status === 'rejected' || check.status === 'completed') {
        return res.json({ message: `You cannot process because this invoice is already ${check.status}` });
      }
      const invoice = await customerverification.update(
        {
          status: 'rejected',
        },
        {
          where: { qrcode: qrCode },
        }
      );
      if (!invoice) {
        return res.json({ message: 'Something Went Wrong, Please try again' });
      }

      return res.json({ message: 'Invoice Rejected Successfully' });
    } catch (error) {
      return res.json({ message: error.message });
    }

    // Sent an email to abhai0548@gmail.com, that Invoice is acepted
  },
  avgTime: async (req, res) => {
    try {
      if (!req.body.date) {
        let employeeId = req.body.employeeId;
        const completedRecords = await customerverification.findAll({
          where: {
            employeeId: employeeId,
            status: 'completed',
            updatedAt: {
              [Op.ne]: sequelize.col('createdAt'),
            },
          },
          order: [['updatedAt', 'DESC']],
        });

        const numCompletedRecords = completedRecords.length;
        let totalTimeInSeconds = 0;

        const recordDetails = completedRecords.map((record, index) => {
          const timeDifferenceInSeconds = (record.updatedAt - record.createdAt) / 1000;
          totalTimeInSeconds += timeDifferenceInSeconds;

          const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
          const remainingSeconds = timeDifferenceInSeconds % 60;

          return {
            [`Record${index + 1}`]: {
              createdAt: record.createdAt,
              updatedAt: record.updatedAt,
              timeDifference: `${timeDifferenceInMinutes} minutes ${remainingSeconds} seconds`,
            },
          };
        });

        const averageTimeInSeconds = Math.round(totalTimeInSeconds / numCompletedRecords);

        const response = {
          employeeId: employeeId,
          numCompletedRecords: numCompletedRecords,
          recordDetails: recordDetails,
          totalTimeInSeconds: totalTimeInSeconds,
          averageTimeInSeconds: averageTimeInSeconds,
          averageTimeInMinutes:
            Math.floor(averageTimeInSeconds / 60) + ' minutes ' + (averageTimeInSeconds % 60) + ' seconds',
        };

        return res.json(response);
      } else {
        const start = new Date(req.body.date.start);
        const end = new Date(req.body.date.end);
        let employeeId = req.body.employeeId;
        console.log(req.body.date);
        const completedRecords = await customerverification.findAll({
          where: {
            employeeId: employeeId,
            status: 'completed',
            updatedAt: {
              [Op.ne]: sequelize.col('createdAt'),
            },
            createdAt: {
              [Op.between]: [start, end],
            },
          },
          order: [['updatedAt', 'DESC']],
        });

        const numCompletedRecords = completedRecords.length;
        let totalTimeInSeconds = 0;

        const recordDetails = completedRecords.map((record, index) => {
          const timeDifferenceInSeconds = (record.updatedAt - record.createdAt) / 1000;
          totalTimeInSeconds += timeDifferenceInSeconds;

          const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
          const remainingSeconds = timeDifferenceInSeconds % 60;

          return {
            [`Record${index + 1}`]: {
              createdAt: record.createdAt,
              updatedAt: record.updatedAt,
              timeDifference: `${timeDifferenceInMinutes} minutes ${remainingSeconds} seconds`,
            },
          };
        });

        const averageTimeInSeconds = Math.round(totalTimeInSeconds / numCompletedRecords);

        const response = {
          employeeId: employeeId,
          numCompletedRecords: numCompletedRecords,
          recordDetails: recordDetails,
          totalTimeInSeconds: totalTimeInSeconds,
          averageTimeInSeconds: averageTimeInSeconds,
          averageTimeInMinutes:
            Math.floor(averageTimeInSeconds / 60) + ' minutes ' + (averageTimeInSeconds % 60) + ' seconds',
        };

        return res.json(response);
      }
    } catch (error) {
      return res.json({ message: error.message });
    }
  },
};
