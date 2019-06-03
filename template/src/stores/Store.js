import Dexie from 'dexie';
import { name } from '../../package.json';
const db = new Dexie(name);

db.version(1).stores({
	cache: 'name'
});

class Store {
	constructor({ state, commands, mutations }) {
		this.state = state || {};
		this.commands = commands || {};
		this.mutations = mutations || {};
		this._subscribers = [];

		db.cache
			.get('state')
			.then(result => {
				if (result) {
					result.state.isLoading = false;
					this.state = Object.assign(this.state, result.state);
					this._subscribers.forEach(sub => sub(state));
				}
			})
			.catch(err => {
				// @todo
			});
	}

	/**
	 * send command to the store.
	 * @param the name of the command.
	 * @param other parameters.
	 */
	command(type, ...payload) {
		const cmd = this.commands[type];
		if (cmd) {
			cmd(this, ...payload);
		}
		else {
			console.log(`store: no command for ${type}. args ${payload}`);
		}
	}

	/**
	 * commit a change to the mutation.
	 * @param the name of the command.
	 * @param other parameters.
	 */
	commit(type, ...payload) {
		const m = this.mutations[type];
		if (m) {
			// console.log(`store: mutation for ${type}. args ${payload}`);
			m(this.state, ...payload);
			this.publish(this.state);
			const state = this.state;
			let stateForSave = {};
			Object.keys(state).map(key => {
				if (!(typeof state[key] === 'function' || key.startsWith('_'))) {
					// debug
					stateForSave[key] = state[key];
				}
			});
			db.cache.put({
				name: 'state',
				state: stateForSave
			});
		}
		else {
			// console.log(`store: no mutation for ${type}. args ${payload}`);
		}
	}

	onChange(fn) {
		this._subscribers.push(fn);
	}

	publish(state) {
		this._subscribers.forEach(sub => sub(state));
	}
}

export default Store;
