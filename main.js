
//Construimos la class de peliculas
class Pelicula{
   constructor(id, director, titulo, precio, imagen){
      this.id = id,
      this.director = director,
      this.titulo = titulo,
      this.precio = precio,
      this.imagen = imagen
   }
}

const cargarCartelera = async () => {
   const res = await fetch("peliculas.json");
   const data = await res.json();
 
   for (let pelicula of data) {
     let peliculaData = new Pelicula(
       pelicula.id,
       pelicula.director,
       pelicula.titulo,
       pelicula.precio,
       pelicula.imagen
     );
 
     cartelera.push(peliculaData);
   }
   localStorage.setItem("cartelera", JSON.stringify(cartelera));
};
 
// Creamos el array de las peliculas
let cartelera = [];
 
// Función asincrona para cargar la cartelera
const iniciarApp = async () => {
   // Verificar si existe la clave "cartelera" en el storage y evaluamos si hay que crear el array en el storage o capturarla
   if (localStorage.getItem("cartelera")) {
     // Si existe la clave "cartelera" en el storage, se ejecuta este bloque
     console.log("Ya existe la key cartelera");
     cartelera = JSON.parse(localStorage.getItem("cartelera"));
   } else {
     // Si NO existe la clave "cartelera" en el storage, se ejecuta este bloque
     console.log(`ENTRA POR PRIMERA VEZ. SETEAMOS ARRAY`);
     await cargarCartelera(); // Esperar a que se complete la carga de la cartelera
   }
 
   // Llamar a la función para mostrar la cartelera en el DOM
   mostrarCartelera(cartelera);
};
 
// Llamar a la función para iniciar la aplicación
iniciarApp();






//DOM con array de objetos
let precioTotal = document.getElementById("precioTotal");

//Recorremos la cartelera para imprimir en pantalla las peliculas
function mostrarCartelera(array){
   let peliculasDiv = document.getElementById("peliculas")
   peliculasDiv.innerHTML = ``
   for(let pelicula of array ){
      let nuevaPeliculaDiv = document.createElement("div")
      nuevaPeliculaDiv.className = "col-12 col-md-6 col-lg-4 my-2";
      nuevaPeliculaDiv.innerHTML = `<div id="${pelicula.id}" class="card" style="width: 18rem;">
                                    <img class="card-img-top img-fluid" style="height: 200px;" src="assets/${pelicula.imagen}" alt="${pelicula.titulo} de ${pelicula.director}">
                                    <div class="card-body">
                                       <h4 class="card-title">${pelicula.titulo}</h4>
                                       <p>Director: ${pelicula.director}</p>
                                       <p class="">Precio por entrada: ${pelicula.precio}</p>
                                    <button id="agregarBtn${pelicula.id}" class="btn btn-outline-primary">Agregar al carrito una entrada</button>
                                    </div>
                                 </div>`;

      peliculasDiv.appendChild(nuevaPeliculaDiv)

      let agregarBtn = document.getElementById(`agregarBtn${pelicula.id}`)
      console.log(agregarBtn)

      agregarBtn.addEventListener("click", () => {
      console.log(`Se ha agregado una entrada para la pelicula ${pelicula.titulo} en el carrito`)
      agregarAlCarrito(pelicula);
      })
   }
}
mostrarCartelera(cartelera)   



//Agregué luxon para manejo de días de las películas
const DateTime = luxon.DateTime

let fecha = document.getElementById("fecha")
const ahora = DateTime.now()
let fechaMostrar =  ahora.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
  
//Formato:
console.log(ahora.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY))





// Evento que se ejecuta al hacer clic en el botón "Agregar Película" que sirve para sugerir una pelicula que no está
// en la cartelera
const agregarPeliBtn = document.getElementById("agregarPeliBtn");
agregarPeliBtn.addEventListener("click", function (event) {
   event.preventDefault();
   agregarPelicula(cartelera);
});

// Función para sugerir una pelicula
function agregarPelicula(array) {
   let formAgregarPelicula = document.getElementById("formAgregarPelicula");
   const titulo = formAgregarPelicula[0].value;
   const director = formAgregarPelicula[1].value;
   const precio = 0;

   // Validación que todos los espacios del formulario estén completos
   if (titulo.trim() === "" || director.trim() === "" || isNaN(precio)) {
      Swal.fire({
      icon: "error",
      title: "Error",
      text: "Todos los campos son obligatorios",
   });
   return; // No hacemos nada si hay espacios vacíos 
   }

   //Lo pusheamos al array de peliculas
   const peliNueva = new Pelicula(array.length + 1, titulo, director, precio, "cine.jpg");
   array.push(peliNueva);
   mostrarCartelera(array);
   
   // Mostramos alerta de la película fue recomendada exitosamente
   Swal.fire({
      icon: "success",
      title: "¡Película Agregada!",
      text: "La película ha sido agregada exitosamente a nuestras recomendaciones.",
   });
   formAgregarPelicula.reset();
   // Guardamos la cartelera actualizada en el LocalStorage
   localStorage.setItem("cartelera", JSON.stringify(array));
}


// Función para calcular el total de la compra
function calcularTotalCompra(carrito) {
   // Si el carrito está vacío, el total es 0
   if (carrito.length === 0) {
      return 0;
   }
  // Calcular el total sumando los precios de las entradas de las películas en el carrito
  const total = carrito.reduce((accumulator, pelicula) => accumulator + pelicula.precio, 0);
  return total;
}



