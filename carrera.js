//función para crear el array que solicita el punto 2 de la Actividad y colocar los coches participantes
function inicializarArrayCoches() {
  // guardo el "value" del nº de participantes seleccionado en el desplegable,
  // y uso el método parseInt para convertilo en un nº entero y así poder indexar el array
  const numPart = parseInt($("#numPart").val());
  console.log("Creando array, num. elementos:" + numPart);
  //creo un array con una longitud igual al nº de participantes seleccionado
  let arrayCoches = new Array(numPart);

  //para eliminar todos los posibles coches después de recargar la web.
  $(".imgCar").remove();
  $(".posicion").remove();

  //recorro todas las posiciones del array, teniendo en cuenta que la primera es "0"
  for (let i = 0; i < numPart; i++) {
    //genero un string con el código html del <div> para un coche "car(i+1)"
    const carHtml = `<div class="carril"><img class="imgCar" id="car${
      i + 1
    }" src="car${i + 1}.png" /><b id="carPos${
      i + 1
    }" class="posicion" style="color: white;"><b></div>`;

    // creo un array de objetos json "coche" donde mantendre el estado de la app
    // teniendo en cuenta, entre otras cosas, que la primera imagen será "i+1"
    arrayCoches[i] = {
      id: `#car${i + 1}`,
      html: carHtml,
      img: "car" + (i + 1) + ".png",
      avance: 0,
      posicion: 0,
      metaAlcanzada: false,
    };

    // anñadoe al div pista el elemnto html generado anteriormete que
    // sera la base para la animación
    $("#pista").append(arrayCoches[i].html);
  }
  console.log(arrayCoches);

  return arrayCoches;
}

//función para fijar la meta y poner en funcionamiento los coches
function carrera(coches) {
  // fijo la meta justo antes de poner en funcionamiento los coches para evitar que entre la
  // declaración del valor de meta y el inicio de la carrera haya algún cambio en la pantalla que
  // altere la llegada de los coches. La fijo calculando el ancho de la pista y restanto el valor 100.
  const meta = $("#pista").width() - 100;
  console.log("meta: ", meta);

  // en este array mantendremos el status de carrera, está terminará cuando todos sus
  // elementos sean true
  let metasAlcanzadas = [];

  // contador para seguir la posicion en la que termina cada coche
  let posicion = 1;

  // iniciamos un bucle du while, ya que la primera ejecución siempre será necesaria
  // este terminara cuando todos los elementos del array metasAlcanzadas sean verdaderos
  // para ello utilizamos every
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
  do {
    // cada vez que entramos en una de las vueltas inicializamos el array de finalizados
    metasAlcanzadas = [];

    // recorreroremos cada uno de los elementos del array de coches mientras que la
    // carrera no finalze
    $.each(coches, function (_, jsonCoche) {
      // obtenemos el avance del coche de forma aleatoria (en pixeles)
      const avance = Math.floor(Math.random() * 100) + 50;

      // este avance lo sumaremos al que tengamos previamente en el objeto
      let avanceTurno = jsonCoche.avance + avance;

      // aquí he preferido usar el ternary operator para determinar si se ha alcanzado el final
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
      jsonCoche.metaAlcanzada = avanceTurno >= meta ? true : false;

      if (jsonCoche.metaAlcanzada) {
        // en caso de que que ya hayamos alcanzado la meta solo avanzaremos hasta
        // esa posición, de esta forma evitaremos el desborde
        avanceTurno = meta;

        // guardamos la posición en la que ha quedado siempre y cuando esta
        // propiedad este a cero en el objeto
        if (jsonCoche.posicion === 0) {
          jsonCoche.posicion = posicion;
          console.log(jsonCoche);
          posicion += 1;
        }
      }

      console.log(
        jsonCoche.id,
        meta,
        avanceTurno,
        jsonCoche.metaAlcanzada,
        `${jsonCoche.avance + avance}px`
      );

      // realizanos la animación
      $(jsonCoche.id).animate(
        {
          "margin-left": `${avanceTurno}px`,
        },
        {
          duration: 500,
        }
      );

      // actualizamos el avance
      jsonCoche.avance += avance;

      // añadimos el estado al array de metas
      metasAlcanzadas.push(jsonCoche.metaAlcanzada);
    });
  } while (!metasAlcanzadas.every(Boolean));

  // esperamos a que finalizen las animaciones
  setTimeout(function () {
    console.log("FINN");
    $.each(coches, function (i, jsonCoche) {
      $(`#carPos${i + 1}`).text(jsonCoche.posicion);
    });
  }, 8000);
}

$(document).ready(function () {
  // nada mas cargar necesitamos establecer el array de coches en base al
  // valor seleccionado
  var coches = inicializarArrayCoches();

  // ocultamos el boton de reinicio
  $("#reiniciar").hide();

  // en caso de que seleccionemos otro valor deberemos restablecer nuestro array
  $("#numPart").on("change", function () {
    coches = inicializarArrayCoches();
  });

  $("#iniciar").click(function () {
    // al pulsar iniciar inmediatamente lo ocultamos
    $(this).hide();
    // y mostramos el de reiniciar
    $("#reiniciar").show();
    // llamamos a la funcion que lanza la carrera
    carrera(coches);
  });

  $("#reiniciar").click(function () {
    // al pulsar reiniciar inmediatamente lo ocultamos
    $(this).hide();
    // y mostramos el de reiniciar
    $("#iniciar").show();
    // paramos la animacion en base a la class
    $(".imgCar").stop();
    // llamamos a la funcion de inicializacion
    coches = inicializarArrayCoches();
  });
});
