export default `
html {
    font-family: "Lora", "Georgia", serif;
    font-size: 18px;
    line-height: 1.4;
    color: hsl(0, 0%, 15%);
    -webkit-font-smoothing: antialiased;
}
body {
    /* Reset composed: UA */
    margin: 1rem;
    max-width: 34rem;
}
h1, h2, h3, h4, h5, h6 {
    /* Reset inherited: html */
    color: black;
}
h3, h4, h5, h6 {
    /* Reset inherited: html */
    font-family: "Helvetica Neue", "Helvetica", sans-serif;
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
`;
