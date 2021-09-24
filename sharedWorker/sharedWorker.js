let portList = [];
self.onconnect = function (e) {
  let port = e.ports[0];
  portList.push(port);
  port.onmessage = function (e) {
    let workerResult = e.data;
    portList.forEach(item => {
      // item!=port&&item.postMessage(workerResult);  // 不发给自己
      item.postMessage(workerResult);                 // 发给自己
    });
  };
  port.start();
};
