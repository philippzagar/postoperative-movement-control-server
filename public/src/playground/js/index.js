let socket = io.connect('https://zagar.spdns.org');

socket.on('connect', function () {
    console.log("Connected!");
});

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});