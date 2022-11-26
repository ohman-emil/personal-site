import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

const devMode = (process.env.NODE_ENV === 'dev');

const minimizeHTML = (HTML) => {
    let parsedString = HTML.toString()
        .replaceAll(/\n\s*/g, '') // Remove line breaks
        .replaceAll(/>(\s+)</g, '><') // Remove space between tags
        .replaceAll(/<!--(.+?)-->/g, ''); // Remove comments
    
    let preamp = `<!-- Bundled ${new Date().toISOString()} -->`; // Add bundled date

    return `${preamp}\n${parsedString}`
};

export default [{
    input: './src/index.js',
    output: {
        file: './dist/bundle.js',
        format: 'es',
        sourcemap: devMode
    },
    plugins: [
        terser({
            ecma: 2020,
            mangle: {toplevel: true},
            compress: {
                module: true,
                toplevel: true,
                unsafe_arrows: true,
                drop_console: !devMode,
                drop_debugger: !devMode
            },
            output: {quote_style: 1}
        }),
        postcss({
            extensions: ['.css'],
            minimize: true,
            extract: true
        }),
        copy({
            targets: [
                {
                    src: 'src/static/index.html',
                    dest: 'dist',
                    transform: (contents, filename) => minimizeHTML(contents)
                },
                {
                    src: 'src/static/404.html',
                    dest: 'dist/404',
                    transform: (contents, filename) => minimizeHTML(contents),
                    rename: (name, extension, fullPath) => `index.html`
                },
                {
                    src: 'src/assets/*',
                    dest: 'dist/assets'
                },
                {
                    src: 'manifest.json',
                    dest: 'dist'
                },
                {
                    src: 'robots.txt',
                    dest: 'dist'
                }
            ]
        })
    ]
}];
