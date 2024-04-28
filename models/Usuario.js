const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const usuarioEsquema = new mongoose.Schema({
    nombreusuario: { type: String, required: true, unique: true },
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true }
})
//middleware para hashear la constrasena
usuarioEsquema.pre('save', async function (next) {
    if (this.isModified('contrasena')) {
        this.contrasena = await bcrypt.hash(this.contrasena, 10);
    }
    next();
});
// comparar contrasenas
usuarioEsquema.methods.comparePassword = async function (contrasenaEsperada) {
    return await bcrypt.compare(contrasenaEsperada, this.contrasena);
};

const UsuarioModel = mongoose.model('Usuario', usuarioEsquema, 'usuario');
module.exports = UsuarioModel;