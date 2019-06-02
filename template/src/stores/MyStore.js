import Store from './Store';
const initialState = { count: 10 };

export default new Store({
	state: initialState,
	commands: {
		increment(context) {
			context.state.count += 1;
			context.commit('assign', context.state);
		}
	},
	mutations: {
		assign(state, values) {
			Object.assign(state, values);
		}
	}
});
