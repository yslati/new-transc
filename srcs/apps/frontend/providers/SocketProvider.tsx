import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { connect } from "socket.io-client";
import Swal from "sweetalert2";
import { connectedUser, disconnectedUser, getAllUsers } from "../app/features/users";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { url } from "../services/api";

const s = connect(url, { query: { token: Cookies.get('token') } });

const SocketContext = createContext(s);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(s);
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const navigate = useNavigate()

    useEffect(() => {
        // if a user got connected
        socket.on('user_connected', (userId: number) => {
            dispatch(connectedUser(userId));
        });

        // if a user got dissconnected
        socket.on('user_disconnected', (userId: number) => {
            dispatch(disconnectedUser(userId));
        })

        if (user.logged) {
            dispatch(getAllUsers());
        }

        socket.on('game_invitation', (payload: any) => {

            Swal.fire({
                title: payload.message,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Accept'
                }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        position: 'center',
                        title: 'Starting Game...',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    socket.emit('begin_invitation_game', { roomId: payload.roomId });
                }
                else {
                    socket.emit('cancel_game_invitation', { roomId: payload.roomId, userId: user.user.displayName });
                }
            })
        });

        socket.on('game_invitation_cancelled', (refuser: string) => {
            // TODO: show a message to the user
            toast.error(`${refuser} cancelled your game invitation`);
        });

        socket.on('force_logout', () => {
            window.location.reload();
        });

        socket.on('game_started', () => {
            Swal.fire({
                position: 'center',
                title: 'Starting Game...',
                showConfirmButton: false,
                timer: 1000
            });
            navigate('/game');
        });

    }, []);

    return (
        <SocketContext.Provider value={socket}>
            { children }
        </SocketContext.Provider>
    )
}

export const useSocket = ()  => useContext(SocketContext);
