export default (config, env, helpers) => {
	try {
		let { plugin } = helpers.getPluginsByName(config, 'HtmlWebpackPlugin')[0];
		plugin.options.og = {};
	}
	catch (e) {}
};
