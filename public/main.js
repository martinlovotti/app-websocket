const socket = io();
const title = document.getElementById("title"),
  price = document.getElementById("price"),
  thumbnail = document.getElementById("thumbnail");

const renderProducts = (products) => {
  if (products) {
    const html = products
      .map((product) => {
        return `<tr>
                  <th scope="row">${product.id}</th>
                  <td>${product.title}</td>
                  <td>${product.price}</td>
                  <td style="width: 100px;"><img class="w-100" src="${product.thumbnail}"></td>
                </tr>`;
      })
      .join(" ");
    document.querySelector("tbody").innerHTML = html;
  }
};

const renderMessages = (messages) => {
  if (messages) {
    const html = messages
      .map((message) => {
        return `<p style="color: green; margin: 0;">
                  <strong style="color: blue;">${message.mail}</strong>
                  <span style="color: red;">[${message.date}]</span>
                  : ${message.text}
                </p>`;
      })
      .join(" ");
    document.getElementById("messageList").innerHTML = html;
  }
};

socket.on("products", (products) => renderProducts(products));
socket.on("messages", (messages) => renderMessages(messages));

const addNewProduct = (e) => {
  e.preventDefault;
  if (title.value && price.value && thumbnail.value) {
    let newProduct = {
      title: title.value,
      price: price.value,
      thumbnail: thumbnail.value,
    };
    socket.emit("new-product", newProduct);
    title.value = "";
    price.value = "";
    thumbnail.value = "";
  }
  return false;
};

document.getElementById("messageButton").addEventListener("click", () => {
  const mail = document.getElementById("mail").value;
  const text = document.getElementById("mensaje").value;
  const date = new Date().toLocaleString();
  let newMessage = {
    mail: mail,
    text: text,
    date: date,
  };
  socket.emit("new-message", newMessage);
  text.value = "";
});