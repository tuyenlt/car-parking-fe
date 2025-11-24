import { useState } from 'react';

function App() {
	const [count, setCount] = useState(0);

	return (
		<div style={{ textAlign: 'center', marginTop: '100px' }}>
			<h1>Đếm số: {count}</h1>
			<button onClick={() => setCount(count - 1)}>-</button>
			<button onClick={() => setCount(count + 1)}>+</button>
		</div>
	);
}

export default App;