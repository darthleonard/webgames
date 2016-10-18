var nivel = 1;
var filas = 8;
var columnas = 8;
var numMinas = 12;
var cont = numMinas;
var x0 = 0;
var y0 = 0;
var dx = 10;
var dy = 10;

var mapa = new Array(3);
var mapa2;
var celdasAbiertas = 0;

var canvas;

var ancho = 400;
var alto = 500;

function init() {
	canvas = document.getElementById("myCanvas");
	canvas.addEventListener("mousedown",click,false);

	x0 = canvas.offsetLeft;
	y0 = canvas.offsetTop;

	ajustaNivel(0);
}

function ajustaNivel(_nivel) {

	/*if(!confirm("cambiar nivel?"))
		return;*/

	if(_nivel != 0)
		nivel = _nivel;

	switch(nivel) {
		case 1:
			nivel = 1;
			filas = 8;
			columnas = 8;
			cont = numMinas = 12;
		break;
		case 2:
			nivel = 2;
			filas = 14;
			columnas = 14;
			cont = numMinas = 28;
		break;
		case 3:
			nivel = 1;
			filas = 19;
			columnas = 19;
			cont = numMinas = 52;
		break;
	}

	iniMapa();

	dx = ancho/columnas;
	dy = alto/filas;

	//canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = canvas.width;
	dibujaMapa();
}

function iniMapa() {
	mapa=new Array(columnas);
	mapa2=new Array(columnas);

	for (i = 0; i < filas; i++){
		mapa[i]=new Array(columnas);
		mapa2[i]=new Array(columnas);
	}

	for (i=0; i<filas; i++){
		for (j=0; j<columnas; j++){
			mapa[i][j] = 0;
			mapa2[i][j] = 0;
		}
	}

	colocaMinas();
}

function colocaMinas() {
	lim1 = 0.4;
	lim2 = 0.5;
	flag = 0;

	//console.log("colocando "+cont+" minas");

	for (i=0; i<filas; i++){
		for (j=0; j<columnas; j++){
			if(cont > 0) {
				flag=Math.random();
				if((flag > lim1 && flag < lim2) && mapa[i][j] != -1) {
					mapa[i][j] = -1;
					
					sumaMinas(i-1, j-1); sumaMinas(i, j-1); sumaMinas(i+1, j-1);
					sumaMinas(i-1, j);						sumaMinas(i+1, j);
					sumaMinas(i-1, j+1); sumaMinas(i, j+1); sumaMinas(i+1, j+1);
					
					cont--;
				}
			}
		}
	}
	//console.log("faltan "+cont+" minas por colocar");
	if(cont > 0)
		colocaMinas();
}

function sumaMinas(i,j) {
	if(i<0 || j<0 || i>=columnas || j>=filas || mapa[i][j] == -1)
		return;
	else
		mapa[i][j]++;
}

function validaVictoria() {
	//console.log((filas*columnas)-numMinas +" - "+ celdasAbiertas);
	switch(nivel) {
		case 1:
			if(celdasAbiertas == (filas*columnas)-numMinas)
				alert("Ganador!");
		break;
		case 2:
		break;
		case 3:
		break;
	}
}

function imprimeMapa() {
	str = "";
	for (i=0; i<filas; i++){
		str = "";
		for (j=0; j<columnas; j++){
			str += "["+mapa[i][j]+"]";
		}
		console.log(str);
	}
}

function dibujaMapa() {
	var ctx = canvas.getContext("2d");
	x = 0;
	y = 0;

	for(i=0; i<columnas; i++) {
		ctx.moveTo(x,y);
		ctx.lineTo(x,alto);
		x += dx;
	}

	x = 0;
	y = 0;
	for(i=0; i<filas; i++) {
		ctx.moveTo(x,y);
		ctx.lineTo(ancho,y);
		y += dy;
	}

	for(i=0; i<filas; i++) {
		for(j=0; j<columnas; j++) {
			grd = ctx.createLinearGradient(i*dx,j*dy,(i*dx)+dx,(j*dy)+dy);
			grd.addColorStop(0,"#8ED6FF");
			grd.addColorStop(1,"#004CB3");
			ctx.fillStyle = grd;
			ctx.fillRect(i*dx,j*dy,dx,dy);

			/*
			if(mapa[i][j] == -1) {
				ctx.fillStyle = "#F00";
				ctx.fillRect(i*dx,j*dy,dx,dy);
				ctx.fillStyle = "#000";
			}
			*/

			//ctx.fillText("["+ i + ","+ j + "]",i*dx+(dx/3),j*dy+(dy/2));
			//ctx.fillText(""+mapa[i][j],i*dx+(dx/3),j*dy+(dy/4));

		}
	}

	ctx.stroke();
}

function coord(event) {
	//console.log(event.clientX,event.clientY);
}

function click(e) {
	x = e.pageX-x0;
	y = e.pageY-y0;

	x = Math.floor(x/dx);
	y = Math.floor(y/dy);

	//console.log("click en ("+x+","+y+")");
	if(mapa[x][y] == -1) {
		explotaMina(x,y);
		alert("BOOOMMM!!");
	}else {
		abreCeldas(x,y);
	}
}

var tamFuente=22;
function abreCeldas(x,y) {
	if(x<0 || y<0 || x>=columnas || y>=filas || mapa2[x][y] == 1)
		return
	else {
		if(mapa[x][y]==-1)
			return
		mapa2[x][y] = 1;
		celdasAbiertas++;
		ctx = canvas.getContext("2d");
		ctx.fillStyle = "#BFDFFF";
		ctx.fillRect(x*dx,y*dy,dx,dy);
		ctx.fillStyle = "#BFFFFF";

		ctx.font = "bold "+tamFuente+"px sans-serif";
		ctx.fillStyle = colorNumero(mapa[x][y]);
		txt = (mapa[x][y] != 0) ? ""+mapa[x][y] : "";
		ctx.fillText(txt,x*dx+(dx/3),y*dy+(dy/2)+11);
		//ctx.fillText("["+ x + ","+ y + "]",x*dx+(dx/3),y*dy+(dy/2));

		ctx.stroke();

		if(mapa[x][y] == 0) {
			abreCeldas(x-1, y-1); abreCeldas(x, y-1); abreCeldas(x+1, y-1);
			abreCeldas(x-1, y);						  abreCeldas(x+1, y);
			abreCeldas(x-1, y+1); abreCeldas(x, y+1); abreCeldas(x+1, y+1);
		}
		validaVictoria();
	}
}

function colorNumero(num) {
	switch(num) {
		case 0:
		case 1:
			return "#00F";
		break;
		case 2:
			return "#0F0";
		case 3:
			return "#F00";
		case 4:
			return "#00F";
		case 5:
			return "#0FF";
		case 6:
			return "#FF0";
		case 7:
			return "#F0F";
		case 8:
			return "#000";
		default:
			return "#FFF";
	}
}

function explotaMina(x,y) {
	var audio = document.createElement("audio");
	audio.play();

	/*if (audio != null && audio.canPlayType && audio.canPlayType("audio/mpeg")) {
		audio.src = "exp.mp3";
		audio.play();
	}*/

	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#F00";
	ctx.fillRect(x*dx,y*dy,dx,dy);
	ctx.fillStyle = "#000";
	ctx.stroke();
}