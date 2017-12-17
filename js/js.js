var urlWeather = "http://api.openweathermap.org/data/2.5/forecast?id=3117732&units=metric&appid=9a8f7d4a64db74991bc1ed8682853bda";

var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};


// Creamos unos array que luego usaremos para imprimir el dia de la semana o el mes
var diasSemana=['SUN','MON','TUE','WED','THU','FRI','SAT'];
var meses=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];


// Creamos un objeto Tiempo donde introduciremos todos los dias con sus respectivos datos
class Tiempo {
    constructor(dia,mes,diaNum,tiempo,tempMax,tempMin,humedad,viento,presion,icono){
      this.dia=dia;
      this.mes=mes;
      this.diaNum=diaNum;
      this.tiempo=tiempo;
      this.tempMax=tempMax;
      this.tempMin=tempMin;
      this.humedad=humedad;
      this.viento=viento;
      this.presion=presion;
      this.icono=icono;
    }


// Este método muestra los datos de la primera "página" donde solo salen unos pocos datos del día
    mostrarDatosCortos(){
      return "<tr><td><a href=\"javascript:mostrarDatos("+this.dia+")\">"+diasSemana[this.dia]+", "+meses[this.mes]+" "+
      this.diaNum+" - "+this.tiempo.toUpperCase()+" - "+this.tempMax+"ºC/"+this.tempMin+"ºC</a></td></tr>";
    }

// Este método muestra datos más específicos del día que seleccione el usuario
    mostrarDatosLargos(){
    return  "<div id=\"pA\"><div id=\"pI\"><p>"+diasSemana[this.dia]+"<br>"+meses[this.mes]+" "+this.diaNum+"</p><br><p class=\"max\">"+
            this.tempMax+"ºC</p><br><p class=\"min\">"+this.tempMin+"ºC</p></div><div id=\"pD\"><img class=\"imgTiempo\" src=\"http://openweathermap.org/img/w/"+this.icono+".png\"/><p>"+this.tiempo.toUpperCase()+
            "</p></div></div><div id=\"pB\"><p>HUMIDITY: "+this.humedad+"%<br>WIND: "+this.viento+"Km/H NW<br>PRESSURE: "+this.presion+
            "hPa</p></div>";
    }
}

// Creamos un array donde introduciremos todos los objetos Tiempo
var arrayTiempos = [];

getJSON(urlWeather).then(function(data) {
  // Empezamos a definir los valores de la tabla 
  var semana="<th><img src=\"img/Sol.png\"/><h1>Forecast</h1></th>";
  // Creamos un contador para recorrer el array de objetos
  var cont=0;
  // Recorremos el JSON de 8 en 8 para que salga el dia siguiente a la misma hora 5 veces
  for(let i=0; i< data.list.length;i=i+8)   {
    date = new Date(data.list[i].dt*1000);
     arrayTiempos.push(new Tiempo(date.getDay(),date.getMonth(),date.getDate(),data.list[i].weather[0]['main'],
                      data.list[i].main['temp_max'],data.list[i].main['temp_min'],data.list[i].main['humidity'],
                      data.list[i].wind['speed'],data.list[i].main['pressure'],data.list[i].weather[0].icon)); 
  // Introducimos en la variable "semana" el metodo del objeto Tiempo que devuelve una fila de la tabla con los datos
  semana+=arrayTiempos[cont].mostrarDatosCortos();cont++;}

  // Mediante DOM introducimos todo lo escrito en semana a la tabla escrita en index
  document.getElementById("semana").innerHTML = semana;
  }, function(status) {
  alert('Algo fue mal.');
});


// Creamos una funcion para cuando haga click en un dia de la semana muestre los valores de dicho dia
function mostrarDatos(dia){

// Voy a crear un array para que dependiendo del mes del año salga una foto de fondo
 var seasons = ["Winter", "Winter","Spring", "Spring", "Spring","Summer", "Summer", "Summer","Fall", "Fall", "Fall","Winter"];

 // Introducimos en temporada que foto deberiamos enseñar
 var temporada = seasons[(new Date()).getMonth()];

// Escondemos la tabla semana para que aparezca la descripcion del dia seleccionado
    document.getElementById("semana").style.display="none";

// Le asignamos al elemento del id "dia" el estilo de un fondo de una imagen
// Antes este elemento estaba oculto pero al no decir nada de "display" el dia se muestra
    document.getElementById("dia").style="background-image:url(\"img/"+temporada+".jpg\")";

    // Buscamos en el array de objetos el día que ha seleccionado el usuario mediante el parámetro introducido a esta función
  for(var i in arrayTiempos){
  if(dia==arrayTiempos[i]['dia']){
    // Cuando lo encontremos introducimos al elemento "contenido" los datos extensos de dicho dia
    document.getElementById("contenido").innerHTML=arrayTiempos[i].mostrarDatosLargos();
    break;
    }
  }
}

// Creamos una funcion para cuando quiera volver el usuario a ver la tabla de días
function mostrarSemana(){
  // Cogemos el elemento "semana" y lo mostramos otra vez
    document.getElementById("semana").style.display="";
    // Ocultamos el elemento día
    document.getElementById("dia").style.display="none";
    // Y dejamos vacío el elemento contenido, no lo borramos porque habría que crearlo de nuevo
    document.getElementById("contenido").innerHTML="";
}
