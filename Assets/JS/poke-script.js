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
    vm.totalDepositos = 0;
    vm.totalRetiros = 0;
    vm.totalPagos = 0;

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
        console.log("Función retirar ejecutada");

        if (!vm.cant_retiro || vm.cant_retiro <= 0) {
            Swal.fire('Error', 'Ingresa una cantidad válida', 'warning');
            return;
        }

        if (parseFloat(vm.cant_retiro) > usuario.fondos) {
            Swal.fire('Error', 'Fondos insuficientes', 'error');
            return;
        }

        // Generar PDF (con try-catch)
        try {
            if (typeof jsPDF !== 'undefined') {
                var doc = new jsPDF();
                doc.text("Hola " + usuario.name, 25, 25);
                doc.text("Has retirado $" + vm.cant_retiro + " de la Poke-Cuenta numero " + usuario.cuenta, 25, 50);
                doc.text(tiempo(), 25, 65);
                doc.save("PokeRetiro.pdf");
            }
        } catch (e) {
            console.log("PDF error:", e);
        }

        // Actualizar fondos
        var montoRetiro = parseFloat(vm.cant_retiro);
        usuario.fondos = parseFloat(usuario.fondos) - montoRetiro;
        vm.persona.fondos = usuario.fondos;

        // Guardar en localStorage
        guardarUsuario();

        // Agregar al historial
        usuario.historial.push({
            tipo: 'retiro',
            monto: montoRetiro,
            fecha: new Date(),
            saldo: usuario.fondos
        });
        guardarUsuario();

        Swal.fire({
            title: '¡Retiro Exitoso!',
            html: `Has retirado <strong>$${montoRetiro.toFixed(2)}</strong><br>
               Nuevo saldo: <strong>$${usuario.fondos.toFixed(2)}</strong>`,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'index.html';
            }
        });

        vm.cant_retiro = null;
    };


    // Agrega estas funciones al controller en poke-script.js

    // Calcular estadísticas
    vm.calcularEstadisticas = function () {
        if (usuario.historial && usuario.historial.length > 0) {
            vm.totalDepositos = usuario.historial.filter(h => h.tipo === 'depósito').length;
            vm.totalRetiros = usuario.historial.filter(h => h.tipo === 'retiro').length;
            vm.totalPagos = usuario.historial.filter(h => h.tipo === 'pago').length;
        } else {
            vm.totalDepositos = 0;
            vm.totalRetiros = 0;
            vm.totalPagos = 0;
        }
    };

    // Generar comprobante PDF
    vm.generarComprobante = function () {
        try {
            if (typeof jsPDF !== 'undefined') {
                var doc = new jsPDF();

                // Título
                doc.setFontSize(20);
                doc.setTextColor(255, 193, 7);
                doc.text("POKÉ-BANK", 105, 20, { align: 'center' });

                doc.setFontSize(16);
                doc.setTextColor(255, 255, 255);
                doc.text("Comprobante de Saldo", 105, 35, { align: 'center' });

                doc.setFontSize(12);
                doc.setTextColor(200, 200, 200);
                doc.text("Fecha: " + new Date().toLocaleString(), 20, 55);
                doc.text("Entrenador: " + usuario.name, 20, 65);
                doc.text("Número de Cuenta: " + usuario.cuenta, 20, 75);

                doc.setFontSize(14);
                doc.setTextColor(0, 255, 0);
                doc.text("Saldo Actual: $" + usuario.fondos.toFixed(2), 20, 95);

                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text(tiempo(), 20, 280);

                doc.save("PokeComprobante.pdf");

                Swal.fire('Éxito', 'Comprobante PDF generado', 'success');
            }
        } catch (e) {
            console.log("Error al generar PDF:", e);
            Swal.fire('Error', 'No se pudo generar el PDF', 'error');
        }
    };

    // Consultar saldo (mejorado)
    vm.consultarSaldo = function () {
        // Recargar datos desde localStorage
        var datosActualizados = JSON.parse(localStorage.getItem('usuarioPokemon'));
        if (datosActualizados) {
            usuario.fondos = datosActualizados.fondos;
            usuario.historial = datosActualizados.historial;
            vm.persona.fondos = usuario.fondos;
            vm.persona.historial = usuario.historial;
            vm.calcularEstadisticas();
        }

        Swal.fire({
            title: 'Consulta de Saldo',
            html: `<div class="text-center">
                <i class="fas fa-pokeball" style="font-size: 48px; color: #ffc107;"></i>
                <h3 class="mt-3">$${usuario.fondos.toFixed(2)}</h3>
                <p class="text-secondary">Saldo disponible en tu Poke-Cuenta</p>
                <hr>
                <small class="text-muted">Última actualización: ${new Date().toLocaleTimeString()}</small>
               </div>`,
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ffc107'
        });
    };

    // Llamar a calcular estadísticas al iniciar
    vm.calcularEstadisticas();

    // Función global para reiniciar datos
    function reiniciarDatos() {
        localStorage.removeItem('usuarioPokemon');
        location.reload();
    }
}]);