// Variable para indicar si se realizó una compra exitosa
let compraExitosa = false;
// Deshabilitar el botón de comprar al cargar la página
const comprarBtn = document.getElementById("comprarBtn");
if (comprarBtn) {
  comprarBtn.disabled = true;
}
// Variable para representar el carrito de compras
let carrito = [];
// Cargar el carrito del LocalStorage si existe
if (localStorage.getItem("carrito")) {
  console.log("Ya existe el carrito");
  carrito = JSON.parse(localStorage.getItem("carrito"));
}

  
// Función para agregar entradas de una película al carrito
function agregarAlCarrito(pelicula) {
  let carritoDiv = document.getElementById("carrito");

  // Crear una nueva card para la película
  let nuevaPeliculaDiv = document.createElement("div");
  nuevaPeliculaDiv.className = "card";
  nuevaPeliculaDiv.innerHTML = `
     <img class="card-img-top" src="assets/${pelicula.imagen}" alt="${pelicula.titulo} de ${pelicula.director}">
     <div class="card-body">
        <h5 class="card-title">${pelicula.titulo}</h5>
        <p class="card-text">Director: ${pelicula.director}</p>
        <p class="card-text">Precio por entrada: ${pelicula.precio}</p> 
     </div>`;

  carritoDiv.appendChild(nuevaPeliculaDiv);
  carritoDiv.style.display = "block"; // Mostramos el carrito

   //Agregar las entradas al carrito y actualizamos el LocalStorage
  carrito.push(pelicula);
  localStorage.setItem("carrito", JSON.stringify(carrito));

   //Habilitamos el botón de comprar cuando se agregan entradas al carrito
  comprarBtn.disabled = false;

  Toastify({
   text: "Se han agregado entrada/s al carrito",
   duration: 2000, 
   gravity: "top", 
   style: {
      background: "grey", 
      color: "#fff", 
    }, 
   }).showToast();
}

  
  

// Evento que se ejecuta cuando el botón de comprar es clickeado
if (comprarBtn) {
   comprarBtn.addEventListener("click", () => {
      // Verificar si el carrito está vacío antes de realizar la compra
      let carritoDiv = document.getElementById("carrito");
      if (carritoDiv.innerHTML.trim() === '') {
         // Mostrar alerta de carrito vacío utilizando SweetAlert2
         Swal.fire({
         icon: 'error',
         title: 'Carrito vacío',
         text: 'Agrega entradas al carrito antes de comprar.',
      });
         return; // Detener la compra si el carrito está vacío
}

     
// Calcular el total de la compra actualizado
const totalCompra = calcularTotalCompra(carrito);


// Mostrar el mensaje de compra exitosa
Swal.fire({
   icon: 'success',
   title: 'Compra exitosa',
   text: `¡Que disfrutes la función! El total es de ${totalCompra} pesos`,
});

// Vaciar el carrito en el LocalStorage después de la compra
carrito = [];
localStorage.setItem("carrito", JSON.stringify(carrito));

// Deshabilitar el botón de comprar después de la compra exitosa
   comprarBtn.disabled = true;
   compraExitosa = true;

// Ocultar y vaciar el carrito
   carritoDiv.style.display = "none";
   carritoDiv.innerHTML = '';
});
}


// Evento que se ejecuta cuando el botón de cancelar compra es clickeado
const cancelarCompraBtn = document.getElementById("cancelarCompraBtn");
   if (cancelarCompraBtn) {
      cancelarCompraBtn.addEventListener("click", () => {
      // Deshabilitar el botón de comprar solo si no se realizó una compra exitosa
   if (!compraExitosa) {
      comprarBtn.disabled = true;
}

// Vaciar y ocultar el carrito
let carritoDiv = document.getElementById("carrito");
   carritoDiv.innerHTML = '';
      carritoDiv.style.display = "none";
});
}


//ordenar array por criterio
let selectOrden = document.getElementById("selectOrden")
  
selectOrden.addEventListener("change", () => {
   console.log(selectOrden.value)
   switch(selectOrden.value){
      case "1":
         ordenarMayorMenor(cartelera)
      break
      case "2":
         ordenarMenorMayor(cartelera)
      break
      case "3":
         ordenarAlfabeticamenteTitulo(cartelera)
      break
      default:
         mostrarCatalogo(cartelera)
      break
   }
}
)

function ordenarMenorMayor(array){
   const menorMayor = [].concat(array)
   console.log(menorMayor)
   menorMayor.sort((a,b) => a.precio - b.precio)
   mostrarCartelera(menorMayor)
   }
    
function ordenarMayorMenor(array){
   const mayorMenor = [].concat(array)
   mayorMenor.sort((elem1 ,elem2) => elem2.precio - elem1.precio)
   mostrarCartelera(mayorMenor)
}
    
function ordenarAlfabeticamenteTitulo(array){
   const arrayAlfabetico = [].concat(array)
   arrayAlfabetico.sort( (a,b) =>{
      if (a.titulo > b.titulo) {
         return 1
      }
      if (a.titulo < b.titulo) {
         return -1
      }
         return 0
})
   mostrarCartelera(arrayAlfabetico)
}