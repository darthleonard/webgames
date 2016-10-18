
// true:jugador - false:pc
var turno = true;
var ronda = 3;
var total = 0;
var max = 0;
var flagDados = false;
var inGame = false;

function TiraDados(ronda) {
	var numeros = new Array();
	if(ronda==3) {
		numeros[0] = numeroAleatorio();
		numeros[1] = numeroAleatorio();
		numeros[2] = numeroAleatorio();
	} else if(ronda == 2) {
		numeros[0] = numeroAleatorio();
		numeros[1] = numeroAleatorio();
	}else
		numeros[0] = numeroAleatorio();

	return numeros;
}

function seleccionaNumero(op) {
	if(!inGame) {
		alert('Da click a "iniciar juego"');
		return;
	}

	if(!turno) {
		alert("espera tu turno");
		return;
	}

	if(!flagDados) {
		alert("Tira los dados");
		return;
	}

	var pts = document.getElementById("humano_puntos");
	var elem;
	var val;
	switch(op) {
		case 1:
			elem = document.getElementById("humano_d1");
			elem.style = "border: 2px dotted;";
			document.getElementById("humano_d2").style = "border: 1px solid;";
			document.getElementById("humano_d3").style = "border: 1px solid;";
			break;
		case 2:
			elem = document.getElementById("humano_d2");
			elem.style = "border: 2px dotted;";
			document.getElementById("humano_d1").style = "border: 1px solid;";
			document.getElementById("humano_d3").style = "border: 1px solid;";
			break;
		case 3:
			elem = document.getElementById("humano_d3");
			elem.style = "border: 2px dotted;";
			document.getElementById("humano_d1").style = "border: 1px solid;";
			document.getElementById("humano_d2").style = "border: 1px solid;";
			break;
	}

	val = parseInt(elem.innerHTML);
	mensaje("Has seleccionado el numero " + val);
	if(isNaN(val)) {
		alert("opcion no valida");
		document.getElementById("humano_d1").style = "border: 1px solid;";
		document.getElementById("humano_d2").style = "border: 1px solid;";
		document.getElementById("humano_d3").style = "border: 1px solid;";
		return;
	}

	max = val;
	total = parseInt(pts.innerHTML);
	total += max;
	pts.innerHTML = total;
	flagDados = false;
	ronda--;

	if(validaGanador(total, "Jugador"))
		endGame();
	
	if(inGame) {
		if(ronda == 0) {
			document.getElementById("izquierda").className = "";
			document.getElementById("derecha").className = "en-turno";

			document.getElementById("humano_d1").innerHTML = " - ";
			document.getElementById("humano_d2").innerHTML = " - ";
			document.getElementById("humano_d3").innerHTML = " - ";
			turno = false;

			var millisecondsToWait = 2000;
			setTimeout(function() {
				juegaPC();
			}, millisecondsToWait);
		}
	}

	if(ronda > 0)
		mensaje("tira los dados nuevamente");
	else
		mensaje("es turno de PC");

}

function Tira() {
	if(!inGame) {
		alert('Da click a "iniciar juego"');
		return;
	}
	if(!turno) {
		alert("espera tu turno");
		return;
	}

	if(flagDados) {
		mensaje("Selecciona uno dado antes de tirar otra vez");
		alert("Selecciona uno dado antes de tirar otra vez");
		return;
	}

	var cp1 = document.getElementById("humano_d1");
	var cp2 = document.getElementById("humano_d2");
	var cp3 = document.getElementById("humano_d3");

	cp1.style = "border: 1px solid;";
	cp2.style = "border: 1px solid;";
	cp3.style = "border: 1px solid;";

	var div_ronda = document.getElementById("ronda");
	div_ronda.innerHTML = ronda;

	dados = TiraDados(ronda);
	cp1.innerHTML = dados[0];
	if(dados[1] != undefined) cp2.innerHTML = dados[1];
	else cp2.innerHTML = " - ";
	if(dados[2] != undefined) cp3.innerHTML = dados[2];
	else cp3.innerHTML = " - ";

	premio = premiaTiro(dados);
	if(premio != -1) {
		var pts = document.getElementById("humano_puntos");
		mensaje("has ganado " + premio + " puntos!");
		total += premio;
		pts.innerHTML = total;
		ronda--;
		return;
	}

	flagDados = true;

	if(ronda > 0)
		mensaje("Selecciona un dado");
}

