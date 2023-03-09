


const template = (data, type) => {
    console.log(type)
    let template = `
       <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Details</title>
  <link rel="stylesheet" href="style.css">
  <style>
	* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}

header {
  background-color: #333;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

nav ul {
  list-style: none;
  display: flex;
}

nav li {
  margin-right: 1rem;
}

nav a {
  color: #fff;
  text-decoration: none;
}

main {
  padding: 2rem;
}

.invoice-details {
  border: 2px solid #333;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.invoice-details h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.invoice-details table {
  width: 100%;
  margin-top: 2rem;
}

.invoice-details td {
  padding: 1rem;
  border-bottom: 1px solid #333;
}

.invoice-details td:first-child {
  font-weight: bold;
}

.invoice-details::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  width: 0;
  height: 0;
  border-top: 10px solid #fff;
  border-right: 10px solid transparent;
}

.invoice-details::after {
  content: "";
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 0;
  height: 0;
  border-bottom: 10px solid #fff;
  border-left: 10px solid transparent;
}

@media screen and (max-width: 768px) {
  header {
    flex-direction: column;
    text-align: center;
  }
  
  nav {
    margin-top: 1rem;
  }
  
  main {
    padding: 1rem;
  }
  
  .invoice-details {
    padding: 1rem;
  }
}

  </style>
</head>
<body>
  <header>
    <h1>Invoice Details</h1>
  
  </header>
  <main>
    <section class="invoice-details">
      <h2>Invoice</h2>
      <table>
        <tr>
          <td>Invoice ID:</td>
          <td >${data.invoiceId}</td>
        </tr>
        <tr>
          <td>User ID:</td>
          <td >${data.userId}</td>
        </tr>
        <tr>
          <td>Generated At:</td>
          <td >${data.generatedAt}</td>
        </tr>
      </table>
    </section>
  </main>
</body>
</html>`;

    let template2 = `
   <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Animated Message</title>
    <link rel="stylesheet" href="style.css">
    <style>
    * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: sans-serif;
  background-color: #f5f5f5;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

.message {
  position: relative;
  padding: 40px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  animation: bounceInDown 1s ease;
}

.message h1 {
  font-size: 3em;
  margin-bottom: 20px;
  color: #333;
}

.message p {
  font-size: 1.5em;
  margin-bottom: 30px;
  color: #666;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1.2em;
  color: #fff;
  background-color: #333;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #555;
}

@keyframes bounceInDown {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  60% {
    transform: translateY(20%);
  }
  80% {
    transform: translateY(-10%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .message {
    padding: 20px;
  }
  
  .message h1 {
    font-size: 2em;
  }
  
  .message p {
    font-size: 1em;
  }
  
  .btn {
    font-size: 1em;
  }
}

    </style>
  </head>
  <body>
    <div class="container">
      <div class="message">
        <h1>Welcome!</h1>
        <p>${data.message}.</p>
        <a href="#" class="btn">Goto Website</a>
      </div>
    </div>
  </body>
</html>
`;

    if (type === "admin") {
        return template2;
    }
    else {
        return template;
    }
}
module.exports = template;