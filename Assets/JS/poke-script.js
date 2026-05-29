// Función para la fecha
function tiempo() {
    var date = new Date();
    return date + " SV";
}

// Definir imagen
var img = new Image();
img.src = 'Assets/IMG/pokebank.jpg';

// Cargar o inicializar usuario desde localStorage
var usuario = JSON.parse(localStorage.getItem('usuarioPokemon'));

if (!usuario) {
    // Si no existe en localStorage, crear el usuario por defecto
    usuario = {
        name: 'Eduardo Castro',
        pin: '1234',
        cuenta: '0487654521',
        fondos: 700,
        historial: []
    };
    // Guardar en localStorage
    localStorage.setItem('usuarioPokemon', JSON.stringify(usuario));
}

// Función para guardar cambios en localStorage
function guardarUsuario() {
    localStorage.setItem('usuarioPokemon', JSON.stringify(usuario));
}

// Módulo AngularJS
var app = angular.module('pokeBank', []);

app.controller('pokeController', ['$scope', function ($scope) {
    const vm = this;

    // Inicializar datos del usuario (cargar desde localStorage)
    vm.persona = usuario;
    vm.cant_depo = null;
    vm.cant_retiro = null;
    vm.NIC = null;
    vm.monto_energia = null;
    vm.NPE = null;
    vm.monto_agua = null;
    vm.telefono = null;
    vm.monto_telefono = null;

    // FUNCIÓN DEPOSITAR
    vm.depositar = function () {
        console.log("Función depositar ejecutada");

        if (!vm.cant_depo || vm.cant_depo <= 0) {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'Por favor ingresa una cantidad válida para depositar',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        // Generar PDF (opcional)
        try {
            if (typeof jsPDF !== 'undefined') {
                var doc = new jsPDF();
                try {
                    if (img && img.src) {
                        doc.addImage(img, 'JPG', 150, 10, 40, 20);
                    }
                } catch (e) {
                    console.log("Imagen no disponible");
                }
                doc.text("Hola " + usuario.name, 25, 25);
                doc.text("Has depositado $" + vm.cant_depo + " a la Poke-Cuenta numero " + usuario.cuenta, 25, 50);
                doc.text(tiempo(), 25, 65);
                doc.save("PokeDeposito.pdf");
            }
        } catch (error) {
            console.error("Error al generar PDF:", error);
        }

        // Actualizar fondos
        var montoDeposito = parseFloat(vm.cant_depo);
        usuario.fondos = parseFloat(usuario.fondos) + montoDeposito;
        vm.persona.fondos = usuario.fondos;

        // Guardar en localStorage
        guardarUsuario();

        // Agregar al historial
        usuario.historial.push({
            tipo: 'depósito',
            monto: montoDeposito,
            fecha: new Date(),
            saldo: usuario.fondos
        });
        guardarUsuario();

        Swal.fire({
            title: '¡Depósito Exitoso!',
            html: `Has depositado <strong>$${montoDeposito.toFixed(2)}</strong><br>
                   Nuevo saldo: <strong>$${usuario.fondos.toFixed(2)}</strong>`,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'index.html';
            }
        });

        vm.cant_depo = null;
    };

    // FUNCIÓN RETIRAR (similar)
    vm.retirar = function () {
        if (!vm.cant_retiro || vm.cant_retiro <= 0) {
            Swal.fire('Error', 'Ingresa una cantidad válida', 'warning');
            return;
        }

        if (parseFloat(vm.cant_retiro) > usuario.fondos) {
            Swal.fire('Error', 'Fondos insuficientes', 'error');
            return;
        }

        // Generar PDF
        try {
            if (typeof jsPDF !== 'undefined') {
                var doc = new jsPDF();
                doc.text("Hola " + usuario.name, 25, 25);
                doc.text("Has retirado $" + vm.cant_retiro + " de tu cuenta", 25, 50);
                doc.text(tiempo(), 25, 65);
                doc.save("PokeRetiro.pdf");
            }
        } catch (e) {
            console.log("PDF error:", e);
        }

        // Actualizar fondos
        usuario.fondos = parseFloat(usuario.fondos) - parseFloat(vm.cant_retiro);
        vm.persona.fondos = usuario.fondos;
        guardarUsuario();

        // Agregar al historial
        usuario.historial.push({
            tipo: 'retiro',
            monto: parseFloat(vm.cant_retiro),
            fecha: new Date(),
            saldo: usuario.fondos
        });
        guardarUsuario();

        Swal.fire('Éxito', 'Retiro de $' + vm.cant_retiro + ' realizado', 'success');
        vm.cant_retiro = null;
    };

    // Función para consultar saldo (si la necesitas)
    vm.consultarSaldo = function () {
        Swal.fire({
            title: 'Consulta de Saldo',
            html: `Hola <strong>${usuario.name}</strong><br>
                   Tu saldo actual es: <strong style="font-size: 24px;">$${usuario.fondos.toFixed(2)}</strong>`,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    };
    // Función global para reiniciar datos
    function reiniciarDatos() {
        localStorage.removeItem('usuarioPokemon');
        location.reload();
    }
}]);