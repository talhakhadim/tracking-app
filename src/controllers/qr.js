const invoiceQr = require('../models/invoice-qr');
const verification = require('../models/verification');
const customerverification = require('../models/customerverification');
const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');
const baseUrl = 'http://192.168.1.112:5000/'
module.exports = {
    createInvoice: async (req, res) => {
        if (!req.body.invoiceId) {
            return res.json({ message: 'No invoice id found' });
        }
        const checkInvoice = await invoiceQr.findOne({
            where: { invoiceId: req.body.invoiceId }
        })
        if (checkInvoice) {
            return res.json({ message: 'Invoice already exists' });
        }
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        const invoice = {
            invoiceId: req.body.invoiceId,
            qrCode: `${req.body.invoiceId}_${uniqueId}_invoice.png`,
            userId: req.body.userId,
            uniqueKey: uniqueId,
            customerId: req.body.customerId,
        };
        const invoiceData = baseUrl + 'invoice/active/' + uniqueId;
        const invoiceAr = await invoiceQr.create(invoice);
        if (invoiceAr) {
            const folderPath = path.join(__dirname, 'temp');
            const fileName = path.join(folderPath, `${req.body.invoiceId}_${uniqueId}_invoice.png`);
            QRCode.toFile(fileName, invoiceData, function (err) {
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
                where: { uniqueKey: req.params.id }
            })
            if (!verify) {
                return res.json({
                    status: false,
                    message: 'There an error with invoice check manually, Please try again'
                })
            }

            verify = JSON.parse(JSON.stringify(verify));
            if (verify.verification === false) {
                return res.json({
                    status: true,
                    message: 'Invoice Fetched Successfully',
                    data: {
                        invoiceId: verify.invoiceId,
                        userId: verify.userId,
                        generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
                    }
                })
            }


            const checkifAlredy = await customerverification.findOne({
                where: { invoiceId: verify.id }
            })
            if (checkifAlredy) {
                return res.json({
                    status: true,
                    message: 'Invoice Fetched Successfully, Timer is already started and email has been sent already to customer',
                    data: {
                        invoiceId: verify.invoiceId,
                        userId: verify.userId,
                        generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
                    }
                })
            }
            const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
            const invoice = {
                invoiceId: verify.id,
                qrcode: verify.qrCode,
                employeeId: verify.userId,
                customerId: verify.customerId,
                uniqueKey: uniqueId,
                status: 'active'
            };
            console.log("Invoice=====>", invoice);
            const invoiceAr = await customerverification.create(invoice);
            if (invoiceAr) {
                await invoiceQr.update(
                    {
                        verification: false,
                    },
                    {
                        where: { id: verify.id }
                    }
                );
                const invoiceData = baseUrl + 'invoice/acepted/' + verify.uniqueKey;
                const folderPath = path.join(__dirname, 'customers');
                const fileName = path.join(folderPath, `${verify.id}_${uniqueId}_invoice.png`);
                QRCode.toFile(fileName, invoiceData, function (err) {
                    if (err) throw err;
                    console.log('QR code saved as ' + fileName);
                    // res.sendFile(fileName, { root: __dirname });
                    // return res.json(invoiceAr);
                });
                return res.json({
                    status: true,
                    message: 'Invoice Fetched Successfully, Timer has been started and email has been sent successfully',
                    data: {
                        invoiceId: verify.invoiceId,
                        userId: verify.userId,
                        generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
                    }
                })
            }
        } catch (error) {
            return res.json({ message: error.message });
        }

    },
    customerAcept: async (req, res) => {
        try {
            let newverify = await invoiceQr.findOne({
                where: { uniqueKey: req.params.id },
            })

            if (!newverify) {
                return res.json({
                    status: false,
                    message: 'There an error with invoice check manually, Please try again'
                })
            }

            let verify = JSON.parse(JSON.stringify(newverify));
            console.log("verify====>", verify);
            if (verify.verification === false) {
                return res.json({
                    status: true,
                    message: 'Invoice Fetched Successfully',
                    data: {
                        invoiceId: verify.invoiceId,
                        userId: verify.userId,
                        generatedAt: new Date(verify.createdAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
                        // completed: new Date(verify.updatedAt.toString()).toLocaleString('en-US', { timeZone: 'UTC', hour12: true }),
                    }
                })
            }
            let already = await customerverification.findOne({
                where: { qrcode: verify.qrCode }
            })
            already = JSON.parse(JSON.stringify(already));
            if (already.status === 'active') {
                const check = await customerverification.update({
                    status: 'completed',
                }, {
                    where: { qrcode: verify.qrCode }
                })
                if (check) {
                    await invoiceQr.update(
                        {
                            verification: false,
                        },
                        {
                            where: { id: verify.id }
                        }
                    );
                    return res.json({
                        status: true,
                        message: 'Invoice Completed Successfully',
                    })
                }
            }
            await invoiceQr.update(
                {
                    verification: false,
                },
                {
                    where: { id: verify.id }
                }
            );
            return res.json({
                status: false,
                message: `You cannot complete this. Invoice is already ${already.status}`,
            })
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
                where: { qrcode: qrCode }
            })
            if (check.status === 'rejected' || check.status === 'completed') {
                return res.json({ message: `You cannot process because this invoice is already ${check.status}` });
            }
            const invoice = await customerverification.update(
                {
                    status: 'rejected',
                },
                {
                    where: { qrcode: qrCode }
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
        let employeeData;
        if (req.body.employeeId) {
            if (!req.body.date) {
                employeeData = await customerverification.findAll({
                    where: { employeeId: req.body.employeeId }
                });
            }
            else {
                const start = new Date(req.body.date.start);
                const end = new Date(req.body.date.end);
                employeeData = await customerverification.findAll({
                    where: {
                        employeeId: req.body.employeeId,
                        createdAt: {
                            [Op.between]: [start, end]
                        },
                    }
                });
            }
            if (!employeeData) {
                return res.json({ message: 'No data found' })
            }
            let totalTime = 0;

            for (let i = 0; i < employeeData.length; i++) {
                const createdAt = new Date(records[i].createdAt);
                const updatedAt = new Date(records[i].updatedAt);
                const timeDiff = updatedAt.getTime() - createdAt.getTime();
                totalTime += timeDiff;
            }
            const avgTime = totalTime / records.length;
            return res.json(avgTime);
        }
        else {
            return res.json({ message: 'Please enter an employee ID' })
        }
    }
}