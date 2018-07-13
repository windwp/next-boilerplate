/* eslint-disable */
module.exports = (config, libaryChunkName = ["react", "redux"]) => {

    let regex = '';
    libaryChunkName.forEach((item) => {
        regex += "([\\\\/]" + item + "[\\\\/])" + "|";
    })
    regex = regex.substring(0, regex.length - 1);
    // console.log(regex);
    // Extend the default CommonsChunkPlugin config
    config.plugins = config.plugins.map(plugin => {
        if (
            plugin.constructor.name === 'CommonsChunkPlugin' &&
            typeof plugin.minChunks !== 'undefined'
        ) {
            const defaultMinChunks = plugin.minChunks

            plugin.minChunks = (module, count) => {
                // Move all styles to commons chunk so they can be extracted to a single file
                if (module.resource && module.resource.match(new RegExp(regex))) {
                    return true
                }
                // Use default minChunks for non-style modules
                return typeof defaultMinChunks === 'function'
                    ? defaultMinChunks(module, count)
                    : count >= defaultMinChunks
            }
        }
        return plugin
    })
    return config
}