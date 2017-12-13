var urlWeather = "https://api.openweathermap.org/data/2.5/forecast/daily?q=Madrid&units=metric&appid=479092b77bcf850403cb2aeb1a302425";

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

var diasSemana=['SUN','MON','TUE','WED','THU','FRI','SAT'];
var meses=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

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

    mostrarDatosCortos(){
      console.log(this.icono);
      return "<tr><td><a href=\"javascript:mostrarDatos("+this.dia+")\">"+diasSemana[this.dia]+", "+meses[this.mes]+" "+
      this.diaNum+" - "+this.tiempo.toUpperCase()+" - "+this.tempMax+"/"+this.tempMin+"</a></td></tr>";
    }

    mostrarDatosLargos(){
    return  "<div id=\"pA\"><div id=\"pI\"><p>"+diasSemana[this.dia]+"<br>"+meses[this.mes]+" "+this.diaNum+"</p><br><p class=\"max\">"+
            this.tempMax+"</p><br><p class=\"min\">"+this.tempMin+"</p></div><div id=\"pD\"><img class=\"imgTiempo\" src=\"http://openweathermap.org/img/w/"+this.icono+".png\"/><p>"+this.tiempo.toUpperCase()+
            "</p></div></div><div id=\"pB\"><p>HUMIDITY: "+this.humedad+"%<br>WIND: "+this.viento+"Km/H NW<br>PRESSURE: "+this.presion+
            "hPa</p></div>";
    }
}

var arrayTiempos = [];

getJSON(urlWeather).then(function(data) {
  var semana="<th><img src=\"img/Sol.png\"/><h1>Forecast</h1></th>";
  for(let i=0; i< data.list.length;i++)   {
    date = new Date(data.list[i].dt*1000);
     arrayTiempos.push(new Tiempo(date.getDay(),date.getMonth(),date.getDate(),data.list[i].weather[0]['main'],
                      data.list[i].temp['max'],data.list[i].temp['min'],data.list[i]['humidity'],
                      data.list[i]['speed'],data.list[i]['pressure'],data.list[i].weather[0].icon)); 
  semana+=arrayTiempos[i].mostrarDatosCortos();}

  document.getElementById("semana").innerHTML = semana;
  }, function(status) {
  alert('Algo fue mal.');
});

function mostrarDatos(dia){

  var seasons = ["Winter", "Winter","Spring", "Spring", "Spring","Summer", "Summer", "Summer","Fall", "Fall", "Fall","Winter"];
  var temporada = ;

    document.getElementById("semana").style.display="none";
    document.getElementById("dia").style="background-image:url(\"img/Fall.jpg\")";
  for(var i in arrayTiempos){
  if(dia==arrayTiempos[i]['dia']){
    document.getElementById("contenido").innerHTML=arrayTiempos[i].mostrarDatosLargos();
    break;
    }
  }
}

function mostrarSemana(){
    document.getElementById("semana").style.display="";
    document.getElementById("dia").style.display="none";
    document.getElementById("contenido").innerHTML="";
}
