const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.static('dedicatedWorker'));

app.use(express.static('postMessage'));

app.use(express.static('sharedWorker'));

app.use(express.static('serviceWorker'));
