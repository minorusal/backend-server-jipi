/*
 * Función de calculo de dias de instalacion
 * param: nm number (Especifica el número de modulos)
 * param: ins number (Especifica el numero de tecnicos)
 * return di number (especifica el numero de dias de instalación)
 */
let diaInstalacion = async(nm, ins) => {
    var di = 0;
    var mdp = 1.14;
    di = nm / (mdp * ins);
    return di;
};

/*
 * Función de calculo de area
 * param: b number (espesifica la base)
 * param: h number (Especifica la altura)
 * return di number (especifica el numero de dias de instalación)
 */
let getArea = async(b, h) => {
    var a = 0;
    a = b * h;
    return a;
}

/*
 * Función que simplifica console.log()
 * param: object any
 * return debug any
 */
let debug = async(object) => {
    let debug = console.log(object);
    return debug;
}