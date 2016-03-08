export default {
    showcase: true,
    title: 'Methods for Modifying Objects in OOCSS',
    body: `<p>There are two ways of implementing object modifiers in CSS: extending objects in the CSS, or deferring the work to your HTML and concatenating classes there instead. In this article, I introduce the purpose of a modifier in OOCSS, and then I investigate the advantages and disadvantages of using both methods, as well as claims that <code>@extend</code>s can <a href="https://twitter.com/csswizardry/status/261056433607569409">sometimes be a fools gold</a>.</p><h2 id="what_is_a_modifier">What is a Modifier?</h2><p>For those who are new to the idea of OOCSS, let’s take a look at a simple example of where we might apply the priniciples of object modifiers.</p><pre><code>.widget {
  padding: 10px;
}</code></pre><p>Here we have a <code>widget</code> object, the purpose of which is self-explanatory. <code>widget</code> has some padding, but say for example that the design I was working on occasionally demonstrated the need for a widget with a border. A DRY method would be to extend and then modify my <code>widget</code> object, so I don’t end up doing something like this:</p><pre><code>.widget {
  padding: 10px;
}

.widget-alt {
  padding: 10px;
  border: 1px solid #ccc;
}</code></pre><p>Our new <code>widget-alt</code> object (short for alternative widget) has a border, but duplicates the padding of <code>widget</code>. Going back to our design, it clearly demonstrates that all widgets have this padding. At this point, we should acknowledge that we have a pattern going on. By extending my original <code>widget</code> object, I can avoid repeating the padding property declaration:</p><pre><code>.widget,
.widget-alt {
  padding: 10px;
}

.widget-alt {
  border: 1px solid #ccc;
}</code></pre><h2 id="with_preprocessors__extending">With Preprocessors – Extending</h2><p>For the benefit of the organisation of our CSS, it’s not always practical to extend selectors manually like this just so that our objects can share properties. Imagine you had many sorts of widget – each time you’re going to have to go back to your handcrafted group selector and extend it. Not with some <a href="http://sass-lang.com/"><code>@extend</code> magic</a>.</p><pre><code>/* Our pattern */
.widget {
  padding: 10px;
}

.widget-alt {
  @extend .widget;
  border: 1px solid #ccc;
}</code></pre><p>Seriously, if you’re writing OOCSS, CSS preprocessors and this method in particular are a no brainer. This simple use of <code>@extend</code> will produce exactly the same CSS as we had before – it’s just easier for us to maintain this way, as the project grows.</p><h3 id="the_problem_with_extend">The Problem with Extend</h3><p>Look at this extended example of the <code>widget</code> object, which now styles some of its descendants too:</p><pre><code>/* SCSS */

.widget {
  padding: 10px;

  h1 {
    margin-bottom: 10px;
  }

  p {
    /* Handy tip, preprocessors will convert any CSS3 \`hsl\` value to \`rgb\`. \`hsl\` is much easier on the mind, and therefore easier to adjust colours. Another reason why I love preprocessors. */
    color: hsl(0, 0%, 10%);
  }
}</code></pre><p>Now what if I need to extend this object to create a modifier?</p><pre><code>/* SCSS */

.widget-alt {
  @extend .widget;
  border: 1px solid hsl(0, 0%, 90%);
}

/* CSS */

.widget,
.widget-alt {
  padding: 10px;
}

.widget h1,
.widget-alt h1 {
  margin-bottom: 10px;
}

.widget p,
.widget-alt p {
  color: rgb(26, 26, 26);
}

.widget-alt {
  border: 1px solid rgb(230, 230, 230);
}</code></pre><p>This is the sort of situation where <code>@extend</code> may pose a problem or two, because <strong>extending an object will also extend every nested object</strong>. As you can see, <code>widget</code> doesn’t just share itself with <code>widget-alt</code>, but also its descendants, which in this example are the <code>h1</code> and <code>p</code> elements. This has already increased our CSS more than is necessary, and will eventually lead to very long selectors (on bigger projects).</p><p>Now say for instance that we need to adjust the trailing margin of all <code>widget</code> objects that are within the sidebar. But how are we going to target those widgets?</p><pre><code>/* SCSS */
.l-sidebar {
  .widget,
  .widget-alt {
    margin-bottom: 25px;
  }
}

/* CSS */
.l-sidebar .widget,
.l-sidebar .widget-alt {
  margin-bottom: 25px;
}</code></pre><p>We have to list off every single variation of <code>widget</code> to make sure the styles get applied to all widgets.</p><p>This might not seem like much, but as we begin to extend our <code>widget</code> object more and more to account for any other variations (i.e. <code>widget-primary</code>, <code>widget-secondary</code>), we will very quickly end up with CSS that resembles spaghetti.</p><h2 id="with_html__concatenated_classes">With HTML – Concatenated Classes</h2><p>It would be much more efficient if we could target all kinds of widget with a single hook. This is why I believe we should get into the habit of deferring work to the HTML. Let’s see how.</p><pre><code>/* SCSS */

.l-sidebar {
  .widget {
    margin-bottom: 25px;
  }
}

.widget {
  padding: 10px;

  h1 {
    margin-bottom: 10px;
  }

  p {
    color: hsl(0, 0%, 10%);
  }
}

.widget-alt {
  border: 1px solid rgb(230, 230, 230);
}

/* CSS */

.l-sidebar .widget {
  margin-bottom: 25px;
}

.widget {
  padding: 10px;
}

.widget h1 {
  margin-bottom: 10px;
}

.widget p {
  color: hsl(0, 0%, 10%);
}

.widget-alt {
  border: 1px solid rgb(230, 230, 230);
}</code></pre><p>In order to get the correct styles, we would have to use both classes in our HTML.</p><pre><code>&lt;div class="widget widget-alt"&gt;
  &hellip;
&lt;/div&gt;</code></pre><p>Some people would prefer to avoid appending classes to their HTML. Personally, I think that concatenating classes onto an element is the superior way of extending an object in OOCSS. The truth of the matter is that, by deferring the work away from the CSS and towards the HTML, we have much more efficient CSS. This simple example just uses a single modifier, but if we had several modifiers of the <code>widget</code> object (i.e. <code>widget-primary</code>, <code>widget-secondary</code>), then it would soon become clear that relying on the CSS to do the work for us results in messy group selectors.</p><h2 id="the_efficiency_of_using_extends">The Efficiency of Using Extends</h2><p>Let’s take a look at our widget example again, but this time we’ll add another modifier:</p><pre><code>/* SCSS */

.widget {
  …

  h1 {
    …
  }

  p {
    …
  }
}

.widget-alt {
  @extend .widget;

  …
}

.widget-box {
  @extend .widget;

  …
}

/* CSS */

.widget,
.widget-alt,
.widget-box {
  …
}

.widget h1,
.widget-alt h1,
.widget-box h1 {
  …
}

.widget p,
.widget-alt p,
.widget-box p {
  …
}

.widget-alt {
  …
}

.widget-box {
  …
}</code></pre><p>This leaves us with:</p><ul><li>3 selectors, in 1 group of 3, to share the styles of the original object with the modifier objects</li><li>6 selectors, in 2 groups of 3, to share the styles of original object’s descendants of the original object with the modifier objects.</li></ul><p>In the examples above, the <code>@extend</code> method for modifying our <code>widget</code> object outputs a total of 25 lines of CSS, whereas the concatenated classes method outputs 19. The difference here is minimal, but let’s look at a bigger example.</p><p>Imagine your project has 10 objects (a widget, navigation list, etc.), each of which have 2 modifiers (<code>widget-alt</code>, <code>widget-box</code>, etc.) and an average of 2 descendant selectors. Using the <code>extend</code> method would leave you with:</p><ul><li>30 selectors, in 10 groups of 3, to share the original object styles with the modifier objects</li><li>60 selectors, in 20 groups of 3, to share the descendants of the original object with the modifier objects.</li></ul><p>If we counted a line per selector, then we would have 90 lines of CSS just for selecting the appropriate modifiers and descendants. In comparison, the same sample of objects, instead using concatenated classes in the HTML, would take up 30 lines of CSS. Of course, using this method we would also have to append an additional class in our HTML. However, 99% of the time, this would be more efficient.</p><h2 id="conclusion">Conclusion</h2><p>In conclusion, I personally believe it is better to defer the work of object modifiers to the HTML. This is not only because it is more efficient (most of the time) – I think the difference in these methods really starts to show when you need to modify an object that lives within another object, for example, adjusting the trailing margin of all widgets in the sidebar. There are times like this when, using extend, we would have to list, manually, all of our object modifiers. It’s a bit like when you need to adjust the CSS of all headings inside an object. You could do this:</p><pre><code>.widget {
  padding: 10px;
}

.widget-alt {
  padding: 10px;
  border: 1px solid #ccc;
}</code></pre><p>Alternatively, you may just add a class to your HTML, reducing the complexity of your CSS:</p><pre><code>.widget {
  padding: 10px;
}

.widget-alt {
  padding: 10px;
  border: 1px solid #ccc;
}</code></pre><p>If you have an different view on anything I’ve said here, please do let me know over on <a href="https://twitter.com/OliverJAsh">Twitter</a>. I’m incredibly critical of the methods I use in practice (like any front-end developer should be, really). All criticism is good.</p>`,
    date: new Date(2012, 8, 7)
};
