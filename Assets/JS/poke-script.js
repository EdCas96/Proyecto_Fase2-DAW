function tiempo(impresion){
    var date = new Date();
    var impresion = date + " SV";
    return impresion;
}

// Definir imagen ANTES de usarla
var img = new Image();
img.src = 'Assets/IMG/pokebank.jpg';

// Definir usuario ANTES del controller
var usuario = {
    name: 'Eduardo Castro',
    pin: '1234',  // Agregado pin
    cuenta: '0487654521',
    fondos: 700,  // Cambiado a número, no string
    historial: []
};

(function(){
    var app = angular.module('pokeBank', []);    
    
    app.controller('pokeController', ['$scope', function($scope){
        const vm = this;
        vm.persona = usuario;
        
        // Inicializar variables
        vm.cant_depo = '';
        vm.cant_retiro = '';
        vm.NIC = '';
        vm.monto_energia = '';
        vm.NPE = '';
        vm.monto_agua = '';
        vm.telefono = '';
        vm.monto_telefono = '';
        
        // FUNCION DEPOSITAR
        vm.depositar = function(){
            if(!vm.cant_depo || vm.cant_depo == ''){
                Swal.fire({
                    title: '¡Poke-Atención!',
                    text: 'No has definido la cantidad a depositar',
                    icon: 'warning',
                    confirmButtonText: 'Intentar'
                });
                return;
            }
            
            var doc = new jsPDF();
            if(img.complete) {
                doc.addImage(img, 'JPG', 150, 10, 50, 20);
            }
            doc.text("Hola " + usuario.name, 25, 25);
            doc.text("Has depositado $" + vm.cant_depo + " a la Poke-Cuenta numero " + usuario.cuenta, 25, 50);
            doc.text(tiempo(), 25, 65);
            doc.save("PokeDeposito.pdf");
            
            // Aumentando fondos
            usuario.fondos = parseFloat(usuario.fondos) + parseFloat(vm.cant_depo);
            vm.persona.fondos = usuario.fondos;  // Actualizar vista
            Swal.fire('Éxito', 'Depósito realizado con éxito', 'success');
            vm.cant_depo = '';  // Limpia el input
        };
        
        // FUNCION RETIRAR
        vm.retirar = function(){
            if(!vm.cant_retiro || vm.cant_retiro == ''){
                Swal.fire({
                    title: '¡Poke-Atención!',
                    text: 'No has definido la cantidad a retirar',
                    icon: 'warning',
                    confirmButtonText: 'Intentar'
                });
                return;
            }
            
            if(parseFloat(vm.cant_retiro) > usuario.fondos) {
                Swal.fire('Error', 'Fondos insuficientes', 'error');
                return;
            }
            
            var doc = new jsPDF();
            if(img.complete) {
                doc.addImage(img, 'JPG', 150, 10, 50, 20);
            }
            doc.text("Hola " + usuario.name, 25, 25);
            doc.text("Has retirado $" + vm.cant_retiro + " de la Poke-Cuenta numero " + usuario.cuenta, 25, 50);
            doc.text(tiempo(), 25, 65);
            doc.save("PokeRetiro.pdf");
            
            usuario.fondos = parseFloat(usuario.fondos) - parseFloat(vm.cant_retiro);
            vm.persona.fondos = usuario.fondos;
            Swal.fire('Éxito', 'Retiro realizado con éxito', 'success');
            vm.cant_retiro = '';
        };
        
        // FUNCION PAGO ENERGÍA
        vm.pagar_energia = function(){
            if(!vm.NIC){
                Swal.fire('Error', 'No has definido el NIC', 'warning');
                return;
            }
            if(!vm.monto_energia){
                Swal.fire('Error', 'No has definido el monto', 'warning');
                return;
            }
            
            var doc = new jsPDF();
            if(img.complete) doc.addImage(img, 'JPG', 150, 10, 50, 20);
            doc.text("Hola " + usuario.name, 25, 25);
            doc.text("Has pagado la energia electrica que te brinda Pikachu,", 25, 50);
            doc.text("mediante el NIC " + vm.NIC + " por un costo de $" + vm.monto_energia, 25, 60);
            doc.text(tiempo(), 25, 90);
            doc.save("PokePago-Energia.pdf");
            
            usuario.fondos = parseFloat(usuario.fondos) - parseFloat(vm.monto_energia);
            vm.persona.fondos = usuario.fondos;
            Swal.fire('Éxito', 'Pago de energía realizado', 'success');
            vm.NIC = '';
            vm.monto_energia = '';
        };
        
        // FUNCION PAGAR AGUA
        vm.pagar_agua = function(){
            if(!vm.NPE){
                Swal.fire('Error', 'No has definido el NPE', 'warning');
                return;
            }
            if(!vm.monto_agua){
                Swal.fire('Error', 'No has definido el monto', 'warning');
                return;
            }
            
            var doc = new jsPDF();
            if(img.complete) doc.addImage(img, 'JPG', 150, 10, 50, 20);
            doc.text("Hola " + usuario.name, 25, 25);
            doc.text("Has pagado el agua que te brinda Squirtle,", 25, 50);
            doc.text("mediante el NPE " + vm.NPE + " por un costo de $" + vm.monto_agua, 25, 60);
            doc.text(tiempo(), 25, 90);
            doc.save("PokePago-Agua.pdf");
            
            usuario.fondos = parseFloat(usuario.fondos) - parseFloat(vm.monto_agua);
            vm.persona.fondos = usuario.fondos;
            Swal.fire('Éxito', 'Pago de agua realizado', 'success');
            vm.NPE = '';
            vm.monto_agua = '';
        };
        
        // FUNCION PAGAR TELEFONIA
        vm.pagar_telefonia = function(){
            if(!vm.telefono){
                Swal.fire('Error', 'No has definido el número', 'warning');
                return;
            }
            if(!vm.monto_telefono){
                Swal.fire('Error', 'No has definido el monto', 'warning');
                return;
            }
            
            var doc = new jsPDF();
            if(img.complete) doc.addImage(img, 'JPG', 150, 10, 50, 20);
            doc.text("Hola " + usuario.name, 25, 25);
            doc.text("Has pagado el consumo de tu Pokédesk,", 25, 50);
            doc.text("mediante el Número Telefónico " + vm.telefono + " por un costo de $" + vm.monto_telefono, 25, 60);
            doc.text(tiempo(), 25, 90);
            doc.save("PokePago-Telefono.pdf");
            
            usuario.fondos = parseFloat(usuario.fondos) - parseFloat(vm.monto_telefono);
            vm.persona.fondos = usuario.fondos;
            Swal.fire('Éxito', 'Pago de telefonía realizado', 'success');
            vm.telefono = '';
            vm.monto_telefono = '';
        };
    }]);
})();

// Función login (sin cambios, pero nota que necesitas ng-model en el HTML)
function login() {
    var pin = document.getElementById('PIN');
    var PIN = pin.value;
    
    if(PIN == '1234'){
        document.location.href = "index.html";
    } else if(PIN == ''){
        Swal.fire({
            title: '¡Atención!',
            text: 'El campo PIN no puede quedar vacío',
            icon: 'warning',
            confirmButtonText: 'Intentar',
            timer: 5000,
            timerProgressBar: true
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'PIN no válido',
            icon: 'error',
            confirmButtonText: 'Avanzar',
            timer: 5000,
            timerProgressBar: true
        });
    }
}