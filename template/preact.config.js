export default (config, env, helpers) => {
	console.log(config);
	try {
		let { plugin } = helpers.getPluginsByName(config, 'HtmlWebpackPlugin')[0];
		plugin.options.og = {};
	}
	catch (e) {}
};
