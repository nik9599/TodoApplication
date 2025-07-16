import http from 'http';
import ExcelJS from'exceljs';
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Log Data');

worksheet.columns = [
    { header: 'Timestamp', key: 'timestamp', width: 20 },
    { header: 'Level', key: 'level', width: 10 },
    { header: 'Message', key: 'message', width: 50 },
    { header: 'Source', key: 'source', width: 20 },
    {header: 'Req_url', key: 'req_url', width: 20 },
];

const myServer = http.createServer((req, res) => {

    const logData =   [{ timestamp: new Date(), level: 'INFO', message: 'User logged in data', source: 'AuthService', req_url: req.url }];
    worksheet.addRows(logData);

    workbook.xlsx.writeFile('logs.xlsx')
        .then(() => {
            console.log('Excel file created successfully!');
        })
        .catch(err => {
            console.error('Error creating Excel file:', err);
        });
    res.end('Hello World!');
})


myServer.listen(8000, ()=>{
    console.log('Server is running');
});