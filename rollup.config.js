import { terser } from 'rollup-plugin-terser';

const DEV = true;

export default {
    input: 'src/script/game.js',
    output: {
        file: 'docs/main.js',
        sourcemap: DEV,
        format: 'es'
    },
    plugins: [
        terser({
            ecma: 2018,
            mangle: { toplevel: true },
            compress: {
                module: true,
                toplevel: true,
                unsafe_arrows: true,
            },
            output: { quote_style: 1 }
        })
    ]
};