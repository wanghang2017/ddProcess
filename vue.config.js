var obj = {}

// console.log
if (process.env.NODE_ENV !== 'production') {
    obj = {
        devServer: {
            host: "0.0.0.0"
        }
    }
}else{
    obj = {
        outputDir:"build"
    }
}

module.exports = obj;