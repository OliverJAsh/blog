export default `
html {
    font-family: -apple-system, BlinkMacSystemFont,
        "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
        "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    font-size: 18px;
    line-height: 1.4;
    color: hsl(0, 0%, 15%);
    -webkit-font-smoothing: antialiased;
}
body {
    /* Reset composed: UA */
    /* Use margin for top and bottom gutter so we can exploit collapsing margins */
    margin: 1rem auto;
    padding-left: 1rem;
    padding-right: 1rem;
    max-width: 34rem;
}
h1, h2, h3, h4, h5, h6 {
    /* Reset inherited: html */
    color: black;
}
h3, h4, h5, h6 {
    font-weight: 500;
}
a {
    color: hsl(0, 50%, 50%);
}
a:visited {
    color: hsl(0, 50%, 35%);
}
pre { overflow-x: auto; }
img, iframe { max-width: 100%; }

.grade {
    font-weight: bold;
}

.time-entry h3 {
    /* Reset composed: UA */
    /* Fallback */
    margin-bottom: initial;
    margin-bottom: unset;
}

.time-entry div {
    /* Reset inherited: html */
    color: hsl(0, 0%, 40%);
    /* Reset inherited: html */
    font-family: "Helvetica Neue", "Helvetica", sans-serif;
}

svg {
    margin-top: 1em;
    margin-bottom: 1em;
    display: block;
}
`;
