export default {
    showcase: true,
    title: 'CSS Exceptions: Object Modifiers or Extensions?',
    body: `<p>Harry Roberts recently published his thoughts on <a href="http://csswizardry.com/2012/11/code-smells-in-css/">code that smells</a>. In this article, Harry included a section on <em>undoing styles</em>:</p><blockquote><p>Any CSS that unsets styles (apart from in a reset) should start ringing alarm bells right away. The very nature of CSS is that things will, well, cascade and inherit from things defined previously. Rulesets should only ever inherit and add to previous ones, never undo.</p></blockquote><p>This made me think about my own practices for undoing styles. In this article, I will look at methods for coding CSS exceptions with undoing styles, and then without undoing styles, to see what is the better method with regards to OOCSS.</p><h2 id="introduction">Introduction</h2><p>Imagine we have a <code>widget</code> object. Our <code>widget</code> has a border, some padding, and some font sizing:</p><pre><code>/* Object */
.widget {
  border: 1px solid #ccc;
  padding: 0.5em;
  font-size: 12px;
}</code></pre><p>Let’s just say that <code>widget</code> object is used <strong>four times</strong> on the page. Our design also has another kind of widget, which has all the same properties as <code>widget</code>, but no padding or border. This widget, however, only appears <strong>one time</strong> on the page.</p><h2 id="using_object_modifiers">Using Object Modifiers</h2><p>What we could do is add an <em>object modifier</em> for the exception (that, remember, only appears once on the page). Let’s call ours <code>widget-secondary</code>.</p><pre><code>/* Object */
.widget {
  border: 1px solid #ccc;
  padding: 0.5em;
  font-size: 12px;
}

/* Object modifier (Exception) */
.widget-secondary {
  /* unset */
  border: none;
  /* unset */
  padding: 0;
  font-size: 12px;
}</code></pre><p>Our object, <code>widget</code>, assumes that all widgets will have a border and padding. Our object modifier, <code>widget-secondary</code>, just unsets the properties that are not needed for the exception.</p><p>This method requires the developer to analyse the design and decide on <em>defaults</em>. For instance, here we recognised that 4/5 widgets had a padding and border, so the <code>widget</code> object inherited those styles, whereas <code>widget-secondary</code> opts-out of those styles to create the exceptions.</p><p>By creating a modifier for the exception, we only have to concatenate additional classes in our HTML for the exceptions:</p><pre><code>&lt;div class="widget"&gt;&hellip;&lt;/div&gt;
&lt;div class="widget"&gt;&hellip;&lt;/div&gt;
&lt;div class="widget"&gt;&hellip;&lt;/div&gt;
&lt;div class="widget"&gt;&hellip;&lt;/div&gt;
&lt;!-- Exception --&gt;
&lt;div class="widget widget-secondary"&gt;&hellip;&lt;/div&gt;</code></pre><h2 id="using_object_extensions">Using Object Extensions</h2><p>Going back to Harry’s argument that CSS which unsets properties is smelly code, Harry instead argues that ‘rulesets should only ever inherit and add to previous ones, never undo’. To adhere to this principle, we must replace our object modifier with an <em>object extension</em>. In this example, we will call it <code>widget-primary</code>:</p><pre><code>/* Object (Exception) */
.widget {
  font-size: 12px;
}

/* Object extension */
.widget-primary {
  border: 1px solid #ccc;
  padding: 0.5em;
}</code></pre><p>Here we are not undoing any styles, so our CSS is shorter. Maintenance is easier because we don’t have to remember that any styles we add to <code>widget</code> also need to be undone by a modifier. But because we now have to opt-in for even the most common styles (border and padding), we have more classes in our HTML:</p><pre><code>&lt;div class="widget widget-primary"&gt;&hellip;&lt;/div&gt;
&lt;div class="widget widget-primary"&gt;&hellip;&lt;/div&gt;
&lt;div class="widget widget-primary"&gt;&hellip;&lt;/div&gt;
&lt;div class="widget widget-primary"&gt;&hellip;&lt;/div&gt;
&lt;!-- Exception --&gt;
&lt;div class="widget"&gt;&hellip;&lt;/div&gt;</code></pre><h2 id="conclusion">Conclusion</h2><p>In conclusion, it seems that by analysing the design to decide on defaults, and undoing styles for any exceptions that occur thereafter, our CSS becomes more complex. We have to remember that any styles added to an object might also have to be maintained (modified or undone) in any object modifiers. This can be overcome by replacing object modifiers with object extensions, but then we have to concatenate additional classes in our HTML.</p><p>In the past, I have always used object modifiers (undoing styles) myself in an attempt to refrain from adding more classes in my markup. However, this appears to be <a href="/2012/09/07/methods-for-modifying-objects-in-oocss.html">just another reason why you should defer work to your HTML</a> in order to keep your CSS tidy and maintainable. In the future I will be using object extensions instead. If you’re still uncomfortable littering your HTML with classes, then have a look at <a href="https://gist.github.com/4136435">this case study by Harry Roberts</a> which demonstrates how small of a difference it makes to file sizes.</p>`,
    date: new Date(2012, 10, 23)
};
