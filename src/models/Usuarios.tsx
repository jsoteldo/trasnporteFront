class Usuarios {
	//
	_id: string;
	nombre_usuario: string;
	email: string;
	contrasenia: string;
	token: string;

	constructor(token: string, id: string, nombre_usuario: string,	email: string, contrasenia: string) {
		//
		this._id = id;
		this.nombre_usuario = nombre_usuario;
		this.email = email;
		this.contrasenia = contrasenia;
		this.token = token;
	}
}

export default Usuarios;