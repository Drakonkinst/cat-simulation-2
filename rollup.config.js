import { terser } from 'rollup-plugin-terser';

const dev = true;
export default {
    input: 'src/script/main.js',
    output: {
        file: 'docs/main.js',
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