// Keep these in sync with the CSS variables in the `_css` directory
// Removed invalid @import statement. TailwindCSS should be imported in CSS files or configured in the Tailwind config file.
module.exports = {
  breakpoints: {
    s: 768,
    m: 1024,
    l: 1440,
  },
  colors: {
    base0: 'rgb(255, 255, 255)',
    base100: 'rgb(235, 235, 235)',
    base500: 'rgb(128, 128, 128)',
    base850: 'rgb(34, 34, 34)',
    base1000: 'rgb(0, 0, 0)',
    error500: 'rgb(255, 111, 118)',
  },
}
