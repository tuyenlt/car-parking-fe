import { useContext } from 'react';
import MqttContext from './mqtt-context';

export default function useMqtt() {
	return useContext(MqttContext);
}
