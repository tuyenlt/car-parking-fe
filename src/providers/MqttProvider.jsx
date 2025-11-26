
import React, { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';
import MqttContext from './mqtt-context';

export default function MqttProvider({ children }) {
	const FIXED_WS = 'wss://tmsherk.id.vn/mqtt';
	// const FIXED_WS = 'wss://13.215.140.112/mqtt';
	const clientRef = useRef(null);
	const pendingSubs = useRef([]);
	const listenersRef = useRef(new Map());
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		if (clientRef.current) return undefined;

		const client = mqtt.connect(FIXED_WS, {
			clientId: `app_mqtt_${Math.random().toString(16).slice(3)}`,
			clean: true,
			reconnectPeriod: 5000,
			connectTimeout: 4000,
		});

		client.on('connect', () => {
			setConnected(true);
			// flush pending subscriptions
			pendingSubs.current.forEach(({ topic, options }) => {
				client.subscribe(topic, options, (err) => {
					if (err) console.error('MQTT subscribe error', err);
				});
			});
			pendingSubs.current = [];
			console.log('MqttProvider connected');
		});

		client.on('reconnect', () => console.log('MqttProvider reconnecting...'));
		client.on('offline', () => { setConnected(false); console.log('MqttProvider offline'); });
		client.on('error', (err) => { setConnected(false); console.error('MqttProvider error', err); });

		// route messages to registered listeners
		client.on('message', (topic, msg) => {
			const key = topic;
			const listeners = listenersRef.current.get(key);
			if (listeners && listeners.length) {
				listeners.forEach((fn) => {
					try { fn(msg.toString(), topic); } catch (e) { console.error(e); }
				});
			}
		});

		clientRef.current = client;

		return () => {
			if (clientRef.current) {
				clientRef.current.end(true);
				clientRef.current = null;
			}
		};
	}, []);

	const publish = (topic, message, options = {}) => {
		if (!clientRef.current || !connected) {
			console.warn('MQTT not connected, publish skipped', topic, message);
			return false;
		}
		clientRef.current.publish(topic, message, options, (err) => { if (err) console.error('MQTT publish error', err); });
		return true;
	};

	const subscribe = (topic, handler, options = {}) => {
		// register handler
		const arr = listenersRef.current.get(topic) || [];
		arr.push(handler);
		listenersRef.current.set(topic, arr);

		if (!clientRef.current) {
			pendingSubs.current.push({ topic, options });
			return () => {
				// remove listener
				const cur = listenersRef.current.get(topic) || [];
				listenersRef.current.set(topic, cur.filter((fn) => fn !== handler));
			};
		}

		clientRef.current.subscribe(topic, options, (err) => {
			if (err) console.error('MQTT subscribe error', err);
		});

		return () => {
			const cur = listenersRef.current.get(topic) || [];
			listenersRef.current.set(topic, cur.filter((fn) => fn !== handler));
			if (clientRef.current) {
				clientRef.current.unsubscribe(topic, (err) => { if (err) console.error('Unsubscribe error', err); });
			}
		};
	};

	const value = { publish, subscribe, connected };

	return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
}


