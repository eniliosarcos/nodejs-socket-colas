//Referencias HTML

const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');                  
const lblTicket = document.querySelector('small');                  
const divAlerta = document.querySelector('.alert');                  
const lblPendientes = document.querySelector('#lblPendientes');                  

const searchParams = new URLSearchParams(window.location.search);

if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();



socket.on('connect', () => {
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => {
    if(pendientes === 0){
        lblPendientes.style.display = 'none';
        divAlerta.style.display = '';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
        divAlerta.style.display = 'none';
    }
    
});

btnAtender.addEventListener( 'click', () => {
    
    socket.emit('solicitar-ticket', {escritorio}, (payload) => {
        if(!payload.ok){
            lblTicket.innerText = 'Nadie.';
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = 'Ticket '+ payload.ticket.numero;
    });

    
    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });

});