const express = require('express');
const path = require('node:path');

const app = express();
//app.use(express.static('dist/inia-web'));
app.use(express.static(`${__dirname}/dist/inia-web`));
app.get('/*', (req, res,next) => {
    // res.redirect('/');
    res.sendFile(path.join(`${__dirname}/dist/inia-web/index.html`));
});
// app.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname + '/dist/your-app-name/index.html'));
// });

app.listen(process.env.PORT || 8080);






