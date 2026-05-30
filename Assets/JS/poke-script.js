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
        name: 'Ash Ketchum',
        pin: '1234',
        cuenta: '0987654321',
        fondos: 500,
        historial: []
    };
    // Guardar en localStorage
    localStorage.setItem('usuarioPokemon', JSON.stringify(usuario));
}

// Función para guardar cambios en localStorage
function guardarUsuario() {
    localStorage.setItem('usuarioPokemon', JSON.stringify(usuario));
}

// Función de login — valida el PIN contra localStorage
function login() {
    var pinIngresado = document.getElementById('PIN').value;

    if (!pinIngresado || pinIngresado.trim() === '') {
        Swal.fire({
            title: '¡Poke-Atención!',
            text: 'Por favor ingresa tu PIN de entrenador',
            icon: 'warning',
            confirmButtonText: 'Intentar'
        });
        return;
    }

    var pinCorrecto = usuario ? usuario.pin : '1234';

    if (pinIngresado === pinCorrecto) {
        window.location.href = 'index.html';
    } else {
        Swal.fire({
            title: '¡PIN Incorrecto!',
            text: 'PIN incorrecto, intenta nuevamente',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
        });
    }
}

// Función global para reiniciar datos (accesible desde onclick en el HTML)
function reiniciarDatos() {
    localStorage.removeItem('usuarioPokemon');
    location.reload();
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

    // FUNCIÓN PAGAR ENERGÍA
    vm.pagarEnergia = function () {
        console.log("Función pagarEnergia ejecutada");
        console.log("NIC:", vm.NIC);
        console.log("Monto:", vm.monto_energia);

        // Validaciones
        if (!vm.NIC || vm.NIC.trim() === '') {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'Por favor ingresa el número de contrato NIC',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        if (!vm.monto_energia || vm.monto_energia <= 0) {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'Por favor ingresa un monto válido para el pago',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        if (parseFloat(vm.monto_energia) > usuario.fondos) {
            Swal.fire({
                title: '¡Fondos Insuficientes!',
                text: `No tienes suficiente saldo. Tu saldo actual es $${usuario.fondos.toFixed(2)}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Generar comprobante PDF
        try {
            if (typeof jsPDF !== 'undefined') {
                var doc = new jsPDF();

                // Logo o título
                doc.setFontSize(20);
                doc.setTextColor(255, 193, 7);
                doc.text("POKÉ-BANK", 105, 20, { align: 'center' });

                doc.setFontSize(14);
                doc.setTextColor(255, 255, 255);
                doc.text("Comprobante de Pago de Energía", 105, 35, { align: 'center' });

                doc.setFontSize(11);
                doc.setTextColor(200, 200, 200);
                doc.text("Hola " + usuario.name, 20, 55);
                doc.text("Has pagado el servicio de energía eléctrica", 20, 65);
                doc.text("NIC: " + vm.NIC, 20, 75);
                doc.text("Monto pagado: $" + parseFloat(vm.monto_energia).toFixed(2), 20, 85);
                doc.text("Fecha y hora: " + new Date().toLocaleString(), 20, 95);
                doc.text("Nuevo saldo: $" + (usuario.fondos - parseFloat(vm.monto_energia)).toFixed(2), 20, 105);

                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text("Gracias por usar POKÉ-BANK", 105, 270, { align: 'center' });
                doc.text(tiempo(), 20, 280);

                doc.save("PokePago-Energia.pdf");
                console.log("PDF generado exitosamente");
            }
        } catch (e) {
            console.error("Error al generar PDF:", e);
            // Continuamos aunque falle el PDF
        }

        // Registrar en historial ANTES de actualizar fondos
        var montoPago = parseFloat(vm.monto_energia);
        var saldoAnterior = usuario.fondos;

        // Actualizar fondos
        usuario.fondos = saldoAnterior - montoPago;
        vm.persona.fondos = usuario.fondos;

        // Agregar al historial
        if (!usuario.historial) usuario.historial = [];
        usuario.historial.push({
            tipo: 'pago',
            servicio: 'energía eléctrica',
            nic: vm.NIC,
            monto: montoPago,
            fecha: new Date(),
            saldo: usuario.fondos
        });

        // Guardar en localStorage
        guardarUsuario();

        // Actualizar estadísticas si la función existe
        if (vm.calcularEstadisticas) {
            vm.calcularEstadisticas();
        }

        // Mostrar mensaje de éxito y limpiar
        Swal.fire({
            title: '¡Pago Exitoso!',
            html: `<div class="text-center">
                <i class="fas fa-bolt text-warning" style="font-size: 48px;"></i>
                <h3 class="mt-3">$${montoPago.toFixed(2)}</h3>
                <p>Pago de energía eléctrica realizado con éxito</p>
                <hr>
                <small class="text-muted">NIC: ${vm.NIC}</small><br>
                <small class="text-success">Nuevo saldo: $${usuario.fondos.toFixed(2)}</small>
               </div>`,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'servicios.html';
            }
        });

        // Limpiar inputs
        vm.NIC = '';
        vm.monto_energia = null;

        // Forzar actualización de la vista
        if ($scope && $scope.$apply) {
            $scope.$apply();
        }
    };

    // FUNCIÓN CALCULAR MONTO AGUA
    vm.calcularMontoAgua = function () {
        if (vm.lectura_anterior && vm.lectura_actual && vm.lectura_actual > vm.lectura_anterior) {
            var consumo = vm.lectura_actual - vm.lectura_anterior;
            var tarifaPorM3 = 0.50; // $0.50 por metro cúbico

            // Cálculo del monto
            var montoCalculado = consumo * tarifaPorM3;

            // Agregar cuota fija de servicio
            var cuotaFija = 2.00;
            montoCalculado += cuotaFija;

            // Redondear a 2 decimales
            vm.monto_agua = parseFloat(montoCalculado.toFixed(2));

            console.log("Consumo:", consumo, "m³");
            console.log("Monto calculado: $", vm.monto_agua);

            // Mostrar notificación
            Swal.fire({
                title: 'Monto Calculado',
                html: `<div class="text-center">
                    <i class="fas fa-tint text-info" style="font-size: 48px;"></i>
                    <h3 class="mt-2">$${vm.monto_agua}</h3>
                    <p>Consumo: ${consumo} m³</p>
                    <small class="text-muted">Tarifa: $0.50 por m³ + cuota fija $2.00</small>
                   </div>`,
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire('Error', 'Las lecturas no son válidas', 'warning');
        }
    };

    // FUNCIÓN PAGAR AGUA
    vm.pagarAgua = function () {
        console.log("Función pagarAgua ejecutada");
        console.log("NPE:", vm.NPE);
        console.log("Monto:", vm.monto_agua);

        // Validaciones
        if (!vm.NPE || vm.NPE.trim() === '') {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'Por favor ingresa el número de predio NPE',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        if (!vm.lectura_anterior || !vm.lectura_actual) {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'Por favor ingresa las lecturas del medidor',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        if (vm.lectura_actual <= vm.lectura_anterior) {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'La lectura actual debe ser mayor que la lectura anterior',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        if (!vm.monto_agua || vm.monto_agua <= 0) {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'Calcula el monto antes de realizar el pago',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        if (parseFloat(vm.monto_agua) > usuario.fondos) {
            Swal.fire({
                title: '¡Fondos Insuficientes!',
                text: `No tienes suficiente saldo. Tu saldo actual es $${usuario.fondos.toFixed(2)}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Generar comprobante PDF
        try {
            if (typeof jsPDF !== 'undefined') {
                var consumo = vm.lectura_actual - vm.lectura_anterior;
                var doc = new jsPDF();

                doc.setFontSize(20);
                doc.setTextColor(0, 255, 255);
                doc.text("POKÉ-BANK", 105, 20, { align: 'center' });

                doc.setFontSize(14);
                doc.setTextColor(255, 255, 255);
                doc.text("Comprobante de Pago de Agua Potable", 105, 35, { align: 'center' });

                doc.setFontSize(11);
                doc.setTextColor(200, 200, 200);
                doc.text("Hola " + usuario.name, 20, 55);
                doc.text("Has pagado el servicio de agua potable", 20, 65);
                doc.text("Número de Predio (NPE): " + vm.NPE, 20, 75);
                doc.text("Consumo: " + consumo + " m³", 20, 85);
                doc.text("Lectura anterior: " + vm.lectura_anterior + " m³", 20, 95);
                doc.text("Lectura actual: " + vm.lectura_actual + " m³", 20, 105);
                doc.text("Monto pagado: $" + parseFloat(vm.monto_agua).toFixed(2), 20, 115);
                doc.text("Fecha y hora: " + new Date().toLocaleString(), 20, 125);
                doc.text("Nuevo saldo: $" + (usuario.fondos - parseFloat(vm.monto_agua)).toFixed(2), 20, 135);

                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text("Gracias por usar POKÉ-BANK", 105, 270, { align: 'center' });
                doc.text(tiempo(), 20, 280);

                doc.save("PokePago-Agua.pdf");
                console.log("PDF generado exitosamente");
            }
        } catch (e) {
            console.error("Error al generar PDF:", e);
        }

        // Registrar en historial
        var consumo = vm.lectura_actual - vm.lectura_anterior;
        var montoPago = parseFloat(vm.monto_agua);
        var saldoAnterior = usuario.fondos;

        // Actualizar fondos
        usuario.fondos = saldoAnterior - montoPago;
        vm.persona.fondos = usuario.fondos;

        // Agregar al historial
        if (!usuario.historial) usuario.historial = [];
        usuario.historial.push({
            tipo: 'pago',
            servicio: 'agua potable',
            npe: vm.NPE,
            consumo: consumo,
            lectura_anterior: vm.lectura_anterior,
            lectura_actual: vm.lectura_actual,
            monto: montoPago,
            fecha: new Date(),
            saldo: usuario.fondos
        });

        // Guardar en localStorage
        guardarUsuario();

        // Actualizar estadísticas
        if (vm.calcularEstadisticas) {
            vm.calcularEstadisticas();
        }

        // Mostrar mensaje de éxito
        Swal.fire({
            title: '¡Pago Exitoso!',
            html: `<div class="text-center">
                <i class="fas fa-tint text-info" style="font-size: 48px;"></i>
                <h3 class="mt-3">$${montoPago.toFixed(2)}</h3>
                <p>Pago de agua potable realizado con éxito</p>
                <hr>
                <small class="text-muted">NPE: ${vm.NPE}</small><br>
                <small class="text-muted">Consumo: ${consumo} m³</small><br>
                <small class="text-success">Nuevo saldo: $${usuario.fondos.toFixed(2)}</small>
               </div>`,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'servicios.html';
            }
        });

        // Limpiar inputs
        vm.NPE = '';
        vm.lectura_anterior = '';
        vm.lectura_actual = '';
        vm.monto_agua = null;

        // Forzar actualización de la vista
        if ($scope && $scope.$apply) {
            $scope.$apply();
        }
    };

    // FUNCIÓN ACTUALIZAR MONTO SEGÚN SERVICIO
    vm.actualizarMontoPorServicio = function () {
        var precios = {
            'internet': 30.00,
            'telefono': 20.00,
            'combo': 45.00,
            'fibra': 50.00,
            'fibraplus': 70.00
        };

        var montoBase = precios[vm.tipo_servicio] || 0;

        // Agregar extras
        var extras = 0;
        if (vm.streaming) extras += 10;
        if (vm.antivirus) extras += 5;

        vm.monto_telefono = montoBase + extras;

        console.log("Servicio:", vm.tipo_servicio);
        console.log("Monto base: $", montoBase);
        console.log("Extras: $", extras);
        console.log("Total: $", vm.monto_telefono);
    };

    // Watch para cambios en los checkboxes
    if ($scope) {
        $scope.$watch('bank.streaming', function () {
            if (vm.tipo_servicio) vm.actualizarMontoPorServicio();
        });

        $scope.$watch('bank.antivirus', function () {
            if (vm.tipo_servicio) vm.actualizarMontoPorServicio();
        });
    }

    // FUNCIÓN PAGAR TELEFONÍA/INTERNET
    vm.pagarTelefonia = function () {
        console.log("Función pagarTelefonia ejecutada");
        console.log("Servicio:", vm.tipo_servicio);
        console.log("Teléfono:", vm.telefono);
        console.log("Monto:", vm.monto_telefono);

        // Validaciones
        if (!vm.tipo_servicio) {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'Por favor selecciona el tipo de servicio',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        if (!vm.telefono || vm.telefono.trim() === '') {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'Por favor ingresa el número de teléfono o cuenta',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        if (!vm.monto_telefono || vm.monto_telefono <= 0) {
            Swal.fire({
                title: '¡Poke-Atención!',
                text: 'El monto a pagar no es válido',
                icon: 'warning',
                confirmButtonText: 'Intentar'
            });
            return;
        }

        if (parseFloat(vm.monto_telefono) > usuario.fondos) {
            Swal.fire({
                title: '¡Fondos Insuficientes!',
                text: `No tienes suficiente saldo. Tu saldo actual es $${usuario.fondos.toFixed(2)}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Generar comprobante PDF
        try {
            if (typeof jsPDF !== 'undefined') {
                var doc = new jsPDF();

                // Título
                doc.setFontSize(20);
                doc.setTextColor(0, 255, 0);
                doc.text("POKÉ-BANK", 105, 20, { align: 'center' });

                doc.setFontSize(14);
                doc.setTextColor(255, 255, 255);
                doc.text("Comprobante de Pago - Internet/Telefonía", 105, 35, { align: 'center' });

                doc.setFontSize(11);
                doc.setTextColor(200, 200, 200);
                doc.text("Hola " + usuario.name, 20, 55);
                doc.text("Has pagado el servicio de: " + vm.tipo_servicio, 20, 65);
                doc.text("Número de cuenta: " + vm.telefono, 20, 75);

                // Mostrar extras
                var extras = [];
                if (vm.streaming) extras.push("Streaming Pack");
                if (vm.antivirus) extras.push("Antivirus");
                if (extras.length > 0) {
                    doc.text("Servicios adicionales: " + extras.join(", "), 20, 85);
                }

                doc.text("Monto pagado: $" + parseFloat(vm.monto_telefono).toFixed(2), 20, 95);
                doc.text("Fecha y hora: " + new Date().toLocaleString(), 20, 105);
                doc.text("Nuevo saldo: $" + (usuario.fondos - parseFloat(vm.monto_telefono)).toFixed(2), 20, 115);

                if (vm.email) {
                    doc.text("Factura enviada a: " + vm.email, 20, 130);
                }

                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text("Gracias por usar POKÉ-BANK", 105, 270, { align: 'center' });
                doc.text(tiempo(), 20, 280);

                doc.save("PokePago-Internet.pdf");
                console.log("PDF generado exitosamente");
            }
        } catch (e) {
            console.error("Error al generar PDF:", e);
        }

        // Registrar en historial
        var montoPago = parseFloat(vm.monto_telefono);
        var saldoAnterior = usuario.fondos;

        // Actualizar fondos
        usuario.fondos = saldoAnterior - montoPago;
        vm.persona.fondos = usuario.fondos;

        // Crear descripción del servicio
        var servicioDescripcion = vm.tipo_servicio;
        var extras = [];
        if (vm.streaming) extras.push("Streaming");
        if (vm.antivirus) extras.push("Antivirus");
        if (extras.length > 0) {
            servicioDescripcion += " + " + extras.join(" + ");
        }

        // Agregar al historial
        if (!usuario.historial) usuario.historial = [];
        usuario.historial.push({
            tipo: 'pago',
            servicio: 'internet/telefonía',
            plan: vm.tipo_servicio,
            numero_cuenta: vm.telefono,
            streaming: vm.streaming || false,
            antivirus: vm.antivirus || false,
            email: vm.email || null,
            nombre_titular: vm.nombre_titular || null,
            monto: montoPago,
            fecha: new Date(),
            saldo: usuario.fondos
        });

        // Guardar en localStorage
        guardarUsuario();

        // Actualizar estadísticas
        if (vm.calcularEstadisticas) {
            vm.calcularEstadisticas();
        }

        // Mostrar mensaje de éxito
        var nombreServicio = '';
        switch (vm.tipo_servicio) {
            case 'internet': nombreServicio = 'Internet Residencial'; break;
            case 'telefono': nombreServicio = 'Telefonía Fija'; break;
            case 'combo': nombreServicio = 'Combo Internet + Telefonía'; break;
            case 'fibra': nombreServicio = 'Fibra Óptica 200MB'; break;
            case 'fibraplus': nombreServicio = 'Fibra Óptica 500MB'; break;
            default: nombreServicio = vm.tipo_servicio;
        }

        Swal.fire({
            title: '¡Pago Exitoso!',
            html: `<div class="text-center">
                <i class="fas fa-wifi text-success" style="font-size: 48px;"></i>
                <h3 class="mt-3">$${montoPago.toFixed(2)}</h3>
                <p>Pago de ${nombreServicio} realizado con éxito</p>
                <hr>
                <small class="text-muted">Cuenta: ${vm.telefono}</small><br>
                ${extras.length > 0 ? `<small class="text-muted">Extras: ${extras.join(", ")}</small><br>` : ''}
                <small class="text-success">Nuevo saldo: $${usuario.fondos.toFixed(2)}</small>
               </div>`,
            icon: 'success',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'servicios.html';
            }
        });

        // Limpiar inputs
        vm.tipo_servicio = '';
        vm.telefono = '';
        vm.monto_telefono = null;
        vm.email = '';
        vm.nombre_titular = '';
        vm.streaming = false;
        vm.antivirus = false;

        // Forzar actualización de la vista
        if ($scope && $scope.$apply) {
            $scope.$apply();
        }
    };
}]);