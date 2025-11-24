import { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from './authContext';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children }) {
	const [socket, setSocket] = useState(null);
	const { token } = useUserContext();

	useEffect(() => {
		if (!token) return;

		const newSocket = io(API_URL, {
			auth: { accessToken: token },
		});

		newSocket.on('connect', () => {
			console.log('Connected to socket:', newSocket.id);
		});

		newSocket.on('notification', (notification) => {
			toast.success(
				(t) => (
					<div className="flex flex-col space-y-1">
						<span className="font-semibold text-base">
							{notification.title}
						</span>
						{notification.content && (
							<span className="text-sm text-gray-600">
								{notification.content}
							</span>
						)}
						<div className="flex items-center justify-between text-xs text-gray-400 mt-1">
							<span>
								{formatDistanceToNow(new Date(notification.createdAt), {
									addSuffix: true,
								})}
							</span>
							{notification.link && (
								<Link
									to={notification.link}
									className="text-blue-600 hover:underline"
									onClick={(e) => {
										e.preventDefault();
										t.dismiss();
									}}
								>
									More Detail
								</Link>
							)}
						</div>
					</div>
				),
				{
					duration: 6000,
					position: 'top-right',
				}
			);
		});

		setSocket(newSocket);
		return () => {
			newSocket.disconnect();
			setSocket(null);
		};
	}, [token]);

	const onChatMessage = (callback) => {
		if (!socket) return () => { };
		socket.on('chatMessage', callback);
		return () => {
			socket.off('chatMessage', callback);
		};
	};

	const onClassPostCreate = (callback) => {
		if (!socket) return () => { };
		socket.on('classPostCreate', callback);
		return () => {
			socket.off('classPostCreate', callback);
		};
	};

	const onClassPostComment = (callback) => {
		if (!socket) return () => { };
		socket.on('classPostComment', callback);
		return () => {
			socket.off('classPostComment', callback);
		};
	};

	const onNotification = (callback) => {
		if (!socket) return () => { };
		socket.on('notification', callback);
		return () => {
			socket.off('notification', callback);
		};
	};

	const joinChatRoom = (roomId) => {
		if (!socket) return;
		socket.emit('joinRoom', roomId);
	};

	const joinClassUpdate = (classId) => {
		if (!socket) return;
		socket.emit('initClassUpdate', classId);
	};

	return (
		<WebSocketContext.Provider
			value={{
				socket,
				onChatMessage,
				onClassPostCreate,
				onClassPostComment,
				onNotification,
				joinChatRoom,
				joinClassUpdate,
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
}
