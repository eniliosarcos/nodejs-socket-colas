const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
    // cuando un cliente se coencta
    socket.emit('ultimo-ticket',ticketControl.ultimo);
    socket.emit('estado-actual',ticketControl.ultimos4);
    socket.emit('tickets-pendientes',ticketControl.tickets.length);

    socket.on('siguiente-ticket', ( payload, callback ) => {

        const siguiente = ticketControl.siguiente();
        callback(siguiente);

        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);

    })

    socket.on('solicitar-ticket', (payload, callback) => {

        if(!payload.escritorio){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket(payload.escritorio);

        socket.broadcast.emit('estado-actual',ticketControl.ultimos4);
        socket.emit('tickets-pendientes',ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);

        if(!ticket){
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        }else{
            callback({
                ok: true,
                ticket
            })
        }

        // TODO:Notificar que hay un nuevo ticket pendiente de asignar

    })

}



module.exports = {
    socketController
}

