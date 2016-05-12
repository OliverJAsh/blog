export default {
    title: 'Pitfalls of the img element for serving responsive images',
    body: `<p>At the Guardian we wanted to serve responsive images based solely on their rendered width in the page layout at each breakpoint. We explicitly decided not to respond to DPR, preferring to save on user bandwidth over increased image quality. Our first version of this used the <code>img</code> element in combination with the <code>sizes</code> and <code>srcset</code>, but we soon noticed holes in our implementation, which led to high DPR devices unintentionally incurring larger image downloads. In this post I will explain <a href="https://github.com/guardian/frontend/pull/12691">how we used the picture element to workaround this</a>, and how—once we decided to serve retina images—this enabled us to optimise for them separately.</p>
<p>For each size we provide a corresponding source image with a matching width. For example, at viewport widths greater or equal to 500px, the image appears at 700px wide in our layout. At all smaller viewport widths, the image appears at 300px wide in our layout. The code for this looks like so:</p>
<pre><code>&lt;img sizes=&quot;(min-width: 500px) 700px, 300px&quot;
     srcset=&quot;700.jpg 700w, 300.jpg 300w&quot; /&gt;
</code></pre>
<p>This works fine for “low DPR” devices, but we noticed that high DPR devices could greedily download a larger image. For example, on a device with a pixel ratio of 2 and a viewport width of 300px, the browser would select the correct size (<code>300px</code>) but the incorrect source (<code>700.jpg 700px</code>).</p>
<p>This was unintentional: our usage of sizes and srcset was strictly for serving images based on breakpoint width, not DPR!</p>
<p>We had forgotten that the browser’s formula for selecting the <code>img</code>’s source accounted for the device’s DPR. Doh!</p>
<p>Let’s remind ourselves how the browser selects a source:</p>
<dl>
<dt>selected size</dt>
<dd>first size with a media condition that evaluates true</dd>
<dt>ideal width</dt>
<dd>dpr * selected size</dd>
<dt>selected source</dt>
<dd>a source in <code>srcset</code> with a width descriptor closest to the ideal width</dd>
</dl>
<p>(This formula is not standardised, but it is seemingly consistent across the web platform.)</p>
<p>So how can we serve images that vary their width by breakpoint and <em>not DPR</em>?</p>
<p>The answer was the <code>picture</code> element, which allows you to provide multiple <code>source</code> elements, each with their own <code>sizes</code> and <code>srcset</code> attributes. Significantly, the <code>source</code> element also has a <code>media</code> attribute which allows you to guard the element from usage with a media condition. Using the <code>source</code> element we were able to split our <code>sizes</code> and <code>srcset</code> attributes by breakpoint. This meant high DPR devices could only choose from images available at the current breakpoint.</p>
<pre><code>&lt;picture&gt;
  &lt;source media=&quot;(min-width: 500px)&quot; sizes=&quot;700px&quot; srcset=&quot;700.jpg 700w&quot; /&gt;
  &lt;source sizes=&quot;300px&quot; srcset=&quot;300.jpg 300w&quot; /&gt;
  &lt;img /&gt;
&lt;/picture&gt;
</code></pre>
<p>(In many cases, content authors vary their image widths based on intervals instead of breakpoints, in which case it is safe to use a single <code>img</code> element with <code>sizes</code>/<code>srcset</code> attributes.)</p>
<p>This structure also gives us increased flexibility. For example, if we did decide to start serving retina images to compatible devices (<a href="https://github.com/guardian/frontend/pull/12079">which we did</a>), we could serve an additional <code>source</code> and match only high DPR devices. This has the added benefit of allowing us to <a href="https://blog.imgix.com/2016/03/30/dpr-quality.html">optimise separately for images we know will only be used on high DPR devices</a>.</p>`,
    date: new Date(2016, 4, 12)
};
