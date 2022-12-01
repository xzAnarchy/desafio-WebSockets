const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IO } = require('socket.io')
const { engine } = require("express-handlebars")
const path = require("path")
const ProductControler = require("../entregable/controllers/productControler")
const productClass = new ProductControler()

//--------------------------------------------
// instancio servidor, socket y api
const app = express()
const httpServer = new HttpServer(app)
const io = new IO(httpServer)

//--------------------------------------------
// configuro el socket mensajes y productos
const messages = [
    { author: 'Pablo', text: 'Hola, que tal' },
    { author: 'Marcelo', text: 'muy bien y tu?' },
    { author: 'Belen', text: 'Hola!!' }
]
const Products = [
    { title: 'agua', price: 20, thumbnail: 'https://dummyimage.com/250/000/fff'}
]

io.on('connection', socket => {
    console.log('nuevo cliente conectado');

    // Le envio el historial de el array que ya tengo cuando un nuevo cliente se conecte
    socket.emit('message', messages)

    // una vez escuchamos al cliente y recibimos un mensaje, realizamos el envio a todos los demas pusheandolo a un array
    socket.on('new-message', data => {
        messages.push(data)

        // re enviamos por medio broadcast los msn a todos los clientes que esten conectados en ese momento
        io.sockets.emit('message', messages)
    })

    // Le envio el historial de el array que ya tengo cuando un nuevo cliente se conecte
    socket.emit('Products', Products)

    socket.on('new-product', data => {
        Products.push(data)

        io.sockets.emit('Products', Products)
    })

})

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))



//Engine
app.engine(".hbs", engine({
    extname: ".hbs",
    defaultLayout: "tabla-productos.hbs",
    layoutsDir: path.join(__dirname, "/public/plantillas/tabla-productos"),
    partialsDir: path.join(__dirname, "../public/views/partials")
}))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "/public/plantillas"))