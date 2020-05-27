const formidable = require('formidable'); //引用外部库
const sql = require('mysql');
const fs = require('fs');
const path = require('path');

const connection = sql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'photo'
});

exports.upload = function(request, response) {

  const form = formidable({multiples: true}); //创建实例

  const fullUrl = request.protocol + '://' + request.get('host');

  form.parse(request, (err, fields, files) => {
    if (err) {
      console.log(err);
      let code = '1';
      response.json({err, code});
    }

    let result = [];
    let values = {};
    let fileName = '';
    // response.json({fields, files, code});
    if (files.photos.length >=2) {
      files.photos.forEach(n => {

        fileName = Date.now() + '_' +n.name;

        fs.copyFileSync(n.path, path.resolve(__dirname, 'public/' + fileName));

        values = {
          url: fullUrl + '/' + fileName,
          name: fileName,
          upload_date: new Date(),
        };
        result.push(values);
      });

      console.log(result);

      let str = '';
      result.forEach((n, index) => {

        if (index == result.length - 1) {
          str += `('${n.url}', '${n.name}');`
        } else {
          str += `('${n.url}', '${n.name}'),`
        }
      });

      let sql = `
      INSERT INTO lists
        (url, name)
      VALUES
        ${str}
      `;

      console.log(sql);

      connection.query(sql, function(error, res) {
        if (error) console.log(error);

        response.write(JSON.stringify(result));

        response.end();
      });
    } else {
      fileName = Date.now() + '_' + files.photos.name;
      fs.copyFileSync(files.photos.path, path.resolve(__dirname, 'public/' + fileName));

      values = {
        url: fullUrl + '/' + fileName,
        name: fileName,
        upload_date: new Date(),
      };
      connection.query('INSERT INTO lists SET ?', values, function (error, res) {
        if (error) console.log(error);
        result.push(values);

        response.write(JSON.stringify(result));

        response.end();
      })
    }
  })
};