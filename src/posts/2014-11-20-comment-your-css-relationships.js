export default {
    title: 'Comment Your CSS: Relationships',
    body: `<p>In this post, I will demonstrate situations in which we create relationships between rules in our CSS, before arguing for more discipline when authoring CSS to make such relationships explicit in our code.</p><h1 id="resets">Resets</h1><p>A DOM element can have multiple rules as the result of four different design patterns:</p><ul><li>When the HTML is configured, classes can be composed together on a single element, or the way the HTML is configured to create a DOM tree could result in elements inheriting styles from rules applied to parents.</li><li>At runtime, media queries can augment elements with additional rules.</li><li>When the CSS is authored, class inheritance results in an element having multiple rules.</li></ul><p>When an element has multiple rules, conflicting style declarations between these rules can result in <em>style resets</em>. The following examples demonstrate how style resets can occur when an element is rendered with multiple rules.</p><h2 id="class_composition">Class composition</h2><pre><code>.widget {
    border: 1px solid black;
    padding: 1rem;
}

.widget--alt {
    border: initial;
}

&lt;div class="widget widget--alt"&gt;&lt;/div&gt;</code></pre><img alt="The reset, as seen by Chrome DevTools’ style inspector" src="/images/archive/override-1.png"><p>In this example, when these classes are composed together on an element, <code>.widget-alt</code> <em>resets</em> <code>border</code> back to its <em>initial</em> value, <code>initial</code>. Thus, there is a relationship between <code>.widget</code> and <code>.widget--alt</code>.</p><p>(I have used BEM as an example of class composition because it is a realistic example given the best practices of the day.)</p><h2 id="style_inheritance">Style inheritance</h2><pre><code>body {
    text-align: center;
}

.widget {
    border: 1px solid black;
    padding: 1rem;
}

&lt;body&gt;
    &lt;div class="widget"&gt;&lt;/div&gt;
&lt;/body&gt;</code></pre><img alt="The inherited style, as seen by Chrome DevTools’ style inspector" src="/images/archive/inheritance-1.png"><p>Style inheritance means that elements can inherit <a href="http://www.w3.org/TR/CSS21/propidx.html">some styles</a> from rules applied to parent elements. In this example, the <code>div.widget</code> element will inherit a <code>text-align</code> style from the parent <code>body</code> element.</p><p>In many ways, style inheritance is a powerful feature of CSS because it allows you to easily scope styles. For example, we could use style inheritance to give the whole page a <code>font-family</code>.</p><p>If we don’t want to inherit a style that is by default inherited, we must opt-out. In the following example, <code>.widget</code> <em>resets</em> <code>text-align</code> back to its <em>initial</em> value, <code>initial</code>. Thus, there is a relationship between the <code>.widget</code> and <code>body</code> rules.</p><pre><code>.widget {
    border: 1px solid black;
    padding: 1rem;
    text-align: initial;
}</code></pre><img alt="The reset, as seen by Chrome DevTools’ style inspector" src="/images/archive/override-4.png"><p>Because of style inheritance, <code>.widget</code> could be penetrated with other styles depending on the DOM configuration, forgoing any hope of encapsulation. Why should <code>.widget</code> care about styles that it <em>might</em> inherit if it is used in a specific position in the DOM (in this case, a child of the <code>body</code> element)? With the addition of the <code>text-align</code> reset, <code>.widget</code> makes assumptions about what styles will appear on a parent somewhere. A truly ecanspulated class would not have to care about its environment. Our CSS shouldn’t need to know about how the HTML will be configured, because classes should be work whereever they reside in the DOM hierachy.</p><p>Fortunately, the forthcoming <a href="http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-201/#toc-style-scoped">Shadow DOM</a> features real encapsulation for CSS, requiring explicit opt-in to style inheritance (instead of having to explicitly opt-out like we do today).</p><h2 id="media_queries">Media queries</h2><pre><code>.widget {
    border: 1px solid black;
    padding: 1rem;
}

@media (min-width: 500px) {
    .widget {
        border: initial;
    }
}</code></pre><img alt="The reset, as seen by Chrome DevTools’ style inspector" src="/images/archive/override-2.png"><p>Media queries can augment elements with additional rules at runtime. In this example, <code>.widget</code> <em>resets</em> <code>border</code> back to its <em>initial</em> value, <code>initial</code>. Thus, there is a relationship between the two <code>.widget</code> rules.</p><h2 id="class_inheritance">Class inheritance</h2><pre><code>.heading-1 {
    font-size: 2rem;
    text-decoration: underline;
}

.page-title {
    @extend .heading-1;
    text-decoration: initial;
}

&lt;body&gt;
    &lt;div class="page-title"&gt;Home&lt;/div&gt;
&lt;/body&gt;</code></pre><p>Many CSS pre-processors enable fake class inheritance with the help of some sugar syntax. (I’m using Sass here; others may differ slightly in syntax.) Our pre-processor transpiles this by extending the <code>.heading-1</code> ruleset to add the <code>.page-title</code> selector. For reference, the output CSS we are really interested in looks like this:</p><pre><code>.heading-1,
.page-title {
    font-size: 2rem;
    text-decoration: underline;
}

.page-title {
    text-decoration: initial;
}

&lt;body&gt;
    &lt;div class="page-title"&gt;Home&lt;/div&gt;
&lt;/body&gt;</code></pre><img alt="The reset, as seen by Chrome DevTools’ style inspector" src="/images/archive/override-3.png"><p>As a result of class inheritance, subclasses are given two rules in the CSS. In this example, the <code>.page-title</code> subclass <em>resets</em> <code>text-decoration</code> back to its <em>initial</em> value, <code>initial</code>. Thus, there is a relationship between the two <code>.page-title</code> rules.</p><h1 id="positioning">Positioning</h1><p>Relationships can also occur between elements when a parent element creates a new <em>positioning context</em> or <em>stacking context</em>. This happens when you use a value of <code>relative</code> or <code>absolute</code> for the <code>position</code> style.</p><pre><code>.hero-image {
    background-image: url(&hellip;);
    position: relative;
}

.hero-image__text {
    position: absolute;
    bottom: 0;
    left: 0;
}

&lt;div class="hero-image"&gt;
    &lt;div class="hero-image__text"&gt;Some text on top of the hero image&lt;/div&gt;
&lt;/div&gt;</code></pre><p>In this example, <code>.hero-image__text</code> positions itself at the absolute bottom left of its <em>current positioning context</em>, which is defined by the parent <code>.hero-image</code>. Thus, there is a relationship between <code>.hero-image</code> and <code>.hero-image__text</code>.</p><p>Likewise, any child of a relative or absolutely positioned element that has a <code>z-index</code> will also have a relationship because this position setting creates a new stacking context.</p><h1 id="comment_your_css">Comment Your CSS</h1><p>If we model these relationships in our head when we author CSS, why don’t we model them in our code? We’re likely to forget these relationships exist at all if they are not documented.</p><pre><code>.widget {
    /* border: 1px solid black; */
    padding: 1rem;
}

.widget--alt {
    border: initial;
}

&lt;div class="widget widget--alt"&gt;&lt;/div&gt;</code></pre><p>Imagine you revisit a BEM “block class” (in this example, <code>.widget</code>) to remove its <code>border</code> (now commented out). In this example, a relationship has been broken between <code>.widget</code> and <code>.widget--alt</code>. Previously the BEM “modifier class” reset the <code>border</code> style back to its initial value. It’s easy to see that we can now remove the <code>border</code> declaration from <code>.widget--alt</code>.</p><p>In a large codebase, it could be difficult to see when you have broken relationships. Furthermore, and as we have seen, relationships can exist in several other forms, which could be manifested like spaghetti across your codebase. In my experience, this can lead to stray CSS. <strong>Any change you make in CSS could deem other styles redundant.</strong></p><blockquote><p>CSS is write only. You need to know every possible configuration of HTML you will ever render to know when it’s safe to delete a rule <span>or style</span>.</p></blockquote><p>– <a href="http://youtu.be/VkTCL6Nqm6Y?t=23m41s">Pete Hunt</a></p><p>The big problem with stray CSS is that, if left undocumented, it can self-perpetuate: you overcome the stray CSS with a quick fix by resetting it, yet resets were the problem that lead to stray CSS in the first place. Alternatively, you can manually challenge each style to test its prevailing relevance given the current usage, but this can only be done by CSS experts. I call this phenomenon “reset culture”, whereby resets are constantly hacked into the codebase as a quick fix.</p><img alt="The reset, as seen by Chrome DevTools’ style inspector" src="/images/archive/override-1.png"><p>When I look at my CSS, I want to know why styles exist so I know what’s safe to delete or change. Developer tools can show us how our CSS plays together, but we can’t see it in our codebase.</p><p><a href="https://gist.github.com/OliverJAsh/aeb5bf62e062ecc294d7">I have long wished for an IDE to show me the result of my CSS</a> in the same way browser developer tools do. For now, I’ve resorted to discipline in the form of commenting all relationships.</p><pre><code>.widget {
    border: 1px solid black;
    padding: 1rem;
}

.widget--alt {
    // Reset: .widget
    border: initial;
}

&lt;div class="widget widget--alt"&gt;&lt;/div&gt;</code></pre><p>If a relationship is broken in a future version of this CSS and the author forgets to clean up, anyone who does revisit the redundant style will see, because of the comment, that it is no longer needed. If the stray CSS was left undocumented, it would likely never be removed (unless manually challenged), adding bloat to the codebase and creating a culture of fear in the CSS whereby the solution is to always override unusual looking styles. The same is true for all the other relationships I demonstrated previously.</p><p>Ultimately, resets are a side effect of the cascade. We should ask ourselves whether the cascade works for or against us for the sort of websites (or web apps, rather) that we build today. I hope we will see more research into the relevance of CSS today.</p><h1 id="postscript">Postscript</h1><ol><li>In the resets section I used the <code>initial</code> and <code>inherit</code> keywords. This could be improved by using the <code>unset</code> keyword, which evaluates to <code>inherit</code> for styles that are inherited by default, and <code>initial</code> for all other styles. Unfortunately, <code>unset</code> was not widely supported at the time of writing.</li><li>We will see more relationships between our rules as we begin to use CSS flexbox.</li><li>Disclaimer: the CSS for this site is very old.</li></ol>`,
    date: new Date(2014, 10, 20)
};