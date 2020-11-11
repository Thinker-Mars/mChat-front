const getters = {
	db: state => state.app.db,
	uid: state => state.user.uid,
	socket: state => state.socket.socket
}

export default getters