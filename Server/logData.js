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

const logsData = (reqUrl, Inputmessage) =>{
    const logData =   [{ timestamp: new Date(), level: 'INFO', message: Inputmessage, source: 'AuthService', req_url: reqUrl }];
    worksheet.addRows(logData);

    workbook.xlsx.writeFile('logs.xlsx')
        .then(() => {
            console.log('Excel file created successfully!');
        })
        .catch(err => {
            console.error('Error creating Excel file:', err);
        });
}

export default logsData()