function juegaPC() {
	mensaje("turno de PC");
	var numeros;
	var cp1 = document.getElementById("pc_d1");
	var cp2 = document.getElementById("pc_d2");
	var cp3 = document.getElementById("pc_d3");
	var pts = document.getElementById("pc_puntos");

	ronda = 3;
	total = parseInt(pts.innerHTML);

	while(ronda >=1) {
		mensaje("PC esta en su ronda " + ronda);
		max = 1;
		dados = TiraDados(ronda);
		cp1.innerHTML = dados[0];

		if(dados[1] != undefined)
			cp2.innerHTML = dados[1];
		else
			cp2.innerHTML = " - ";
		if(dados[2] != undefined)
			cp3.innerHTML = dados[2];
		else
			cp3.innerHTML = " - ";

		premio = premiaTiro(dados);
		if(premio != -1) {
			mensaje("PC ha ganado " + premio + " puntos!");
			alert("PC ha ganado " + premio + " puntos!");
			total += premio;

			if(validaGanador(total,"PC")) {
				endGame();
				break;
			}

			ronda--;
			continue;
		}


		for(i=0; i<dados.length; i++) {
			if(dados[i] > max)
				max = dados[i];
		}

		//numeros = dados[0]+","+dados[1]+","+dados[2];
		numeros = dados[0];

		if(dados[1] === undefined) {
			numeros += "";
		}else
			numeros += ","+numeros[1];

		if(dados[2] === undefined)
			numeros += "";
		else
			numeros += ","+numeros[2];

		mensaje("PC obtubo los numeros ["+numeros+"] y ha escogido el "+max);

		total += max;
		pts.innerHTML = total;
		ronda--;
	}

	if(validaGanador(total,"PC"))
		endGame();

	turno = true;
	ronda = 3;

	mensaje("PC ha terminado, es turno de Jugador");

	document.getElementById("izquierda").className = "en-turno";
	document.getElementById("derecha").className = "";

	mensaje("tira los dados");
}

function premiaTiro(dados) {
	if(dados.length == 1)
		return -1;

	cont = 0;
	aux = 0;
	for(i=0; i<dados.length; i++) {
		for(j=0; j<dados.length; j++) {
			if(i==j)
				continue;
			if(dados[i] == dados[j]) {
				aux=dados[i];
				cont++;
			}
		}
	}

	if(cont == 2)
		return 15;

	if(cont == 6)
		return 30;

	return -1;
}

function validaGanador(puntos, jugador) {
	if(puntos >= 100) {
		tab = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		mensaje(tab+"GANADOR: "+jugador+"<br>"+tab+"CON: "+puntos+" PUNTOS!");
		alert("GANADOR: "+jugador+"\nCON: "+puntos+" PUNTOS!");
		return true;
	}
	return false;
}

function startGame() {
	mensaje("iniciando juego...");
	document.getElementById("izquierda").className = "en-turno";
	document.getElementById("derecha").className = "";
	document.getElementById("btnJugar").style = "display:none";
	document.getElementById("pc_d1").innerHTML = " - ";
	document.getElementById("pc_d2").innerHTML = " - ";
	document.getElementById("pc_d3").innerHTML = " - ";
	document.getElementById("humano_d1").innerHTML = " - ";
	document.getElementById("humano_d2").innerHTML = " - ";
	document.getElementById("humano_d3").innerHTML = " - ";
	document.getElementById("humano_puntos").innerHTML = "0";
	document.getElementById("pc_puntos").innerHTML = "0";
	document.getElementById("ronda").innerHTML = " - ";
	inGame = true;
	mensaje("Es tu turno, tira los dados");
}

function endGame() {
	document.getElementById("btnJugar").style = "display:inline";
	inGame = false;
	mensaje("Clic en iniciar juego!");
}


function mensaje(texto, op) {
	var consola = document.getElementById('consola');
	consola.innerHTML = consola.innerHTML+"<br>"+texto;
	consola.scrollTop = consola.scrollHeight;
}

/*function mensaje(texto,flag) {
	var consola = document.getElementById('consola');
	consola.innerHTML = consola.innerHTML+"<br>"+texto;

	if(consola.scrollTop + consola.offsetHeight >= consola.scrollHeight)
		consola.scrollTop = consola.scrollHeight - consola.offsetHeight;
}*/