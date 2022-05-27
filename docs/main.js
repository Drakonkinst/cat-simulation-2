let o=5;const e={setLevel(e){o=e},severe(e){o>=1&&console.error(e)},warn(e){o>=2&&console.warn(e)},info(e){o>=3&&console.log(e)},fine(e){o>=4&&console.log(e)},finer(e){o>=5&&console.log(e)}},l={version:'alpha 2.000',options:{loggerLevel:5}};$((()=>{e.info('Hello, world!')}));export{l as GameInfo};
//# sourceMappingURL=main.js.map
