export default {
    title: 'Morph animation between positions using FLIP',
    body: `<p>In my work at the Guardian we have been thinking about how to improve the design of the site header and navigation. One of the ideas we had was for the site navigation button to morph into a fullscreen modal containing the site navigation upon user interaction. This <a href="https://www.google.com/design/spec/animation/meaningful-transitions.html#meaningful-transitions-visual-continuity">visual continuity</a>, inspired by <a href="https://www.google.com/design/spec/material-design/introduction.html">Material Design</a>, helps to guide the user’s attention.</p>
<p>How could this animation be achieved using the web platform?</p>
<p>When collapsed, the navigation button should be part of the document flow, and upon user interaction, it should expand to a fixed element which covers the screen. Significantly, I wanted the animation to be buttery smooth and play at 60fps, so I could only animate <a href="http://www.sitepoint.com/introduction-to-hardware-acceleration-css-animations/">CSS properties which supported hardware acceleration</a>.</p>
<p>Here is the final result:</p>
<iframe width="320" height="568" src="https://www.youtube.com/embed/CkLogp-hxTs" frameborder="0" allowfullscreen></iframe>
<p>(Alternatively view at <a href="https://www.youtube.com/watch?v=CkLogp-hxTs">https://www.youtube.com/watch?v=CkLogp-hxTs</a>.)</p>
<p>The answer was to use <a href="https://aerotwist.com/blog/flip-your-animations/">Paul Lewis’ First Last Invert Play (FLIP)</a> technique. When the user clicks the button:</p>
<ul>
<li>First: calculate the current position of the button in its collapsed state using <code>Element.getBoundingClientRect</code>.</li>
<li>Last: apply the expanded state (fixed) and calculate the new position using <code>Element.getBoundingClientRect</code>. This triggers a forced synchronous layout, but we have 100ms to respond (see <a href="https://developers.google.com/web/tools/chrome-devtools/profile/evaluate-performance/rail">Response Animate Idle Load (RAIL)</a>), so that’s fine.</li>
<li>Invert: use CSS transforms to mimic the collapsed state. This can be calculated using our first and last positions.</li>
<li>Play: enable CSS transitions and undo the inverted styles. The browser will then play out the animation smoothly at 60fps.</li>
</ul>
<p>We can use the same technique to collapse the button when it’s in its expanded state.</p>
<p>Here is the code: <a href="http://jsbin.com/jakipid/1/edit?html,output">http://jsbin.com/jakipid/1/edit?html,output</a></p>
<p>I think FLIP is a great technique for animations such as this. If you’re interested in learning more, <a href="https://aerotwist.com/blog/flip-your-animations/">go ahead and read Paul Lewis’ introduction to the technique</a>.</p>`,
    date: new Date(2016, 2, 26)
};
