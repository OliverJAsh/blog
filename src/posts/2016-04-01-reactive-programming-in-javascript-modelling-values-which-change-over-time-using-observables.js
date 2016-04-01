export default {
    title: 'Reactive programming in JavaScript: modelling values which change over time using Observables',
    body: `<p>I see a lot of JavaScript that uses <code>let</code> and <code>var</code> for the purpose of modelling values which change over time. In this post I will demonstrate how the same can be achieved with a higher level abstraction called <a href="https://gist.github.com/staltz/868e7e9bc2a7b8c1f754">Observables</a> for improved code readability.</p>
<p>Here is a basic counter example that uses <code>let</code> to store the current value of the counter. The variable is re-assigned at various points in the program.</p>
<pre><code>const counterEl =
  document.querySelector('.counter');
const incrementButtonEl =
  document.querySelector('.increment-button');
const decrementButtonEl =
  document.querySelector('.decrement-button');

let counter = 0;

const render = () => {
  counterEl.innerHTML = counter;
};

incrementButtonEl.addEventListener('click', () => {
  counter = counter + 1;
  render();
});
decrementButtonEl.addEventListener('click', () => {
  counter = counter - 1;
  render();
});
render();
</code></pre>
<p>Full code: <a href="http://jsbin.com/fihilip/1/edit?html,js,output">http://jsbin.com/fihilip/1/edit?html,js,output</a></p>
<p>The flow of the program is like so: on initialisation and when an event happens (i.e. the user clicks the increment or decrement button), we re-assign the global counter variable with the new value and then we call the <code>render</code> function which uses the global <code>counter</code> variable.</p>
<p>What is bad about this approach?</p>
<ul>
<li>
<p>Looking at the structure of this code, the flow of the program is not immediately noticeable. For example, it’s not immediately clear when and where the <code>counter</code> variable gets re-assigned, or when and where <code>render</code> gets called. These details are nested in the implementation.</p>
</li>
<li>
<p>We can’t test <code>render</code> because it depends on a variable scoped to this closure.</p>
</li>
<li>
<p>We have to call <code>render</code> in more than one place (once for each event).</p>
</li>
<li>
<p>We are using <code>let</code> to model <em>a value that changes over time</em>. There is nothing about the statement <code>let counter = 0</code> to tell you that this variable will be re-assigned later, instead you have to infer it from reading the code. In larger modules, this can make code very difficult to read, because any function that depends on this variable may have unexpected results if the variable has been re-assigned unexpectedly. We should instead be striving to write <a href="http://blog.jenkster.com/2015/12/what-is-functional-programming.html">pure functions</a>.</p>
</li>
</ul>
<p>How could we <em>declaratively</em> define a value that changes over time? In functional programming, we have a primitive for representing asynchronous streams of data called <a href="https://gist.github.com/staltz/868e7e9bc2a7b8c1f754">Observables</a> (or <a href="http://package.elm-lang.org/packages/elm-lang/core/3.0.0/Signal">signals</a> in <a href="http://elm-lang.org/">Elm</a>). The Observable primitive is provided in the <a href="https://github.com/Reactive-Extensions/RxJS">RxJS</a> library, and is <a href="https://youtu.be/lil4YCCXRYc?t=25m56s">being considered for addition to the language as part of ES2016</a>.</p>
<p>Our counter can be thought of as a number that changes over time. When the value changes, we want to call <code>render</code>, passing in the new value. Let’s go ahead and declare exactly that.</p>
<pre><code>const render = counter => {
  counterEl.innerHTML = counter;
};

counter.subscribe(render);
</code></pre>
<p>For this to work we need to define <code>counter</code>. Conceptually, a counter:</p>
<ol>
<li>
<p>starts with a value of 0;</p>
</li>
<li>
<p>emits new values by incrementing or decrementing the previous value as the user clicks the respective buttons.</p>
</li>
</ol>
<p>Before we can model <code>counter</code>, we must first model the increment and decrement actions.</p>
<p>Like our counter, these actions can be thought of conceptually as values that change over time. In this case, our actions will emit a new event object each time the user clicks one of the buttons.</p>
<pre><code>const increment =
  Rx.Observable.fromEvent(incrementButtonEl, 'click');

const decrement =
  Rx.Observable.fromEvent(decrementButtonEl, 'click');
</code></pre>
<p>Now that we have Observables representing our increment and decrement actions, we can map them to a delta. Increment should add 1, decrement should subtract 1.</p>
<pre><code>const increment =
  Rx.Observable.fromEvent(incrementButtonEl, 'click')
    .map(() => +1);

const decrement =
  Rx.Observable.fromEvent(decrementButtonEl, 'click')
    .map(() => -1);
</code></pre>
<p>Then we can define an Observable of deltas by <a href="http://rxmarbles.com/#merge">merging</a> our <code>increment</code> and <code>decrement</code> Observables.</p>
<pre><code>const deltas = Rx.Observable.merge(increment, decrement);
</code></pre>
<p>We can use this Observable of deltas to update the value of our counter. As we identified earlier, the counter should start with a value of 0, and emits new values by incrementing or decrementing the previous value as the user clicks the respective buttons (i.e. when <code>deltas</code> emits a new value).</p>
<p><a href="http://rxmarbles.com/#scan"><code>scan</code></a> is like <code>Array.prototype.reduce</code> but instead of reducing an array, we are reducing a stream of values over time: each time the stream emits a new value, we compute the new accumulator (in this case our counter value) from the previous and new values.</p>
<pre><code>const counter = deltas
  .startWith(0)
  .scan((acc, delta) => acc + delta);
</code></pre>
<p>There we have it. <code>counter</code> is an Observable that starts with 0 and then scans over values from our stream of deltas to compute the next value. When the counter value changes, we render the new value to the DOM.</p>
<p>How is this better?</p>
<ul>
<li>
<p>The code for our <code>counter</code> Observable is strikingly close to our mental model. Try comparing the code to the conceptual definition of a counter value I gave earlier.</p>
</li>
<li>
<p><code>counter</code> is defined as a <code>const</code>, which means the value of the variable can never be re-assigned, so there are no surprises when this variable is used. This means we can write <a href="http://blog.jenkster.com/2015/12/what-is-functional-programming.html">pure functions</a>.</p>
</li>
<li>
<p>To understand where and when the Observable emits new values, we can refer to its definition and work backwards from there, whereas when we were using <code>let</code> to model our counter, we had to search the codebase for usages of our variable. This is what it means to be declarative.</p>
</li>
<li>
<p>By raising the level of abstraction, the flow of our program is now immediately clear. Whereas before the flow was deeply embedded in implementation details (i.e. nested in the event handler), now the flow is at the very top of our program.</p>
</li>
<li>
<p>This code is also easier to test, because we can pass a counter value into the render function instead of depending on a global variable.</p>
</li>
</ul>
<p>Full code: <a href="http://jsbin.com/murupi/1/edit?html,js,output">http://jsbin.com/murupi/1/edit?html,js,output</a></p>
<p>This way of modelling programs goes by the name of <a href="https://gist.github.com/staltz/868e7e9bc2a7b8c1f754">reactive programming</a>. To learn more about this, I recommend reading <a href="https://gist.github.com/staltz/868e7e9bc2a7b8c1f754">The introduction to Reactive Programming you’ve been missing</a> by <a href="https://twitter.com/andrestaltz">André Staltz</a>. The example I’ve given here demonstrates the basic differences between these two approaches, but the benefits described are <a href="https://github.com/Reactive-Extensions/RxJS/blob/master/examples/autocomplete/autocomplete.js">even more striking as the program scales</a>.</p>
<p>Thanks to <a href="https://twitter.com/NataliaLKB">Natalia Baltazar</a> and <a href="https://twitter.com/theefer">Sébastien Cevey</a> for reviewing this article.</p>`,
    date: new Date(2016, 3, 1)
};
