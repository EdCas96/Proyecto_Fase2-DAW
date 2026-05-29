const transacciones = {
    
    //Arreglos emptys pa luego
    depositos: [
        
    ],
    retiros:[
    
    ],
    pagoagua:[
    
    ],
    pagoluz:[
        
    ],
    pagointernet:[
        
    ],
    
    //Metodos salserines
    
    //Total de depositos
    totalDepositos() {
        let total = 0;
        for (let i = 0; i < this.depositos.length; i++) {
            total += this.depositos[i][1]
        }
        return total;
    },
    
    totalretiros() {
      let total = 0;
        for (let i = 0; i < < this.retiros.length; i++) {
            total += this.retiros[i][1]
        }
        return total;
    },
}