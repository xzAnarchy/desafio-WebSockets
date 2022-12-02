// Establecemos la comunicacion del lado del cliente 
const socket = io.connect()

//-------------------------------------------------------------

// Selecciono el form completo y hacemos un preventDefault
const formAgregarProducto = document.getElementById("formAgregarProducto");
formAgregarProducto.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleValue = document.querySelector("input[name=title]").value;
  const priceValue = document.querySelector("input[name=price]").value;
  const thumbnailValue = document.querySelector("input[name=thumbnail]").value;
  const newProduct = {
    title: titleValue,
    price: priceValue,
    thumbnail: thumbnailValue,
  };
  socket.emit('newProduct', newProduct)
});

// Renderizamos los productos en el html

socket.on("Products", async (productos) => {
    const htmlProductos = await makeHtmlTable(productos);
    document.getElementById("productos").innerHTML = htmlProductos;
  });
  
  function makeHtmlTable(productos) {
    return fetch("plantillas/tabla-productos.hbs")
      .then((respuesta) => respuesta.text())
      .then((plantilla) => {
        const template = Handlebars.compile(plantilla);
        const html = template({ productos });
        return html;
      });
  }


//-----------------------------------------------------
// PARTE CHAT WEBSOCKET

const inputUsername = document.getElementById("inputUsername");
const inputMensaje = document.getElementById("inputMensaje");
const btnEnviar = document.getElementById("btnEnviar");

// Selecciono el form completo y procedemos a hacer un prevent default
const formPublicarMensaje = document.getElementById("formPublicarMensaje");
formPublicarMensaje.addEventListener("submit", (e) => {
    e.preventDefault();
    const authorValue = inputUsername.value;
    const date = new Date().toLocaleDateString('es-ES')
    const time = new Date().toLocaleTimeString();
    const textValue = inputMensaje.value;
    const newMessage = {
      author: authorValue,
      date: date + " " + time,
      text: textValue,
    };
    socket.emit("newMessage", newMessage);
    formPublicarMensaje.reset();
  });

  socket.on("message", (mensajes) => {
    const htmlMensajes = makeHtmlList(mensajes);
    document.getElementById("mensajes").innerHTML = htmlMensajes;
  });
  
  function makeHtmlList(mensajes) {
    const html = mensajes
      .map((mensaje) => {
        return `<div><strong style="color:blue;">${
          mensaje.author + " "
        }</strong><span style="color:brown;">${
          mensaje.date + " : "
        }</span><i style="color:green;">${mensaje.text}</i></div>`;
      })
      .join(" ");
    return html;
  }
  
