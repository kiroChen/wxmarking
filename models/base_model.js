//mongoose 插件
module.exports = exports = function lastModifiedPlugin (schema, options) {
	schema.add({ createdAt: {
		type: Date,
		default: Date.now
	}});
	
	schema.add({ lastMod: Date });

	schema.pre('save', function (next) {
		this.lastMod = new Date
		next();
	});

	schema.path('createdAt').index(true);
}