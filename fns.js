
/*
 * Funcion numeroAleatorio
 * Genera un numero aleatorio entre el rango especificado
 * Parametros:
 * 		MIN: valor minimo
 *		MAX: valor maximo
 * 
 * Return:
 *		Entero positivo
 */
function numeroAleatorio(MIN, MAX) {
	MIN = MIN || 1;
	MAX = MAX || 6;
	return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

function sleep(seconds) {
	var e = new Date().getTime() + (seconds * 1000);
	while (new Date().getTime() <= e) {}
}