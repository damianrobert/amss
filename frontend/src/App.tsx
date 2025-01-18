import {AuthProvider} from './context/AuthContext';
import {RoomProvider} from './context/RoomContext';
import AppRouter from './routing/AppRouter';

function App() {
	return (
		<AuthProvider>
			<RoomProvider>
				<AppRouter />
			</RoomProvider>
		</AuthProvider>
	);
}

export default App;
