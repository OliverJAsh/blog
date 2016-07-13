declare module 'vdom-to-html' {
    function main(node: VirtualDOM.VNode): string;

    export = main;
}

declare module 'dateformat' {
    function main(date: Date, format: string): string;

    export = main;
}

declare module 'slug' {
    interface SlugOptions {
        lower?: Boolean;
    }
    function main(str: string, options: SlugOptions): string;

    export = main;
}
