import{s as I,f as K,g as Et,e as Vt}from"./transform-DMmrTYh2.js";const ft=Math.PI,gt=2*ft,Y=1e-6,Ft=gt-Y;function vt(a){this._+=a[0];for(let t=1,e=a.length;t<e;++t)this._+=arguments[t]+a[t]}function Bt(a){let t=Math.floor(a);if(!(t>=0))throw new Error(`invalid digits: ${a}`);if(t>15)return vt;const e=10**t;return function(n){this._+=n[0];for(let i=1,o=n.length;i<o;++i)this._+=Math.round(arguments[i]*e)/e+n[i]}}class Qt{constructor(t){this._x0=this._y0=this._x1=this._y1=null,this._="",this._append=t==null?vt:Bt(t)}moveTo(t,e){this._append`M${this._x0=this._x1=+t},${this._y0=this._y1=+e}`}closePath(){this._x1!==null&&(this._x1=this._x0,this._y1=this._y0,this._append`Z`)}lineTo(t,e){this._append`L${this._x1=+t},${this._y1=+e}`}quadraticCurveTo(t,e,n,i){this._append`Q${+t},${+e},${this._x1=+n},${this._y1=+i}`}bezierCurveTo(t,e,n,i,o,s){this._append`C${+t},${+e},${+n},${+i},${this._x1=+o},${this._y1=+s}`}arcTo(t,e,n,i,o){if(t=+t,e=+e,n=+n,i=+i,o=+o,o<0)throw new Error(`negative radius: ${o}`);let s=this._x1,r=this._y1,d=n-t,c=i-e,h=s-t,l=r-e,p=h*h+l*l;if(this._x1===null)this._append`M${this._x1=t},${this._y1=e}`;else if(p>Y)if(!(Math.abs(l*d-c*h)>Y)||!o)this._append`L${this._x1=t},${this._y1=e}`;else{let u=n-s,m=i-r,g=d*d+c*c,y=u*u+m*m,k=Math.sqrt(g),C=Math.sqrt(p),x=o*Math.tan((ft-Math.acos((g+p-y)/(2*k*C)))/2),b=x/C,w=x/k;Math.abs(b-1)>Y&&this._append`L${t+b*h},${e+b*l}`,this._append`A${o},${o},0,0,${+(l*u>h*m)},${this._x1=t+w*d},${this._y1=e+w*c}`}}arc(t,e,n,i,o,s){if(t=+t,e=+e,n=+n,s=!!s,n<0)throw new Error(`negative radius: ${n}`);let r=n*Math.cos(i),d=n*Math.sin(i),c=t+r,h=e+d,l=1^s,p=s?i-o:o-i;this._x1===null?this._append`M${c},${h}`:(Math.abs(this._x1-c)>Y||Math.abs(this._y1-h)>Y)&&this._append`L${c},${h}`,n&&(p<0&&(p=p%gt+gt),p>Ft?this._append`A${n},${n},0,1,${l},${t-r},${e-d}A${n},${n},0,1,${l},${this._x1=c},${this._y1=h}`:p>Y&&this._append`A${n},${n},0,${+(p>=ft)},${l},${this._x1=t+n*Math.cos(o)},${this._y1=e+n*Math.sin(o)}`)}rect(t,e,n,i){this._append`M${this._x0=this._x1=+t},${this._y0=this._y1=+e}h${n=+n}v${+i}h${-n}Z`}toString(){return this._}}function E(a){return function(){return a}}function zt(a){let t=3;return a.digits=function(e){if(!arguments.length)return t;if(e==null)t=null;else{const n=Math.floor(e);if(!(n>=0))throw new RangeError(`invalid digits: ${e}`);t=n}return a},()=>new Qt(t)}function qt(a){return typeof a=="object"&&"length"in a?a:Array.from(a)}function Ct(a){this._context=a}Ct.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line=1-this._line},point:function(a,t){switch(a=+a,t=+t,this._point){case 0:this._point=1,this._line?this._context.lineTo(a,t):this._context.moveTo(a,t);break;case 1:this._point=2;default:this._context.lineTo(a,t);break}}};function Mt(a){return new Ct(a)}function St(a){return a[0]}function _t(a){return a[1]}function pt(a,t){var e=E(!0),n=null,i=Mt,o=null,s=zt(r);a=typeof a=="function"?a:a===void 0?St:E(a),t=typeof t=="function"?t:t===void 0?_t:E(t);function r(d){var c,h=(d=qt(d)).length,l,p=!1,u;for(n==null&&(o=i(u=s())),c=0;c<=h;++c)!(c<h&&e(l=d[c],c,d))===p&&((p=!p)?o.lineStart():o.lineEnd()),p&&o.point(+a(l,c,d),+t(l,c,d));if(u)return o=null,u+""||null}return r.x=function(d){return arguments.length?(a=typeof d=="function"?d:E(+d),r):a},r.y=function(d){return arguments.length?(t=typeof d=="function"?d:E(+d),r):t},r.defined=function(d){return arguments.length?(e=typeof d=="function"?d:E(!!d),r):e},r.curve=function(d){return arguments.length?(i=d,n!=null&&(o=i(n)),r):i},r.context=function(d){return arguments.length?(d==null?n=o=null:o=i(n=d),r):n},r}function Dt(a,t,e){var n=null,i=E(!0),o=null,s=Mt,r=null,d=zt(c);a=typeof a=="function"?a:a===void 0?St:E(+a),t=typeof t=="function"?t:E(t===void 0?0:+t),e=typeof e=="function"?e:e===void 0?_t:E(+e);function c(l){var p,u,m,g=(l=qt(l)).length,y,k=!1,C,x=new Array(g),b=new Array(g);for(o==null&&(r=s(C=d())),p=0;p<=g;++p){if(!(p<g&&i(y=l[p],p,l))===k)if(k=!k)u=p,r.areaStart(),r.lineStart();else{for(r.lineEnd(),r.lineStart(),m=p-1;m>=u;--m)r.point(x[m],b[m]);r.lineEnd(),r.areaEnd()}k&&(x[p]=+a(y,p,l),b[p]=+t(y,p,l),r.point(n?+n(y,p,l):x[p],e?+e(y,p,l):b[p]))}if(C)return r=null,C+""||null}function h(){return pt().defined(i).curve(s).context(o)}return c.x=function(l){return arguments.length?(a=typeof l=="function"?l:E(+l),n=null,c):a},c.x0=function(l){return arguments.length?(a=typeof l=="function"?l:E(+l),c):a},c.x1=function(l){return arguments.length?(n=l==null?null:typeof l=="function"?l:E(+l),c):n},c.y=function(l){return arguments.length?(t=typeof l=="function"?l:E(+l),e=null,c):t},c.y0=function(l){return arguments.length?(t=typeof l=="function"?l:E(+l),c):t},c.y1=function(l){return arguments.length?(e=l==null?null:typeof l=="function"?l:E(+l),c):e},c.lineX0=c.lineY0=function(){return h().x(a).y(t)},c.lineY1=function(){return h().x(a).y(e)},c.lineX1=function(){return h().x(n).y(t)},c.defined=function(l){return arguments.length?(i=typeof l=="function"?l:E(!!l),c):i},c.curve=function(l){return arguments.length?(s=l,o!=null&&(r=s(o)),c):s},c.context=function(l){return arguments.length?(l==null?o=r=null:r=s(o=l),c):o},c}function yt(a,t,e){a._context.bezierCurveTo(a._x1+a._k*(a._x2-a._x0),a._y1+a._k*(a._y2-a._y0),a._x2+a._k*(a._x1-t),a._y2+a._k*(a._y1-e),a._x2,a._y2)}function $t(a,t){this._context=a,this._k=(1-t)/6}$t.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:yt(this,this._x1,this._y1);break}(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line=1-this._line},point:function(a,t){switch(a=+a,t=+t,this._point){case 0:this._point=1,this._line?this._context.lineTo(a,t):this._context.moveTo(a,t);break;case 1:this._point=2,this._x1=a,this._y1=t;break;case 2:this._point=3;default:yt(this,a,t);break}this._x0=this._x1,this._x1=this._x2,this._x2=a,this._y0=this._y1,this._y1=this._y2,this._y2=t}};const ht=(function a(t){function e(n){return new $t(n,t)}return e.tension=function(n){return a(+n)},e})(0);function Tt(a,t){this._context=a,this._t=t}Tt.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=this._y=NaN,this._point=0},lineEnd:function(){0<this._t&&this._t<1&&this._point===2&&this._context.lineTo(this._x,this._y),(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line>=0&&(this._t=1-this._t,this._line=1-this._line)},point:function(a,t){switch(a=+a,t=+t,this._point){case 0:this._point=1,this._line?this._context.lineTo(a,t):this._context.moveTo(a,t);break;case 1:this._point=2;default:{if(this._t<=0)this._context.lineTo(this._x,t),this._context.lineTo(a,t);else{var e=this._x*(1-this._t)+a*this._t;this._context.lineTo(e,this._y),this._context.lineTo(e,t)}break}}this._x=a,this._y=t}};function At(a){return new Tt(a,1)}const M={textColor:"#333",headingColor:"#111",linkColor:"#367588",linkHoverColor:"#2a5a6a",subtleTextColor:"#666",codeBgColor:"#f0f0f0",primaryVizColor:"#367588",secondaryVizColor:"#5F9EA0"};function Wt(){const a=document.getElementById("general-quantization-intro-styles");a&&a.remove();const t=document.createElement("style");t.id="general-quantization-intro-styles",t.textContent=`
    #general-quantization-intro-section {
      margin-top: 1em;
      margin-bottom: 1.5em;
      padding-top: 1em;
    }

    #general-quantization-intro-section h2#general-quantization-intro-title {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.6em;
      font-weight: 600;
      color: ${M.headingColor};
      margin-top: 0;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }

    #general-quantization-intro-section p#general-quantization-intro-text {
      font-family: Georgia, serif;
      font-size: 1em;
      line-height: 1.7;
      color: ${M.textColor};
      margin-bottom: 1.5em;
    }

    #general-quantization-intro-svg-wrapper {
      border: 1px solid ${M.textColor}20;
      border-radius: 4px;
      overflow: hidden;
      max-width: 100%;
    }

    #general-quantization-intro-svg-wrapper svg {
      display: block;
      width: 100%;
    }

    .llm-question {
      background-color: #f7f7f7;
      padding: 1em;
      border-radius: 4px;
      border-left: 4px solid ${M.primaryVizColor};
      margin-top: 1.5em;
    }      
  `,document.head.appendChild(t)}function Nt(){Wt();const a=I("main");if(a.empty()){console.error("Main element not found for General Quantization Intro visualization.");return}const t="general-quantization-intro-container",e="general-quantization-intro-section",n="general-quantization-intro-title",i="general-quantization-intro-text",o="general-quantization-intro-svg-wrapper",s=document.getElementById(t);s&&s.remove();let r=I(`#${e}`);r.empty()||r.remove();const d=a.append("section").attr("id",e);d.append("h2").attr("id",n).text("Oh Snap!"),d.append("h3").attr("id",n).text("What is Lost When We Quantize?");const c=d.append("div").attr("id",o);d.append("p").attr("id",i).html("Quantization is the process of taking values in a higher-resolution datatype and mapping them to a lower-resolution one. For example, mapping 32-bit floating points to a set of 4 bit integers. <br/><br/>This general mechanism is used ubiquitously in signal processing and computers: it underlies many things - audio codecs, computer graphics and more recently has been used to <b>shrink the weights of neural networks</b> to reduce their size."),d.append("p").attr("class","llm-question").html('<b>Why Quantize Models?</b><br/> Quantization has become more popular in recent years, enabling inference for models with small footprints which maintain much of their capability. For example one open source quantized version of Gemma3 27B with Quantization Aware Training (QAT) outperforms gpt3.5 on certain benchmarks while still being <20GB on disk.<sup><a href="https://huggingface.co/bartowski/google_gemma-3-27b-it-qat-GGUF" target="_blank">[1]</a></sup><sup><a href="https://www.reddit.com/r/LocalLLaMA/comments/1k6nrl1/i_benchmarked_the_gemma_3_27b_qat_models/" target="_blank">[2]</a></sup><sup><a href="https://www.vals.ai/benchmarks/gpqa-03-11-2025" target="_blank">[3]</a></sup>.'),d.append("p").html("Since there is no free lunch, it is natural to ask what does it cost to quantize something? What does the error look like or sound like? Or in the case of an LLM, how is quantization applied and how does it impact model outputs? The intention of this article is to provide intution into what this error is at a high level and observe how it specifically manifests for an example quantized LLM. <br/>");const h=800,l=200,p={top:10,right:20,bottom:10,left:20},u=h-p.left-p.right,m=l-p.top-p.bottom,g=c.append("svg").attr("viewBox",`0 0 ${h} ${l}`).attr("preserveAspectRatio","xMidYMid meet").style("display","block").style("width","100%").style("height","100%"),y=g.append("g").attr("transform",`translate(${p.left}, ${p.top})`),k=K().domain([0,4*Math.PI]).range([0,u]),C=m*.6,x=K().domain([-1.2,1.2]).range([C,0]),b=200,w=[16,8,4,2,4,8];let f=0,q=0;const $=300;let z=0;function _(S){const N=[];for(let D=0;D<=b;D++){const F=D/b*4*Math.PI,L=Math.sin(F+S);N.push([F,L])}return N}function v(S,N){const D=[];for(let F=0;F<=b;F++){const L=F/b*4*Math.PI,X=Math.sin(L+S),nt=Math.round(X*(N/2))/(N/2),ut=Math.max(-1,Math.min(1,nt));D.push([L,ut])}return D}const B="#fff",Q="#000",V=Et(B,Q),H=g.append("defs"),st=H.append("linearGradient").attr("id","continuous-gradient").attr("gradientUnits","userSpaceOnUse").attr("x1",p.left).attr("x2",p.left+u).attr("y1",0).attr("y2",0);st.append("stop").attr("offset","0%").attr("stop-color",B),st.append("stop").attr("offset","100%").attr("stop-color",Q);const Z=H.append("linearGradient").attr("id","quantized-gradient").attr("gradientUnits","userSpaceOnUse").attr("x1",p.left).attr("x2",p.left+u).attr("y1",0).attr("y2",0);Z.append("stop").attr("offset","0%").attr("stop-color",B),Z.append("stop").attr("offset","100%").attr("stop-color",Q);const tt=pt().x(S=>k(S[0])).y(S=>x(S[1])).curve(ht),ot=pt().x(S=>k(S[0])).y(S=>x(S[1])).curve(At),lt=y.append("path").datum(_(z)).attr("class","sine-wave").attr("d",tt).attr("fill","none").attr("stroke","url(#continuous-gradient)").attr("stroke-width",4).attr("opacity",.7),ct=y.append("path").datum(v(z,w[f])).attr("class","quantized-sine-wave").attr("d",ot).attr("fill","none").attr("stroke","url(#quantized-gradient)").attr("stroke-width",3),it=30,P=C+5;y.append("rect").attr("class","error-background").attr("x",0).attr("y",P).attr("width",u).attr("height",it).attr("fill","#f8f8f8").attr("stroke","#ddd").attr("stroke-width",1).attr("rx",2);const j=K().domain([0,1]).range([it,0]),at=pt().x(S=>k(S[0])).y(S=>j(S[1])).curve(ht);function et(S,N){const D=[];for(let F=0;F<=b;F++){const L=F/b*4*Math.PI,X=Math.sin(L+S),nt=Math.round(X*(N/2))/(N/2),ut=Math.max(-1,Math.min(1,nt)),It=Math.abs(X-ut);D.push([L,It])}return D}const dt=y.append("path").datum(et(z,w[f])).attr("class","error-wave").attr("d",at).attr("fill","none").attr("stroke","#e74c3c").attr("stroke-width",2).attr("transform",`translate(0, ${P})`),A=Dt().x(S=>k(S[0])).y0(j(0)).y1(S=>j(S[1])).curve(ht),T=y.append("path").datum(et(z,w[f])).attr("class","error-fill").attr("d",A).attr("fill","#e74c3c").attr("fill-opacity",.3).attr("transform",`translate(0, ${P})`);y.append("text").attr("class","error-label").attr("x",10).attr("y",P+12).style("font-size","10px").style("font-weight","bold").style("fill","#e74c3c").text("Quantization Error");const G=10,O=P+it+5;function W(S){const N=H.select("#quantized-bar-gradient");N.empty()||N.remove();const D=H.append("linearGradient").attr("id","quantized-bar-gradient").attr("gradientUnits","userSpaceOnUse").attr("x1",p.left).attr("x2",p.left+u).attr("y1",0).attr("y2",0);for(let F=0;F<S;F++){const L=F/S,X=(F+1)/S,nt=V(L+(X-L)/2);D.append("stop").attr("offset",`${(L*100).toFixed(2)}%`).attr("stop-color",nt),D.append("stop").attr("offset",`${(X*100).toFixed(2)}%`).attr("stop-color",nt)}}W(w[f]),y.append("rect").attr("class","quantized-gradient-bar").attr("x",0).attr("y",O).attr("width",u).attr("height",G).attr("fill","url(#quantized-bar-gradient)").attr("stroke","#333").attr("stroke-width",1),y.append("rect").attr("class","level-display-bg").attr("x",u-120).attr("y",5).attr("width",110).attr("height",20).attr("fill","rgba(255, 255, 255, 0.9)").attr("stroke",B).attr("stroke-width",1).attr("rx",4);const R=y.append("text").attr("class","level-display").attr("x",u-65).attr("y",18).attr("text-anchor","middle").style("font-size","12px").style("font-weight","bold").style("fill",B).text(`${w[f]} levels`);function U(){z+=.02,q++,q>=$&&(q=0,f=(f+1)%w.length,R.text(`${w[f]} levels`),W(w[f])),lt.datum(_(z)).attr("d",tt),ct.datum(v(z,w[f])).attr("d",ot);const S=et(z,w[f]);dt.datum(S).attr("d",at),T.datum(S).attr("d",A),requestAnimationFrame(U)}U(),console.log("General Quantization Intro Visualization Initialized")}function Lt(){const a=document.getElementById("quantization-error-styles");a&&a.remove();const t=document.createElement("style");t.id="quantization-error-styles",t.textContent=`
    #quantization-error-section {
      margin-top: 0;
      margin-bottom: 1em;
      padding-top: 0;
    }

    #quantization-error-section h2 {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.4em;
      font-weight: 600;
      color: ${M.headingColor};
      margin-top: 0;
      margin-bottom: 0.2em;
      line-height: 1.2;
      text-align: left;
    }

    #quantization-error-section h3 {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.1em;
      font-weight: 500;
      color: ${M.headingColor};
      margin-top: 0.6em;
      margin-bottom: 0.3em;
    }

    #quantization-error-section > p {
      font-family: Georgia, serif;
      font-size: 0.95em;
      line-height: 1.4;
      color: ${M.textColor};
      margin-bottom: 0.5em;
      text-align: left;
    }

    .quantization-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1em;
      margin-top: 1.5em;
      margin-bottom: 1.5em;
      padding: 1em;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    @media (min-width: 768px) {
      .quantization-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    .quantization-column {
      display: flex;
      flex-direction: column;
    }

    .quant-controls {
      display: flex;
      justify-content: center;
      gap: 0.5em;
      margin-bottom: 0.5em;
    }

    .quant-controls label {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 0.8em;
      padding: 0.3em 0.6em;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
    }

    .quant-controls input[type="radio"] {
      display: none;
    }

    .quant-controls input[type="radio"]:checked + label {
      background-color: ${M.primaryVizColor};
      color: white;
      border-color: ${M.primaryVizColor};
    }

    .quant-display-area {
      text-align: center;
    }

    .waveform-container, .image-container {
      margin-bottom: 0.3em;
    }

    .waveform-container h4, .image-container h4 {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 0.85em;
      color: ${M.primaryVizColor};
      margin-bottom: 0.15em;
      font-weight: 600;
    }

    .bitrate-label {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 0.75em;
      color: ${M.subtleTextColor};
      margin-bottom: 0.2em;
    }

    .waveform-canvas, .image-canvas {
      max-width: 100%;
      width: 100%;
      height: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .audio-player-control {
      max-width: 100%;
      height: 30px;
      width: 100%;
    }

    .audio-start-button {
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f0f0f0;
      display: block;
      margin: 10px auto;
    }

  `,document.head.appendChild(t)}async function mt(a,t){const n=await(await fetch(a)).arrayBuffer();return t.decodeAudioData(n)}function bt(a,t){const e=a.getChannelData(0),n=t.getChannelData(0),i=Math.min(e.length,n.length),o=new Float32Array(i);for(let s=0;s<i;s++)o[s]=e[s]-n[s];return o}function wt(a,t,e,n){const i=a.getContext("2d");if(!i)return;const o=a.width,s=a.height,r=s/2;i.clearRect(0,0,o,s),i.lineWidth=1.5,i.strokeStyle=M.primaryVizColor,i.beginPath();const d=2e3,c=Math.floor(e*n),h=o/d;for(let l=0;l<d;l++){const p=c+l;if(p>=t.length)break;const u=l*h,m=r-t[p]*r;l===0?i.moveTo(u,m):i.lineTo(u,m)}i.stroke()}async function Gt(a,t){const e=a.append("div").attr("class","quantization-column");e.append("h3").text("Audio Quantization"),e.append("p").html('WAV files can store sound at different <a href="https://en.wikipedia.org/wiki/Audio_bit_depth#:~:text=The%20resolution%20indicates%20the%20number,%2Dtwo%20floating%2Dpoint%20formats." target="blank_">"bit depths" </a> which quantizes the input sound signal. This introduces noise. The quantization "error" is the difference of this signal from the original. Select a bit depth to see and hear the effect on this <b>AI-generated song about quantization.</b>');const n=[{bitDepth:"16-bit",quality:"Original"},{bitDepth:"8-bit",quality:"8-bit"},{bitDepth:"4-bit",quality:"4-bit"}],i=e.append("div").attr("class","quant-controls");n.forEach((l,p)=>{i.append("input").attr("type","radio").attr("name","audio-quant-level").attr("id",`audio-quant-${l.bitDepth}`).attr("value",l.bitDepth).property("checked",p===0),i.append("label").attr("for",`audio-quant-${l.bitDepth}`).text(l.quality)});const o=e.append("div").attr("class","quant-display-area"),s=o.append("div").attr("class","waveform-container");s.append("h4").text("Quantized Waveform");const r=s.append("canvas").attr("class","waveform-canvas").attr("width",250).attr("height",70).node(),d=o.append("div").attr("class","waveform-container");d.append("h4").text("Quantization Error");const c=d.append("canvas").attr("class","waveform-canvas").attr("width",250).attr("height",70).node(),h=e.append("audio").attr("class","audio-player-control").attr("controls",!0).node();try{const[l,p,u]=await Promise.all([mt("./assets/audio/sample_audio_16bit.wav",t),mt("./assets/audio/sample_audio_8bit.wav",t),mt("./assets/audio/sample_audio_4bit.wav",t)]),m=bt(l,p),g=bt(l,u),y=t.createBuffer(1,m.length,l.sampleRate);y.copyToChannel(m,0);const k=t.createBuffer(1,g.length,l.sampleRate);k.copyToChannel(g,0);const C={"16-bit":l,"8-bit":p,"4-bit":u},x={"8-bit-error":y,"4-bit-error":k},b={"16-bit":l.getChannelData(0),"8-bit":p.getChannelData(0),"4-bit":u.getChannelData(0)},w={"16-bit":new Float32Array(l.length).fill(0),"8-bit":m,"4-bit":g};let f;const q=()=>{const z=i.select("input:checked").node().value,_=h.currentTime,v=l.sampleRate;wt(r,b[z],_,v),wt(c,w[z],_,v),h.paused||(f=requestAnimationFrame(q))},$=()=>{const z=i.select("input:checked").node().value,_=!h.paused,v=h.currentTime,B=C[z],Q=URL.createObjectURL(new Blob([Rt(B)],{type:"audio/wav"}));h.src=Q,h.currentTime=v,_&&h.play(),q()};h.onplay=()=>{t.state==="suspended"&&t.resume(),q()},h.onpause=()=>cancelAnimationFrame(f),h.onseeked=()=>q(),i.selectAll("input").on("change",$),$()}catch(l){console.error("Error loading or processing audio data:",l),e.append("p").style("color","red").text("Failed to load audio resources. See console for details.")}return e}function Rt(a){const t=a.numberOfChannels,e=a.length*t*2+44,n=new ArrayBuffer(e),i=new DataView(n),o=[];let s,r,d=0,c=0;for(l(1179011410),l(e-8),l(1163280727),l(544501094),l(16),h(1),h(t),l(a.sampleRate),l(a.sampleRate*2*t),h(t*2),h(16),l(1635017060),l(e-c-4),s=0;s<a.numberOfChannels;s++)o.push(a.getChannelData(s));for(;c<e;){for(s=0;s<t;s++)r=Math.max(-1,Math.min(1,o[s][d])),r=(.5+r<0?r*32768:r*32767)|0,i.setInt16(c,r,!0),c+=2;d++}function h(p){i.setUint16(c,p,!0),c+=2}function l(p){i.setUint32(c,p,!0),c+=4}return n}function Pt(a){const t=a.append("div").attr("class","quantization-column");t.append("h3").text("Image Color Quantization"),t.append("p").html('You may have heard of <a href="https://en.wikipedia.org/wiki/8-bit_color" target="blank_">8-bit color</a> palletes from old Atari video games. If you want to display a high-resolution image in 8-bit color, you will need to quantize colors to one of 256 possible values. At even smaller levels, you can see the error as sharp artifacts in the original image. ');const e=[{bits:8,label:"8-bit"},{bits:4,label:"4-bit"},{bits:2,label:"2-bit"}],n=t.append("div").attr("class","quant-controls");e.forEach((c,h)=>{n.append("input").attr("type","radio").attr("name","image-quant-level").attr("id",`image-quant-${c.bits}`).attr("value",c.bits).property("checked",h===0),n.append("label").attr("for",`image-quant-${c.bits}`).text(c.label)});const s=t.append("div").attr("class","quant-display-area").append("canvas").attr("class","image-canvas").attr("width",250).attr("height",250).node();function r(c){if(!s)return;const h=s.getContext("2d");if(!h)return;const l=Ot(c),p=Math.floor(s.width/l[0].length);h.clearRect(0,0,s.width,s.height),l.forEach((u,m)=>{u.forEach((g,y)=>{h.fillStyle=`rgb(${g}, ${g}, ${g})`,h.fillRect(y*p,m*p,p,p)})})}n.selectAll("input").on("change",function(){const c=parseInt(this.value,10);r(c)});const d=parseInt(n.select("input:checked").node().value,10);return r(d),t}function Ot(a){const n=255/(Math.pow(2,a)-1),i=[];for(let o=0;o<50;o++){const s=[];for(let r=0;r<50;r++){const d=Math.floor((r+o)/100*255),c=Math.round(d/n)*n;s.push(Math.min(255,Math.max(0,c)))}i.push(s)}return i}function Ut(){Lt();const a=I("main");if(a.empty()){console.error("Main element not found for quantization error visualization.");return}const t="quantization-error-section";let e=I(`#${t}`);e.empty()||e.remove();const n=a.append("section").attr("id",t);n.append("h2").text("Quantization Error"),n.append("p").html("Since the source datatype is higher resolution than the target datatype, obviously some information will be lost in the process. This is called <em>quantization error</em>. Explore the effects on audio and images below.");const i=new(window.AudioContext||window.webkitAudioContext),o=n.append("div").attr("class","quantization-row");Gt(o,i),Pt(o),console.log("Quantization Error Introduction Visualization Initialized")}class xt{calculateBlockError(t,e){if(t.length!==e.length)throw new Error("Block lengths must match");let n=0;for(let i=0;i<t.length;i++)n+=Math.abs(t[i]-e[i]);return n/t.length}extractBlock(t,e){if(e<0||e>=t.length)throw new Error(`Block index ${e} out of range`);return t[e]}}function kt(a,t=8){const e=a.flat(),n=Math.max(...e.map(r=>Math.abs(r))),i=Math.pow(2,t-1)-1,o=n===0?1:n/i,s=[];for(let r=0;r<a.length;r++){const d=[];for(let c=0;c<a[r].length;c++){const h=Math.round(a[r][c]/o),l=Math.max(-i-1,Math.min(i,h));d.push(l)}s.push(d)}return{quantized:s,scale:o}}function rt(a,t=8){const e=a.flat(),n=Math.min(...e),i=Math.max(...e),o=0,s=Math.pow(2,t)-1,r=i-n===0?1:(i-n)/(s-o);let d=Math.round(o-n/r);d=Math.max(o,Math.min(s,d));const c=[],h=l=>Math.max(o,Math.min(s,l));for(let l=0;l<a.length;l++){const p=[];for(let u=0;u<a[l].length;u++){const m=Math.round((a[l][u]-n)/r),g=h(m);p.push(g)}c.push(p)}return{quantized:c,scale:r,zeroPoint:d}}function Ht(){const a=[],t=[[150,300],[800,1200],[-200,100],[1400,1600]];for(let e=0;e<4;e++){const n=[],i=t[e];for(let o=0;o<8;o++)if(Math.random()<.7){const s=i[Math.floor(Math.random()*i.length)],r=80,d=s+(Math.random()-.5)*2*r+(Math.random()-.5)*2*r,c=Math.max(-1024,Math.min(1852,d));n.push(parseFloat(c.toFixed(2)))}else{const s=Math.min(...i)-200,r=Math.max(...i)+200,d=s+Math.random()*(r-s),c=Math.max(-1024,Math.min(1852,d));n.push(parseFloat(c.toFixed(2)))}a.push(n)}return a}class jt extends xt{constructor(){super(...arguments),this.name="type0",this.displayName="Type 0 (Symmetric)",this.quantizedDataType="int8",this.requiresMinValues=!1,this.requiresSuperblock=!1}initializeQuantization(t){const e=[],n=[];for(let i=0;i<t.length;i++){const o=this.extractBlock(t,i),{scale:s}=kt([o],8);e.push(s),n.push(0)}return{blockScales:e,blockMins:n}}quantize(t,e){const n=[],i=[];for(let o=0;o<t.length;o++){const s=this.extractBlock(t,o),r=e.blockScales[o],{quantized:d}=kt([s],8),c=d[0],h=c.map(l=>l*r);n.push(c),i.push(h)}return{quantizedMatrix:n,dequantizedMatrix:i,scales:e.blockScales,mins:e.blockMins}}renderQuantizationTooltip(t){const e=Math.round(t.originalValue/t.scale);return`
      <div class="formula">Symmetric Quantization (Type 0):</div>
      <div>quant = clamp(round(original / scale), -128, 127)</div>
      <div class="values">
        Block ${t.blockIndex}: scale = ${t.scale.toFixed(4)}<br>
        original = ${t.originalValue.toFixed(2)}<br>
        round(${t.originalValue.toFixed(2)} / ${t.scale.toFixed(4)}) = ${e}<br>
        clamped = ${t.quantizedValue}
      </div>
    `}renderDequantizationTooltip(t){return`
      <div style="font-weight: bold; margin-bottom: 5px;">Symmetric Dequantization (Block ${t.blockIndex+1})</div>
      <div>dequantized = quantized × scale</div>
      <div style="margin-top: 5px;">
        <span style="color: #666;">${t.dequantizedValue.toFixed(4)}</span> = 
        <span style="color: #0066cc;">${t.quantizedValue}</span> × 
        <span style="color: #cc6600;">${t.scale.toFixed(4)}</span>
      </div>
    `}getFormulaDescription(){return"quantized × scale"}createParameterSliders(t,e,n,i){const o=t.append("div").style("display","grid").style("grid-template-columns","repeat(4, 1fr)").style("gap","6px");for(let s=0;s<e.blockScales.length;s++){const r=o.append("div").style("border",`1px solid ${n[s]}`).style("border-radius","3px").style("padding","4px").style("background-color","white").style("text-align","center");r.append("div").style("font-weight","bold").style("color",n[s]).style("margin-bottom","3px").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","9px").text(`Block ${s}`);const d=r.append("div");d.append("label").style("display","block").style("font-size","8px").style("margin-bottom","1px").style("font-family",'Consolas, Monaco, "Courier New", monospace').text("Scale:");const c=d.append("input").attr("type","range").attr("min","0.001").attr("max","30.0").attr("step","0.001").attr("value",e.blockScales[s].toString()).style("width","100%").style("cursor","pointer").style("height","3px").style("margin-bottom","2px").node(),h=d.append("div").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","8px").style("background-color","#f0f0f0").style("padding","1px 2px").style("border-radius","2px").text(e.blockScales[s].toFixed(3));c.addEventListener("input",()=>{const l=parseFloat(c.value),p={...e};p.blockScales[s]=l,h.text(l.toFixed(3)),i(p)})}}}class Xt extends xt{constructor(){super(...arguments),this.name="type1",this.displayName="Type 1 (Asymmetric)",this.quantizedDataType="uint8",this.requiresMinValues=!0,this.requiresSuperblock=!1}initializeQuantization(t){const e=[],n=[];for(let i=0;i<t.length;i++){const o=this.extractBlock(t,i),{scale:s}=rt([o],8),r=Math.min(...o);e.push(s),n.push(r)}return{blockScales:e,blockMins:n}}quantize(t,e){const n=[],i=[];for(let o=0;o<t.length;o++){const s=this.extractBlock(t,o),r=e.blockScales[o],d=e.blockMins[o],{quantized:c}=rt([s],8),h=c[0],l=h.map(p=>p*r+d);n.push(h),i.push(l)}return{quantizedMatrix:n,dequantizedMatrix:i,scales:e.blockScales,mins:e.blockMins}}renderQuantizationTooltip(t){const i=Math.round((t.originalValue-(t.minValue??0))/t.scale);return`
      <div class="formula">Asymmetric Quantization (Type 1, U8):</div>
      <div>quant = clamp(round((original - min) / scale), 0, 255)</div>
      <div class="values">
        Block ${t.blockIndex}: min = ${(t.minValue??0).toFixed(2)}, scale = ${t.scale.toFixed(4)}<br>
        original = ${t.originalValue.toFixed(2)}<br>
        round((${t.originalValue.toFixed(2)} - ${(t.minValue??0).toFixed(2)}) / ${t.scale.toFixed(4)}) = ${i}<br>
        clamped = ${t.quantizedValue}
      </div>
    `}renderDequantizationTooltip(t){return`
      <div style="font-weight: bold; margin-bottom: 5px;">Asymmetric Dequantization (Block ${t.blockIndex+1})</div>
      <div>dequantized = quantized × scale + min</div>
      <div style="margin-top: 5px;">
        <span style="color: #666;">${t.dequantizedValue.toFixed(4)}</span> = 
        <span style="color: #0066cc;">${t.quantizedValue}</span> × 
        <span style="color: #cc6600;">${t.scale.toFixed(4)}</span> + 
        <span style="color: #b36b00;">${t.minValue??0}</span>
      </div>
    `}getFormulaDescription(){return"quantized × scale + min"}createParameterSliders(t,e,n,i){const o=t.append("div").style("display","grid").style("grid-template-columns","repeat(4, 1fr)").style("gap","6px");for(let s=0;s<e.blockScales.length;s++){const r=o.append("div").style("border",`1px solid ${n[s]}`).style("border-radius","3px").style("padding","4px").style("background-color","white").style("text-align","center");r.append("div").style("font-weight","bold").style("color",n[s]).style("margin-bottom","3px").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","9px").text(`Block ${s}`);const d=r.append("div").style("margin-bottom","3px");d.append("label").style("display","block").style("font-size","8px").style("margin-bottom","1px").style("font-family",'Consolas, Monaco, "Courier New", monospace').text("Scale:");const c=d.append("input").attr("type","range").attr("min","0.001").attr("max","30.0").attr("step","0.001").attr("value",e.blockScales[s].toString()).style("width","100%").style("cursor","pointer").style("height","3px").style("margin-bottom","2px").node(),h=d.append("div").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","8px").style("background-color","#f0f0f0").style("padding","1px 2px").style("border-radius","2px").text(e.blockScales[s].toFixed(3)),l=r.append("div");l.append("label").style("display","block").style("font-size","8px").style("margin-bottom","1px").style("font-family",'Consolas, Monaco, "Courier New", monospace').text("Min:");const p=e.blockMins[s],u=Math.abs(p)||10,m=p-u*.5,g=p+u*.5,y=l.append("input").attr("type","range").attr("min",m.toString()).attr("max",g.toString()).attr("step","0.01").attr("value",e.blockMins[s].toString()).style("width","100%").style("cursor","pointer").style("height","3px").style("margin-bottom","2px").node(),k=l.append("div").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","8px").style("background-color","#f0f0f0").style("padding","1px 2px").style("border-radius","2px").text(e.blockMins[s].toFixed(2));c.addEventListener("input",()=>{const C=parseFloat(c.value),x={...e};x.blockScales[s]=C,h.text(C.toFixed(3)),i(x)}),y.addEventListener("input",()=>{const C=parseFloat(y.value),x={...e};x.blockMins[s]=C,k.text(C.toFixed(2)),i(x)})}}}class Yt extends xt{constructor(){super(...arguments),this.name="typeK",this.displayName="Type K",this.quantizedDataType="uint8",this.requiresMinValues=!0,this.requiresSuperblock=!0}initializeQuantization(t){const e=[],n=[];for(let i=0;i<t.length;i++){const o=this.extractBlock(t,i),{scale:s}=rt([o],8);e.push(s),n.push(Math.min(...o))}return{blockScales:e,blockMins:n,superblockScale:.1,superblockMin:-15}}quantize(t,e){const n=[],i=[];for(let g=0;g<t.length;g++){const y=this.extractBlock(t,g),{scale:k}=rt([y],8);n.push(k),i.push(Math.min(...y))}const o=Math.min(...i),s=Math.max(...n),r=Math.min(...n),d=(s-r)/255,h=n.map(g=>Math.round((g-r)/d)).map(g=>g*d+r),p=i.map(g=>Math.round((g-o)/(e.superblockScale??.1))).map(g=>g*(e.superblockScale??.1)+o),u=[],m=[];for(let g=0;g<t.length;g++){const y=this.extractBlock(t,g),{quantized:k}=rt([y],8),C=k[0],x=C.map(b=>b*h[g]+p[g]);u.push(C),m.push(x)}return{quantizedMatrix:u,dequantizedMatrix:m,scales:h,mins:p}}renderQuantizationTooltip(t){const i=Math.round((t.originalValue-(t.minValue??0))/t.scale);return`
      <div class="formula">Asymmetric Quantization (Type K):</div>
      <div>quant = clamp(round((original - min) / scale), 0, 255)</div>
      <div class="values">
        Block ${t.blockIndex}: min = ${(t.minValue??0).toFixed(2)}, scale = ${t.scale.toFixed(4)}<br>
        original = ${t.originalValue.toFixed(2)}<br>
        round((${t.originalValue.toFixed(2)} - ${(t.minValue??0).toFixed(2)}) / ${t.scale.toFixed(4)}) = ${i}<br>
        clamped = ${t.quantizedValue}
      </div>
    `}renderDequantizationTooltip(t){return`
      <div style="font-weight: bold; margin-bottom: 5px;">Asymmetric Dequantization (Block ${t.blockIndex+1})</div>
      <div>dequantized = quantized × scale + min</div>
      <div style="margin-top: 5px;">
        <span style="color: #666;">${t.dequantizedValue.toFixed(4)}</span> = 
        <span style="color: #0066cc;">${t.quantizedValue}</span> × 
        <span style="color: #cc6600;">${t.scale.toFixed(4)}</span> + 
        <span style="color: #b36b00;">${t.minValue??0}</span>
      </div>
    `}getFormulaDescription(){return"quantized × scale + min"}createParameterSliders(t,e,n,i){const o=(f,q)=>{const $=[],z=[];return e.blockScales.forEach(_=>{const v=Math.round(_/f);$.push(Math.max(0,Math.min(255,v)))}),e.blockMins.forEach(_=>{const v=Math.round((_-q)/f);z.push(Math.max(0,Math.min(255,v)))}),{quantizedScales:$,quantizedMins:z}},s=e.superblockScale??.1,r=e.superblockMin??-15;let{quantizedScales:d,quantizedMins:c}=o(s,r);const h=t.append("div").style("margin-bottom","10px").style("padding","6px").style("border","1px solid #dc3545").style("border-radius","3px").style("background-color","#fff8f8");h.append("div").style("font-weight","bold").style("color","#dc3545").style("margin-bottom","5px").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","10px").style("text-align","center").text("🌟 Superblock Parameters 🌟");const l=h.append("div").style("display","grid").style("grid-template-columns","1fr 1fr").style("gap","10px"),p=l.append("div");p.append("label").style("display","block").style("font-size","9px").style("margin-bottom","2px").style("font-family",'Consolas, Monaco, "Courier New", monospace').text("Superblock Scale:");const u=p.append("input").attr("type","range").attr("min","0.01").attr("max","10.0").attr("step","0.01").attr("value",s.toString()).style("width","100%").node(),m=p.append("div").style("font-size","9px").text(s.toFixed(2)),g=l.append("div");g.append("label").style("display","block").style("font-size","9px").style("margin-bottom","2px").style("font-family",'Consolas, Monaco, "Courier New", monospace').text("Superblock Min:");const y=g.append("input").attr("type","range").attr("min","-300").attr("max","300").attr("step","0.1").attr("value",r.toString()).style("width","100%").node(),k=g.append("div").style("font-size","9px").text(r.toFixed(2)),C=t.append("div").style("display","grid").style("grid-template-columns","repeat(4, 1fr)").style("gap","6px"),x=[],b=[];for(let f=0;f<e.blockScales.length;f++){const q=C.append("div").style("border",`1px solid ${n[f]}`).style("border-radius","3px").style("padding","4px").style("background-color","#f9f9f9").style("text-align","center");q.append("div").style("font-weight","bold").style("color",n[f]).style("margin-bottom","3px").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","9px").text(`Block ${f}`),q.append("div").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","8px").style("color","#666").text("(Auto-computed)"),q.append("div").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","8px").style("background-color","#f0f0f0").style("padding","1px 2px").style("border-radius","2px").style("margin","2px 0").text(`Scale: ${e.blockScales[f].toFixed(3)}`),q.append("div").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","8px").style("background-color","#f0f0f0").style("padding","1px 2px").style("border-radius","2px").style("margin","2px 0").text(`Min: ${e.blockMins[f].toFixed(2)}`);const $=q.append("div").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","7px").style("background-color","#e8f4fd").style("color","#0066cc").style("padding","1px 2px").style("border-radius","2px").style("margin","1px 0").text(`Quant. Scale: ${d[f]}`);x.push($);const z=q.append("div").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","7px").style("background-color","#fff3e0").style("color","#cc6600").style("padding","1px 2px").style("border-radius","2px").style("margin","1px 0").text(`Quant. Min: ${c[f]}`);b.push(z)}const w=(f,q)=>{const $=o(f,q);d=$.quantizedScales,c=$.quantizedMins;for(let z=0;z<d.length;z++)x[z].text(`Q_Scale: ${d[z]}`),b[z].text(`Q_Min: ${c[z]}`)};u.addEventListener("input",()=>{const f=parseFloat(u.value),q={...e,superblockScale:f};m.text(f.toFixed(2)),w(f,parseFloat(y.value)),i(q)}),y.addEventListener("input",()=>{const f=parseFloat(y.value),q={...e,superblockMin:f};k.text(f.toFixed(2)),w(parseFloat(u.value),f),i(q)})}}class J{constructor(){this.types=new Map,this.registerDefaultTypes()}static getInstance(){return J.instance||(J.instance=new J),J.instance}registerDefaultTypes(){this.register(new jt),this.register(new Xt),this.register(new Yt)}register(t){this.types.set(t.name,t)}get(t){return this.types.get(t)}getAll(){return Array.from(this.types.values())}getNames(){return Array.from(this.types.keys())}getDropdownOptions(){return this.getAll().map(t=>({value:t.name,text:t.displayName}))}}function Kt(){const a=document.getElementById("quant-type-styles");a&&a.remove();const t=document.createElement("style");t.id="quant-type-styles",t.textContent=`
    /* General styles */
    #quant-type-section {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f9;
      border-radius: 8px;
    }

    .quant-explanation {
      margin-bottom: 20px;
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #333;
    }

    .quant-explanation p, .quant-explanation ul {
      margin-bottom: 15px;
    }

    .quant-explanation code {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      background-color: #e8e8e8;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 0.9em;
    }

    .quant-type-cards {
      display: flex;
      gap: 20px;
      justify-content: space-between;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .quant-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      flex: 1;
      min-width: 280px;
      background-color: #ffffff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .quant-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .quant-card h4 {
      margin-top: 0;
      color: ${M.primaryVizColor};
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      border-bottom: 2px solid ${M.secondaryVizColor};
      padding-bottom: 10px;
      margin-bottom: 15px;
    }

    .quant-card ul {
      padding-left: 20px;
      margin-bottom: 0;
      list-style-type: '» ';
    }

    .quant-card li {
      margin-bottom: 10px;
    }

    .quant-callout-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 0 20px;
    }

    .quant-callout {
      background-color: #fffbe6; /* Yellow background */
      border-left: 5px solid #ffc107; /* Amber border */
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }

    .quant-callout p {
      margin: 0 0 10px 0;
    }

    .quant-callout blockquote {
      border-left: 3px solid #ccc;
      padding-left: 15px;
      margin-left: 0;
      font-style: italic;
      color: #555;
    }

    .quant-callout a {
      color: ${M.linkColor};
      text-decoration: none;
      font-weight: bold;
    }

    .quant-callout a:hover {
      text-decoration: underline;
    }

    /* SVG and Controls */
    #quant-type-svg-wrapper {
      position: relative; 
      border: 1px solid ${M.textColor}20;
      border-radius: 4px;
      overflow: hidden;
      max-width: 100%;
    }

    #quant-type-svg-wrapper svg {
      display: block;
      width: 100%;
    }

    .matrix-cell {
      stroke: #ccc;
      stroke-width: 1px;
      cursor: pointer; 
    }
    
    .scale-legend-text {
        cursor: pointer; 
    }

    .matrix-text {
      font-family: monospace;
      font-size: 8px; 
      text-anchor: middle;
      dominant-baseline: central;
      pointer-events: none;
      /* Ensure text stays within cell bounds */
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Responsive text sizing for smaller screens */
    @media (max-width: 768px) {
      .matrix-text {
        font-size: 7px;
      }
      
      .number-line-text {
        font-size: 9px;
      }
      
      .scale-legend-text {
        font-size: 9px;
      }
      
      .error-bar-text {
        font-size: 8px;
      }
    }

    .highlight-anim {
      animation: blinkAnimation 1500ms ease-in-out; 
    }

    /* Number line text styling */
    .number-line-text {
      font-family: monospace;
      font-size: 10px;
      text-anchor: middle;
      fill: #333;
      font-weight: 500;
    }

    /* Scale legend text styling */
    .scale-legend-text {
      cursor: pointer;
      font-family: monospace;
      font-size: 10px;
      fill: #333;
    }

    .scale-legend-text:hover {
      fill: #000;
      font-weight: bold;
    }

    /* Error bar text styling */
    .error-bar-text {
      font-family: monospace;
      font-size: 9px;
      text-anchor: middle;
      fill: #333;
    }

    .audio-start-button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f0f0f0;
      display: block;
      margin: 20px auto;
    }
    
    .quant-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 11px;
      line-height: 1.4;
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .quant-tooltip .formula {
      color: #87CEEB;
      font-weight: bold;
    }

    .quant-tooltip .values {
      color: #98FB98;
      margin-top: 4px;
    }

    @keyframes blinkAnimation {
      0%, 100% { 
        opacity: 1;
        
      }
      10%, 60% { 
        opacity: 1;
        fill: #00FF00 !important;  
        stroke: #333333 !important; 
        stroke-width: 1.5px;
      }
    }

    /* Very compact slider styling */
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      height: 3px;
      background: #ddd;
      border-radius: 2px;
      outline: none;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 10px;
      height: 10px;
      background: #007bff;
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
      background: #0056b3;
      transform: scale(1.2);
    }

    input[type="range"]::-moz-range-thumb {
      width: 10px;
      height: 10px;
      background: #007bff;
      border-radius: 50%;
      cursor: pointer;
      border: none;
      transition: background 0.2s ease;
    }

    input[type="range"]::-moz-range-thumb:hover {
      background: #0056b3;
      transform: scale(1.2);
    }
  `,document.head.appendChild(t)}class Jt{constructor(){this.currentSourceMatrix=Ht(),this.tooltip=null,this.activeInputElement=null,this.blockBaseColors=["#4E79A7","#59A14F","#F28E2B","#AF7AA1"],this.cellSize=35,this.margin=20;const t=J.getInstance();this.currentQuantType=t.get("type0"),this.currentConfig=this.currentQuantType.initializeQuantization(this.currentSourceMatrix)}initialize(){Kt(),this.setupDOM(),this.createControls(),this.createSVGWrapper(),this.setupSVG(),this.redrawVisualization(),this.createCallout(),console.log("Quantization Type Interactive Visualization Initialized with modular architecture.")}setupDOM(){const t=I("main");if(t.empty()){console.error("Main element not found for quantization type visualization.");return}const e="quant-type-section",n="quant-type-svg-wrapper";let i=I(`#${e}`);if(!i.empty()){const r=i.select(`#${n}`).node();if(r){const d=r.querySelector(".quant-tooltip");d&&d.remove()}i.remove()}const o=t.append("section").attr("id",e);o.append("h2").text("LLM Quantization"),o.append("p").html("Before we get into characterizing quantization error in LLMs, let’s first review how quantization is typically performed on the weights of these models. Quantization for LLM weights still follows the same principle of mapping values in a high-resolution representation (typically floating point) to a lower-resolution equivalent (typically some integer type) with some error."),o.append("div").html(`
    <div class="quant-explanation">
      <p>For the sake of this article we will follow some of the most common techniques used by covering the implementation used within 
      <a href="https://github.com/ggml-org/llama.cpp">llama.cpp</a>, a common open-source library for local inference. </p>
      <p>The quantization method used by a given model is typically represented as a combination of the weight type and method:</p>
      <ul>
          <li><b>Weight type:</b> the number of bits used to store the new weight: i.e. <code>Q8</code>=8-bit, <code>Q4</code>=4-bit etc.</li>
          <li><b>Method:</b> the technique used to create those quants from the original values</li>
      </ul>
      <p>
        The two simplest forms of weight quantization are symmetric and asymmetric quantization (type 0 and type 1 in <code>llama.cpp</code> terminology). 
        However there are more complicated forms such as K-quants, which we cover below, and others including IQ quants which we don't cover.
      </p>
      
      <div class="quant-type-cards">
        <div class="quant-card">
          <h4>Type 0 (e.g. <code>Q4_0</code>)</h4>
          <ul>
            <li>Weights are divided into “blocks”</li>
            <li>Takes the block “scale” to highlight the range of the block</li>
            <li>Inference time weight = <code>scale * quant</code></li>
          </ul>
        </div>
        <div class="quant-card">
          <h4>Type 1 (e.g. <code>Q4_1</code>)</h4>
          <ul>
            <li>Weights are divided into “blocks”</li>
            <li>Takes the block “scale” and minimum value in the block such that</li>
            <li>Inference time weight = <code>scale * quant + block_min</code></li>
          </ul>
        </div>
        <div class="quant-card">
          <h4>Type K (e.g. <code>Q4_K_{0|1}</code>)</h4>
          <ul>
            <li>Divide into super blocks, with these further divided into blocks</li>
            <li>Individual blocks get their own type 0 or type 1 parameters i.e (offset, block min)</li>
            <li>Superblocks store their own type-0 or type-1 parameters to quantize the <b>individual block params</b> as lower datatypes. 
            </li>
          </ul>
        </div>
      </div>
    </div>
    `),this.slidersContainer=o.append("div").attr("id","quant-type-sliders-container")}createCallout(){const t=I("main");if(t.empty()){console.error("Main element not found for callout.");return}t.select(".quant-callout-container").remove(),t.append("div").attr("class","quant-callout-container").html(`
    <div class="quant-callout">
      <p>As an interesting aside, K-quants are relatively broadly used and yet it's surprisingly hard to find info on how they work. I came across 
      <a href="https://github.com/ggml-org/llama.cpp/pull/1684#issuecomment-2474462323">
        this comment 
      </a> from the author in <code>llama.cpp</code> which just goes to show the organic ways these things are developing:</p>
      <blockquote>
        <p><strong>ikawrakow commented on Nov 13, 2024</strong></p>
        <p>There are no papers on k- or i-quants because I don't like writing papers. Combined with me enjoying the luxury of not needing another paper on my CV, and me not looking for a job or for investment, I see no reason to go and advertise on arXiv.</p>
        <p>On the other hand, not having published a paper (or papers) allows other quantization researchers to ignore k- and i-quants, despite HF being littered with GGUFs containing k- and i-quantized models. Which makes their new shiny quantization methods look better than they actually are. Which is good for keeping the hype wave going.</p>
        <p>So, in short, a win-win 😃</p>
      </blockquote>
    </div>
    `)}createControls(){I("#quant-type-section").append("p").html(`<p style="font-family: 'Georgia', serif;"> The following is an interactive visualization of these three different quantization strategies for some example weights.  You can see how these are quants are represented in code in <code>llama.cpp</code><a href="https://github.com/ggml-org/llama.cpp/blob/master/ggml/src/ggml-common.h#L167">here if you are curious.</a> `);const t=I("#quant-type-section").append("div").style("margin-bottom","15px").style("display","flex").style("align-items","center").style("gap","10px");t.append("label").attr("for","quantization-type-select").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","14px").style("font-weight","600").text("Quantization Type:");const e=t.append("select").attr("id","quantization-type-select").style("padding","5px 10px").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","14px").style("border","1px solid #ccc").style("border-radius","4px").style("background-color","white"),n=J.getInstance();n.getDropdownOptions().forEach(i=>{e.append("option").attr("value",i.value).text(i.text)}),e.on("change",()=>{const i=e.node().value,o=n.get(i);o&&(this.currentQuantType=o,this.currentConfig=this.currentQuantType.initializeQuantization(this.currentSourceMatrix),this.createParameterSliders(),this.redrawVisualization())}),I("#quant-type-section").append("p").html('<strong style="color: #007bff;">Click on source weight cells or use the sliders below to edit values.</strong>'),this.createControlsContainer(),this.createParameterSliders()}createControlsContainer(){const t=I("#quant-type-section").append("div").style("display","flex").style("gap","20px").style("align-items","flex-start").style("margin-bottom","30px").style("justify-content","center");this.slidersContainer=t.append("div").style("flex","1").style("max-width","400px").style("padding","6px").style("background-color","#f8f9fa").style("border","1px solid #007bff").style("border-radius","4px").style("font-size","11px"),this.slidersContainer.append("div").style("margin","0 0 6px 0").style("color","#007bff").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-weight","bold").style("font-size","10px").style("text-align","center").text("🎛️ Editable Parameters");const e=t.append("div").style("flex","0 0 200px").style("padding","6px").style("background-color","#f8f9fa").style("border","1px solid #6c757d").style("border-radius","4px");e.append("div").style("margin","0 0 6px 0").style("color","#6c757d").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-weight","bold").style("font-size","10px").style("text-align","center").text("📊 Quantization Error"),this.errorBarsSvg=e.append("svg").attr("width","188").attr("height","120").style("display","block").style("background-color","white").style("border-radius","3px")}createParameterSliders(){this.slidersContainer.selectAll("*").remove(),this.slidersContainer.append("div").style("margin","0 0 6px 0").style("color","#007bff").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-weight","bold").style("font-size","10px").style("text-align","center").text("🎛️ Editable Parameters"),this.currentQuantType.createParameterSliders(this.slidersContainer,this.currentConfig,this.blockBaseColors,t=>{this.currentConfig=t,this.redrawVisualization()})}createSVGWrapper(){const t="quant-type-svg-wrapper";this.svgWrapper=I("#quant-type-section").append("div").attr("id",t).style("position","relative")}setupSVG(){const t=8*this.cellSize,e=4*this.cellSize,n=30,i=60,o=120,c=this.margin+t+i+t+i+t+this.margin,h=this.margin+n+e+o+this.margin;this.svgMainContainer=this.svgWrapper.append("svg").attr("viewBox",`0 0 ${c} ${h}`).attr("preserveAspectRatio","xMidYMid meet").style("display","block").style("width","100%").style("height","100%")}redrawVisualization(){this.removeActiveInputElement(),this.hideTooltip(),this.svgMainContainer.selectAll("*").remove();const t=this.currentQuantType.quantize(this.currentSourceMatrix,this.currentConfig);this.drawMatrices(t),this.drawNumberLines(t),this.drawErrorBars(t)}drawMatrices(t){const e=8*this.cellSize,n=30,i=60,o=this.margin,s=o+e+i,r=s+e+i,d=this.margin+n;this.drawMatrixTitles(o,s,r,e,d),this.drawSourceMatrix(o,d,t),this.drawQuantizedMatrix(s,d,t),this.drawDequantizedMatrix(r,d,t)}drawMatrixTitles(t,e,n,i,o){this.svgMainContainer.append("text").attr("x",t+i/2).attr("y",o-20).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","11px").attr("font-weight","bold").text("Source Weights (f32)"),this.svgMainContainer.append("text").attr("x",t+i/2).attr("y",o-8).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","9px").attr("fill","#007bff").attr("font-weight","bold").text("✏️ Click cells to edit"),this.svgMainContainer.append("text").attr("x",e+i/2).attr("y",o-20).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","11px").attr("font-weight","bold").text(`Quantized Weights (${this.currentQuantType.quantizedDataType})`),this.svgMainContainer.append("text").attr("x",e+i/2).attr("y",o-8).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","8px").text(`(${this.currentQuantType.getFormulaDescription()})`),this.svgMainContainer.append("text").attr("x",n+i/2).attr("y",o-20).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","11px").attr("font-weight","bold").text("Dequantized Weights (f32)"),this.svgMainContainer.append("text").attr("x",n+i/2).attr("y",o-8).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","9px").text("(approximates source)")}drawSourceMatrix(t,e,n){const i=this.createColorScales();for(let o=0;o<4;o++)for(let s=0;s<8;s++){const r=this.currentSourceMatrix[o][s],d=t+s*this.cellSize,c=e+o*this.cellSize;this.svgMainContainer.append("rect").attr("class","matrix-cell source-cell").attr("x",d).attr("y",c).attr("width",this.cellSize).attr("height",this.cellSize).attr("fill",i[o](r)).attr("stroke","#333").attr("stroke-width",1).style("cursor","pointer").on("mouseover",function(){I(this).attr("stroke","#007bff").attr("stroke-width",3).attr("stroke-dasharray","5,5")}).on("mouseout",function(){I(this).attr("stroke","#333").attr("stroke-width",1).attr("stroke-dasharray","none")}).on("click",()=>{this.handleSourceCellClick(o,s,d,c)}),this.svgMainContainer.append("text").attr("class","matrix-text").attr("x",d+this.cellSize/2).attr("y",c+this.cellSize/2).attr("text-anchor","middle").attr("dominant-baseline","middle").attr("font-family","monospace").attr("font-size","9px").text(Math.abs(r)<.1?r.toFixed(2):r.toFixed(1)).attr("fill","black").style("pointer-events","none")}}drawQuantizedMatrix(t,e,n){const i=this.createColorScales();for(let o=0;o<4;o++)for(let s=0;s<8;s++){const r=n.quantizedMatrix[o][s],d=this.currentSourceMatrix[o][s],c=n.scales[o],h=n.mins[o],l=t+s*this.cellSize,p=e+o*this.cellSize,u=r*c;this.svgMainContainer.append("rect").attr("class","matrix-cell").attr("x",l).attr("y",p).attr("width",this.cellSize).attr("height",this.cellSize).attr("fill",i[o](u)).attr("stroke","#333").attr("stroke-width",1).on("mouseover",m=>{this.showQuantizationTooltip(m,{originalValue:d,quantizedValue:r,dequantizedValue:n.dequantizedMatrix[o][s],scale:c,blockIndex:o,minValue:h})}).on("mousemove",m=>{this.showQuantizationTooltip(m,{originalValue:d,quantizedValue:r,dequantizedValue:n.dequantizedMatrix[o][s],scale:c,blockIndex:o,minValue:h})}).on("mouseout",()=>{this.hideTooltip()}),this.svgMainContainer.append("text").attr("class","matrix-text").attr("x",l+this.cellSize/2).attr("y",p+this.cellSize/2).attr("text-anchor","middle").attr("dominant-baseline","middle").attr("font-family","monospace").attr("font-size","9px").text(r.toString()).attr("fill","black").style("pointer-events","none")}}drawDequantizedMatrix(t,e,n){const i=this.createColorScales();for(let o=0;o<4;o++)for(let s=0;s<8;s++){const r=n.dequantizedMatrix[o][s],d=n.quantizedMatrix[o][s],c=n.scales[o],h=n.mins[o],l=t+s*this.cellSize,p=e+o*this.cellSize;this.svgMainContainer.append("rect").attr("class","matrix-cell").attr("x",l).attr("y",p).attr("width",this.cellSize).attr("height",this.cellSize).attr("fill",i[o](r)).attr("stroke","#333").attr("stroke-width",1).on("mouseover",u=>{this.showDequantizationTooltip(u,{originalValue:this.currentSourceMatrix[o][s],quantizedValue:d,dequantizedValue:r,scale:c,blockIndex:o,minValue:h})}).on("mousemove",u=>{this.showDequantizationTooltip(u,{originalValue:this.currentSourceMatrix[o][s],quantizedValue:d,dequantizedValue:r,scale:c,blockIndex:o,minValue:h})}).on("mouseout",()=>{this.hideTooltip()}),this.svgMainContainer.append("text").attr("class","matrix-text").attr("x",l+this.cellSize/2).attr("y",p+this.cellSize/2).attr("text-anchor","middle").attr("dominant-baseline","middle").attr("font-family","monospace").attr("font-size","9px").text(Math.abs(r)<.1?r.toFixed(2):r.toFixed(1)).attr("fill","black").style("pointer-events","none")}}drawNumberLines(t){const e=8*this.cellSize,n=4*this.cellSize,i=30,o=60,s=this.margin,r=s+e+o,d=r+e+o,h=this.margin+i+n+20;for(let l=0;l<4;l++){const p=h+l*20,u=this.currentSourceMatrix[l],m=t.quantizedMatrix[l],g=t.dequantizedMatrix[l];t.scales[l],t.mins[l];const y=[...u,...g],k=Math.min(...y),C=Math.max(...y),b=(C-k)*.1,w=K().domain([k-b,C+b]).range([0,e]);this.drawBlockNumberLine(s,p,e,w,u,this.blockBaseColors[l],`Block ${l} Original`,"circle");const f=K().domain([0,255]).range([0,e]);this.drawBlockNumberLine(r,p,e,f,m,this.blockBaseColors[l],`Block ${l} Quantized (0-255)`,"square"),this.drawBlockNumberLine(d,p,e,w,g,this.blockBaseColors[l],`Block ${l} Dequantized`,"triangle")}}drawBlockNumberLine(t,e,n,i,o,s,r,d){const c=this.svgMainContainer.append("g");c.append("text").attr("x",t+n/2).attr("y",e-5).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","8px").attr("font-weight","bold").attr("fill",s).text(r),c.append("line").attr("x1",t).attr("x2",t+n).attr("y1",e).attr("y2",e).attr("stroke","#ccc").attr("stroke-width",1);const h=i.domain(),l=h[0],p=h[1],u=t+i(l);if(c.append("line").attr("x1",u).attr("x2",u).attr("y1",e-2).attr("y2",e+2).attr("stroke","#999").attr("stroke-width",.5),c.append("text").attr("x",u).attr("y",e+12).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","7px").attr("fill","#666").text(l.toFixed(1)),p!==l){const m=t+i(p);c.append("line").attr("x1",m).attr("x2",m).attr("y1",e-2).attr("y2",e+2).attr("stroke","#999").attr("stroke-width",.5),c.append("text").attr("x",m).attr("y",e+12).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","7px").attr("fill","#666").text(p.toFixed(1))}o.forEach((m,g)=>{const y=t+i(m),k=e;d==="circle"?c.append("circle").attr("cx",y).attr("cy",k).attr("r",3).attr("fill",s).attr("stroke","white").attr("stroke-width",1).attr("opacity",.8):d==="square"?c.append("rect").attr("x",y-2.5).attr("y",k-2.5).attr("width",5).attr("height",5).attr("fill",s).attr("stroke","white").attr("stroke-width",1).attr("opacity",.8):d==="triangle"&&c.append("polygon").attr("points",`${y},${k-3} ${y-3},${k+3} ${y+3},${k+3}`).attr("fill",s).attr("stroke","white").attr("stroke-width",1).attr("opacity",.8)})}drawErrorBars(t){this.errorBarsSvg.selectAll("*").remove();const e=[];for(let h=0;h<4;h++){const l=this.currentSourceMatrix[h],p=t.dequantizedMatrix[h],u=this.currentQuantType.calculateBlockError(l,p);e.push(u)}const n=15,i=188-2*n,o=120-2*n,s=i/4-6,r=6,d=Math.max(...e,.001),c=K().domain([0,d]).range([o,0]);e.forEach((h,l)=>{const p=o-c(h),u=n+l*(s+r);this.errorBarsSvg.append("rect").attr("x",u).attr("y",n+c(h)).attr("width",s).attr("height",p).attr("fill",this.blockBaseColors[l]).attr("stroke","#333").attr("stroke-width",.5),this.errorBarsSvg.append("text").attr("x",u+s/2).attr("y",n+c(h)-2).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","9px").attr("fill","#333").text(h.toFixed(2)),this.errorBarsSvg.append("text").attr("x",u+s/2).attr("y",n+o+12).attr("text-anchor","middle").attr("font-family","monospace").attr("font-size","8px").attr("fill",this.blockBaseColors[l]).text(`B${l}`)}),this.errorBarsSvg.append("line").attr("x1",n-2).attr("x2",n-2).attr("y1",n).attr("y2",n+o).attr("stroke","#333").attr("stroke-width",1)}createColorScales(){const t=[];for(let e=0;e<4;e++){const n=this.currentSourceMatrix[e],i=Math.min(...n),o=Math.max(...n),s=n.reduce((l,p)=>l+p,0)/n.length,r=Vt(this.blockBaseColors[e]);if(!r){t.push(()=>this.blockBaseColors[e]);continue}const d=r.brighter(1.5).toString(),c=r.toString(),h=r.darker(1.5).toString();i===o?t.push(()=>c):t.push(K().domain([i,s,o]).range([d,c,h]).clamp(!0))}return t}showQuantizationTooltip(t,e){this.tooltip||(this.tooltip=this.createTooltip());const n=this.currentQuantType.renderQuantizationTooltip(e);this.showTooltip(t,n)}showDequantizationTooltip(t,e){this.tooltip||(this.tooltip=this.createTooltip());const n=this.currentQuantType.renderDequantizationTooltip(e);this.showTooltip(t,n)}showTooltip(t,e){if(!this.tooltip)return;const n=this.svgWrapper.node();if(!n)return;const i=n.getBoundingClientRect(),o=t.clientX-i.left,s=t.clientY-i.top;this.tooltip.innerHTML=e,this.tooltip.style.display="block",setTimeout(()=>{if(!this.tooltip)return;const r=this.tooltip.getBoundingClientRect();let d=o+10,c=s-10;d+r.width>n.clientWidth&&(d=o-r.width-10),d<0&&(d=10),c+r.height>n.clientHeight&&(c=s-r.height-10),c<0&&(c=s+20),this.tooltip.style.left=`${d}px`,this.tooltip.style.top=`${c}px`},0)}hideTooltip(){this.tooltip&&(this.tooltip.style.display="none")}createTooltip(){const t=document.querySelector(".quant-tooltip");if(t)return t;const e=document.createElement("div");return e.className="quant-tooltip",e.style.display="none",e.style.position="absolute",e.style.zIndex="1001",e.style.pointerEvents="none",this.svgWrapper.node().appendChild(e),e}handleSourceCellClick(t,e,n,i){const o=this.svgMainContainer.append("rect").attr("x",n).attr("y",i).attr("width",this.cellSize).attr("height",this.cellSize).style("opacity",0),s=this.currentSourceMatrix[t][e];this.showEditableInput(o.node(),s,r=>{const d=parseFloat(r);return isNaN(d)?(alert("Invalid input. Please enter a number."),!1):(this.currentSourceMatrix[t][e]=d,this.currentConfig=this.currentQuantType.initializeQuantization(this.currentSourceMatrix),this.createParameterSliders(),this.redrawVisualization(),!0)}),o.remove()}showEditableInput(t,e,n,i){this.removeActiveInputElement();const o=t.getBoundingClientRect(),s=this.svgWrapper.node().getBoundingClientRect(),r=document.createElement("input");r.type="text",r.value=e.toString(),r.style.position="absolute",r.style.left=`${o.left-s.left}px`,r.style.top=`${o.top-s.top}px`,r.style.width=`${o.width}px`,r.style.height=`${o.height}px`,r.style.fontSize="8px",r.style.fontFamily="monospace",r.style.textAlign="center",r.style.border="1px solid #007bff",r.style.boxSizing="border-box",r.style.zIndex="1000";const d=c=>{const h=n(c);this.removeActiveInputElement(),!h&&i&&i()};r.onblur=()=>{d(r.value)},r.onkeydown=c=>{c.key==="Enter"?d(r.value):c.key==="Escape"&&(this.removeActiveInputElement(),i&&i())},this.svgWrapper.node().appendChild(r),r.focus(),r.select(),this.activeInputElement=r}removeActiveInputElement(){const t=this.activeInputElement;if(this.activeInputElement=null,t&&t.parentNode)try{t.parentNode.removeChild(t)}catch(e){if(e.name==="NotFoundError")console.warn("Attempted to remove an input element that was not found under its parent.");else throw e}}}function Zt(){new Jt().initialize()}async function te(){try{const a=await fetch("./assets/wikitext/results.json");if(!a.ok)throw new Error(`Failed to fetch data: ${a.status}`);return await a.json()}catch(a){throw console.error("Error loading wiki text data:",a),a}}function ee(){const a=document.getElementById("wiki-logprob-viz-styles");a&&a.remove();const t=document.createElement("style");t.id="wiki-logprob-viz-styles",t.textContent=`
    #wiki-logprob-visualization-section {
      margin-top: 2em;
      margin-bottom: 3em;
      padding-top: 1em;
    }
    #wiki-logprob-visualization-section h2#wiki-logprob-title {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.6em;
      font-weight: 600;
      color: ${M.headingColor};
      margin-top: 0;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }
    #wiki-logprob-visualization-section p#wiki-logprob-intro {
      font-family: Georgia, serif;
      font-size: 1em;
      line-height: 1.7;
      color: ${M.textColor};
      margin-bottom: 1.5em;
    }
    .wiki-logprob-intro-text {
      font-family: Georgia, serif;
      font-size: 1em;
      line-height: 1.7;
      color: ${M.textColor};
      margin-bottom: 2em;
    }
    .wiki-logprob-intro-text h2 {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.4em;
      font-weight: 600;
      color: ${M.headingColor};
      margin-bottom: 0.8em;
      line-height: 1.3;
    }
    .wiki-logprob-intro-text p {
      margin-bottom: 1em;
    }
    .wiki-logprob-intro-text ol {
      margin-top: -0.5em;
      margin-bottom: 1em;
      margin-left: 2em;
    }
    .wiki-logprob-intro-text code {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      background-color: #f0f0f0;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    .wiki-logprob-intro-text a {
      color: ${M.primaryVizColor};
      text-decoration: none;
      border-bottom: 1px dotted ${M.primaryVizColor};
    }
    .wiki-logprob-intro-text a:hover {
      text-decoration: underline;
    }
    .data-collection-callout {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-left: 4px solid ${M.primaryVizColor};
      padding: 1em 1em;
      margin: 1.5em 0;
      border-radius: 4px;
    }
    .data-collection-callout h3 {
      margin-top: 0;
      margin-bottom: 0.5em;
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.1em;
      color: ${M.headingColor};
    }
    .data-collection-callout p {
        margin-bottom: 0.5em;
    }
    .data-collection-callout ol {
        margin-left: 1.5em;
        margin-bottom: 1em;
    }
    .wiki-token-row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.2em;
      margin-bottom: 1.5em;
      background: #f8f8f8;
      border-radius: 6px;
      padding: 0.7em 0.5em;
      box-shadow: 0 1px 3px #0001;
    }
    .wiki-token {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 0.1em;
      font-family: monospace;
      position: relative;
    }
    .wiki-token-text {
      font-size: 0.8em;
      padding: 0.1em 0.2em;
      border-bottom: 2px solid ${M.primaryVizColor};
      border-radius: 2px;
      background: #fff;
      margin-bottom: 0.1em;
    }
    .wiki-token-index {
      font-size: 0.6em;
      color: #888;
      margin-bottom: 0.1em;
    }
    .wiki-window-legend {
      display: flex;
      gap: 1em;
      margin-bottom: 0.5em;
      font-size: 0.85em;
      justify-content: center;
    }
    .wiki-legend-item {
      display: flex;
      align-items: center;
      gap: 0.3em;
    }
    .wiki-legend-box {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      border: 2px solid;
    }
    .wiki-legend-box.window {
      background: #b3d9ff;
      border-color: #2196f3;
    }
    .wiki-legend-box.next-char {
      background: #ffcc80;
      border-color: #ff9800;
    }
    .wiki-excerpt-switcher {
      display: flex;
      gap: 0.5em;
      margin-bottom: 1em;
      justify-content: flex-end;
      align-items: center;
    }
    .wiki-excerpt-switcher label {
      font-size: 0.95em;
      color: ${M.textColor};
      margin-right: 0.5em;
    }
    .wiki-excerpt-dropdown {
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 0.3em 0.7em;
      font-size: 0.95em;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .wiki-excerpt-dropdown:focus {
      outline: none;
      border-color: ${M.primaryVizColor};
    }
    .wiki-window-controls {
      display: flex;
      align-items: center;
      gap: 0.7em;
    }
    .wiki-controls-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.7em;
      margin-top: 0.5em;
    }
    .wiki-window-arrow {
      background: #eee;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 0.2em 0.7em;
      font-size: 1.2em;
      cursor: pointer;
      transition: background 0.15s;
      user-select: none;
    }
    .wiki-window-arrow:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .wiki-window-info {
      font-size: 0.95em;
      color: #555;
    }
    .wiki-token.in-window .wiki-token-text {
      background: #2196f3;
      color: white;
      border: 2px solid #2196f3;
      box-shadow: 0 0 8px rgba(33, 150, 243, 0.3);
      font-weight: 600;
    }
    .wiki-token.next-char .wiki-token-text {
      background: #ffcc80 !important;
      border: 3px solid #ff9800;
      box-shadow: 0 0 12px rgba(255, 152, 0, 0.5);
      font-weight: 700;
      transform: scale(1.1);
      position: relative;
    }
    .wiki-token.next-char .wiki-token-text::after {
      content: "⏭️";
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2em;
      animation: bounce 1.5s infinite;
    }
    .wiki-token.clickable .wiki-token-text {
      cursor: pointer;
      border-bottom: 2px dotted ${M.headingColor};
    }
    .wiki-token.clickable:hover .wiki-token-text {
      background-color: #f0f0f0;
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-3px); }
      60% { transform: translateX(-50%) translateY(-1px); }
    }
    .wiki-logprob-details {
      margin-bottom: 0.7em;
      font-size: 0.9em;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 6px;
      padding: 0.6em 0.8em;
      border: 1px solid #dee2e6;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      color: #333;
      max-width: 500px;
    }
    .wiki-logprob-details .section-title {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 1em;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.3em;
      display: flex;
      align-items: center;
    }
    .wiki-logprob-details .section-title::before {
      content: "📊";
      margin-right: 0.4em;
      font-size: 0.9em;
    }
    .wiki-logprob-details .section-description {
      font-size: 0.85em;
      line-height: 1.4;
      color: #5a6c7d;
      margin-bottom: 0.5em;
      font-style: italic;
    }
    .wiki-logprob-details .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.4em;
    }
    .wiki-logprob-details .metric-item {
      background: rgba(255, 255, 255, 0.7);
      border-radius: 4px;
      padding: 0.3em 0.5em;
      border-left: 3px solid #ccc;
      transition: transform 0.15s ease;
    }
    .wiki-logprob-details .metric-item:hover {
      transform: translateY(-1px);
    }
    .wiki-logprob-details .metric-item.difference {
      border-left-color: #dc3545;
    }
    .wiki-logprob-details .metric-label {
      font-size: 0.75em;
      color: #6c757d;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 0.1em;
    }
    .wiki-logprob-details .metric-value {
      font-size: 1em;
      font-weight: 700;
      color: #2c3e50;
      font-family: 'Courier New', monospace;
    }
    
    /* Top Differences Section Styles */
    .wiki-top-differences {
      margin-bottom: 2em;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 8px;
      padding: 1.2em;
      border: 1px solid #dee2e6;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    .wiki-top-differences h3 {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 1.3em;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.8em;
      display: flex;
      align-items: center;
      margin-top: 0;
    }
    
    .wiki-top-differences h3::before {
      content: "🔍";
      margin-right: 0.5em;
    }
    
    .wiki-difference-item {
      background: #fff;
      border-radius: 6px;
      padding: 0.8em;
      margin-bottom: 0.8em;
      border: 1px solid #e0e0e0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    
    .wiki-difference-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }
    
    .wiki-difference-item:last-child {
      margin-bottom: 0;
    }
    
    .wiki-difference-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.6em;
      font-size: 0.9em;
    }
    
    .wiki-difference-rank {
      font-weight: 600;
      color: #6c757d;
      font-size: 0.85em;
    }
    
    .wiki-difference-metrics {
      display: flex;
      gap: 1em;
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
    }
    
    .wiki-difference-metric {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .wiki-difference-metric-label {
      font-size: 0.7em;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 0.1em;
    }
    
    .wiki-difference-metric-value {
      font-weight: 700;
      color: #2c3e50;
    }
    
    .wiki-difference-metric-value.difference {
      color: #dc3545;
      font-size: 1.1em;
    }
    
    .wiki-difference-tokens {
      margin-top: 0.5em;
    }
    
    .wiki-difference-token-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.15em;
      align-items: center;
    }
    
    .wiki-difference-token {
      font-family: monospace;
      font-size: 0.75em;
      padding: 0.2em 0.3em;
      border-radius: 3px;
      border: 1px solid #ddd;
      background: #f8f9fa;
    }
    
    .wiki-difference-token.in-window {
      background: #2196f3;
      color: white;
      border-color: #2196f3;
      font-weight: 600;
    }
    
    .wiki-difference-token.next-char {
      background: #ff9800;
      color: white;
      border-color: #ff9800;
      font-weight: 700;
      position: relative;
      transform: scale(1.05);
    }
    
    .wiki-difference-token.next-char::after {
      content: "⏭️";
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1em;
    }
    
    .wiki-difference-ellipsis {
      color: #6c757d;
      font-style: italic;
      margin: 0 0.3em;
    }
  `,document.head.appendChild(t)}function ne(){ee();const a=I("main");if(a.empty()){console.error("Main element not found for Wiki Logprob Comparison.");return}const t="wiki-logprob-visualization-section";let e=I(`#${t}`);e.empty()||e.remove();const n=a.append("section").attr("id",t);n.append("div").attr("class","wiki-logprob-intro-text").html(`
    <h2>What is lost for LLMs though?</h2>
    <p>
      Obviously we are losing something by snapping values to lower resolutions, but how can we figure out exactly what that is?
      We know that each weight from the original fidelity representation now has some noise added to it. We could determine this difference by subtracting
      (<code>original model weight - dequantized model weight = noise</code>), but this won't tell us much.
    </p>
    <p>
      Another idea is, instead of looking at the weights, look at the model's change in certainty against some known dataset.
      Comparing the output probabilities of the original and quantized models will give us hints into where the model has changed in certainty.
      One common way this is done is practice via <a href="https://huggingface.co/docs/evaluate/en/perplexity" target="_blank">Perplexity</a>.
      (No not the AI application, the metric which predates it).
    </p>
    <div class="data-collection-callout">
        <h3>Data Collection</h3>
        <p>For demonstration purposes I implemented a variation of this metric, basically we:</p>
        <ol>
            <li>Get a target dataset (<a href="https://huggingface.co/datasets/Salesforce/wikitext/" target="blank_">wikitext</a>)</li>
            <li>Slide a window over the dataset to capture input context tokens <code>x_0, ..., x_i-1</code></li>
            <li>Run inference for the quantized and unquantized models for the same input context</li> 
            <li>Get each model's log-probability for the next true token in the dataset, <code>x_i</code></li>
        </ol>
        <p>
          Then to see some impacts of the quantization error we have added, we look at the places in <code>wikitext</code> with 
          the largest absolute difference between model logprobs.
        </p>
        <p>The models I used for this test were:</p>
        <ul>
          <li><strong>Unquantized:</strong> <code><a href="https://huggingface.co/unsloth/gemma-3-1b-it-GGUF/blob/main/gemma-3-1b-it-BF16.gguf" target="_blank">gemma-3-1b-it-BF16</a></code></li>
          <li><strong>Quantized:</strong> <code><a href="https://huggingface.co/unsloth/gemma-3-1b-it-GGUF/blob/main/gemma-3-1b-it-Q4_0.gguf" target="_blank">gemma-3-1b-it-Q4_0</a></code></li>
        </ul>
        <p>
          Although the process is general and could be run with others. 
          You can see the code for that <a href="https://github.com/michaelgiba/what-is-lost-in-quantization/blob/main/python/main.py" target="_blank">here</a>.
        </p>
    </div>
  `),n.append("div").attr("id","wiki-logprob-viz-container"),n.append("div").attr("id","loading-container").append("p").text("Loading data..."),ie(n)}function oe(a,t,e){const n=[...e].map((u,m)=>{const g=Math.exp(u.logprobQ),y=Math.exp(u.logprobU);return{...u,pQ:g,pU:y,difference:Math.abs(g-y),originalIndex:m}}).sort((u,m)=>m.difference-u.difference).slice(0,10);console.log("Top differences:",n.slice(0,5).map(u=>({start:u.start,end:u.end,windowSize:u.end-u.start,nextChar:u.nextCharIdx,tokens:t.slice(u.start,u.end),difference:u.difference})));let i=0;const o=a.append("div").attr("class","wiki-top-differences");o.append("h3").text("Top Quantization Impact Windows"),o.append("p").style("font-size","0.9em").style("color","#6c757d").style("margin-bottom","1em").text("Navigate through the sliding windows with the largest differences in log-probability predictions. An interesting observation is that tokens involving numbers, especially that are part of years seemed to have some of the largest changes in certainty.");const r=o.append("div").attr("class","wiki-controls-row").style("margin-bottom","1em").append("div").attr("class","wiki-window-controls"),d=r.append("button").attr("class","wiki-window-arrow").text("←").on("click",()=>{i>0&&(i--,p())}),c=r.append("span").attr("class","wiki-window-info"),h=r.append("button").attr("class","wiki-window-arrow").text("→").on("click",()=>{i<n.length-1&&(i++,p())}),l=o.append("div").attr("id","top-window-container");function p(){l.selectAll("*").remove();const u=n[i];console.log("Rendering top window:",{window:u,start:u.start,end:u.end,nextCharIdx:u.nextCharIdx,difference:u.difference}),d.attr("disabled",i===0?!0:null),h.attr("disabled",i===n.length-1?!0:null),c.text(`Rank ${i+1} of ${n.length}`);const m=l.append("div").attr("class","wiki-difference-item"),g=m.append("div").attr("class","wiki-difference-header");g.append("div").attr("class","wiki-difference-rank").text(`#${i+1}`);const y=g.append("div").attr("class","wiki-difference-metrics"),k=y.append("div").attr("class","wiki-difference-metric");k.append("div").attr("class","wiki-difference-metric-label").text("Quantized Prob."),k.append("div").attr("class","wiki-difference-metric-value").text(u.pQ.toFixed(5));const C=y.append("div").attr("class","wiki-difference-metric");C.append("div").attr("class","wiki-difference-metric-label").text("Unquantized Prob."),C.append("div").attr("class","wiki-difference-metric-value").text(u.pU.toFixed(5));const x=y.append("div").attr("class","wiki-difference-metric");x.append("div").attr("class","wiki-difference-metric-label").text("Abs Prob Diff"),x.append("div").attr("class","wiki-difference-metric-value difference").text(u.difference.toFixed(3));const w=m.append("div").attr("class","wiki-difference-tokens").append("div").attr("class","wiki-difference-token-row"),f=5,q=Math.max(0,u.start-f),$=Math.min(t.length,u.end+f);q>0&&w.append("span").attr("class","wiki-difference-ellipsis").text("...");for(let v=q;v<u.start;v++)w.append("span").attr("class","wiki-difference-token").text(t[v]);if(u.end-u.start>23){for(let v=u.start;v<u.start+1;v++)w.append("span").attr("class","wiki-difference-token in-window").text(t[v]);w.append("span").attr("class","wiki-difference-ellipsis").text("...");for(let v=u.end-20;v<u.end;v++)w.append("span").attr("class","wiki-difference-token in-window").text(t[v])}else for(let v=u.start;v<u.end;v++)w.append("span").attr("class","wiki-difference-token in-window").text(t[v]);u.nextCharIdx<t.length&&w.append("span").attr("class","wiki-difference-token next-char").text(t[u.nextCharIdx]);for(let v=u.end;v<$;v++)v!==u.nextCharIdx&&w.append("span").attr("class","wiki-difference-token").text(t[v]);$<t.length&&w.append("span").attr("class","wiki-difference-ellipsis").text("...")}p()}async function ie(a){try{let t=function(x){const b=p[u],w=o.filter(V=>V.start<b.end&&V.end>b.start&&V.nextCharIdx>=b.start&&V.nextCharIdx<b.end);if(console.log("getExcerptAroundWindow:",{excerptDef:b,totalWindows:o.length,localWindowsCount:w.length,windowIndex:x,sampleWindows:o.slice(0,3).map(V=>({start:V.start,end:V.end,nextCharIdx:V.nextCharIdx}))}),w.length===0){const V=i.slice(b.start,b.end);return{tokens:V,text:V.join(" "),windowStart:-1,windowEnd:-1,nextCharIdx:-1,absoluteStart:b.start,localWindows:[],win:null}}x>=w.length&&(x=w.length-1),x<0&&(x=0);const f=w[x],q=b.start,$=b.end,z=i.slice(q,$),_=z.join(" "),v=Math.max(0,f.start-q),B=Math.min(z.length,f.end-q),Q=f.nextCharIdx-q;return{tokens:z,text:_,windowStart:v,windowEnd:B,nextCharIdx:Q,absoluteStart:q,localWindows:w,win:f}},e=function(){if(C){console.warn("renderExcerpt called while already rendering, skipping to prevent stack overflow");return}C=!0;try{let x=function(A){const T=z+A,G=o.find(U=>U.nextCharIdx===T);if(!G)return"transparent";const O=Math.abs(G.logprobQ-G.logprobU);return B===Q?"transparent":`rgba(220, 53, 69, ${(O-Q)/(B-Q)*.7})`};k.selectAll("*").remove();const{tokens:b,text:w,windowStart:f,windowEnd:q,nextCharIdx:$,absoluteStart:z,localWindows:_,win:v}=t(m);if(console.log("renderExcerpt called:",{currentExcerpt:u,currentWindow:m,localWindowsCount:_.length,hasWin:!!v,tokens:b.slice(0,5),windowStart:f,windowEnd:q,nextCharIdx:$}),_.length>0?(m>=_.length&&(m=_.length-1),m<0&&(m=0)):m=0,!v){console.log("No window available, rendering basic tokens");const A=k.append("div").attr("class","wiki-token-row");b.forEach((T,G)=>{const O=z+G,W=_.findIndex(U=>U.nextCharIdx===O),R=A.append("div").attr("class","wiki-token");W!==-1&&(R.classed("clickable",!0),R.on("click",()=>{m=W,e()})),R.append("div").attr("class","wiki-token-text").text(T),R.append("div").attr("class","wiki-token-index").text(z+G)}),I(".wiki-controls-row").style("display","none");return}console.log("Rendering with window:",v),I(".wiki-controls-row").style("display","flex");let B=-1/0,Q=1/0;for(const A of o){const T=Math.abs(A.logprobQ-A.logprobU);T>B&&(B=T),T<Q&&(Q=T)}const V=Math.exp(v.logprobQ),H=Math.exp(v.logprobU),st=Math.abs(V-H),Z=k.append("div").attr("class","wiki-logprob-details");Z.append("div").attr("class","section-title").text("Next Character Log Probability Comparison"),Z.append("div").attr("class","section-description").text("This section shows the predicted log-probabilities for the next character in the sequence, as computed by both the quantized and unquantized models. The difference quantifies the impact of quantization on model confidence.");const tt=Z.append("div").attr("class","metrics-grid"),ot=tt.append("div").attr("class","metric-item");ot.append("div").attr("class","metric-label").text("Quantized Prob."),ot.append("div").attr("class","metric-value").text(V.toFixed(3));const lt=tt.append("div").attr("class","metric-item");lt.append("div").attr("class","metric-label").text("Unquantized Prob."),lt.append("div").attr("class","metric-value").text(H.toFixed(3));const ct=tt.append("div").attr("class","metric-item difference");ct.append("div").attr("class","metric-label").text("Abs Prob Diff"),ct.append("div").attr("class","metric-value").text(st.toFixed(3));const it=k.append("div").attr("class","wiki-token-row");b.forEach((A,T)=>{const G=z+T,O=_.findIndex(U=>U.nextCharIdx===G),W=it.append("div").attr("class","wiki-token").classed("in-window",T>=f&&T<q).classed("next-char",T===$);O!==-1&&(W.classed("clickable",!0),W.on("click",()=>{m=O,e()}));const R=W.append("div").attr("class","wiki-token-text").text(A);!(T>=f&&T<q)&&T!==$&&R.style("background-color",x(T)),W.append("div").attr("class","wiki-token-index").text(z+T)});const P=k.append("div").attr("class","wiki-controls-row"),j=P.append("div").attr("class","wiki-window-controls");j.append("button").attr("class","wiki-window-arrow").attr("disabled",m===0?!0:null).text("←").on("click",()=>{m>0&&(m--,e())}),j.append("span").attr("class","wiki-window-info").text(`Window ${m+1} of ${_.length}`),j.append("button").attr("class","wiki-window-arrow").attr("disabled",m===_.length-1?!0:null).text("→").on("click",()=>{m<_.length-1&&(m++,e())});const at=P.append("div").attr("class","wiki-window-legend"),et=at.append("div").attr("class","wiki-legend-item");et.append("div").attr("class","wiki-legend-box window"),et.append("span").text("Current Window");const dt=at.append("div").attr("class","wiki-legend-item");dt.append("div").attr("class","wiki-legend-box next-char"),dt.append("span").text("Next Character")}finally{C=!1}};const n=await te();a.select("#loading-container").remove();const i=n.allTokens,o=n.windowData;console.log("Data loaded:",{totalTokens:i.length,totalWindows:o.length,firstFewTokens:i.slice(0,10),firstFewWindows:o.slice(0,3)}),oe(a,i,o),a.append("hr").style("margin","2em 0").style("border","none").style("border-top","2px solid #e9ecef"),a.append("h3").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","1.4em").style("font-weight","600").style("color",M.headingColor).style("margin-bottom","0.8em").text("Interactive Window Explorer");const s=200,r=[],c=[...o].map((x,b)=>({...x,originalIndex:b,difference:Math.abs(x.logprobQ-x.logprobU)})).sort((x,b)=>b.difference-x.difference).slice(0,20),h=[];c.forEach(x=>{const b=x.start+Math.floor((x.end-x.start)/2),w=Math.max(0,b-Math.floor(s/2)),f=Math.min(i.length,w+s);h.some($=>{const z=Math.max(w,$.start),_=Math.min(f,$.end);return Math.max(0,_-z)>s*.5})||(r.push({start:w,end:f}),h.push({start:w,end:f}))}),r.length===0&&i.length>0&&r.push({start:0,end:Math.min(i.length,s)});const l=r.filter(x=>o.filter(w=>w.start<x.end&&w.end>x.start&&w.nextCharIdx>=x.start&&w.nextCharIdx<x.end).length>0),p=l.length>0?l:r;let u=0;console.log("Generated excerpts:",p.length);let m=0;const g=a.append("div").attr("class","wiki-excerpt-switcher");g.append("label").text("Select Excerpt:");const y=g.append("select").attr("class","wiki-excerpt-dropdown");p.forEach((x,b)=>{const w=o.filter(f=>f.start<x.end&&f.end>x.start&&f.nextCharIdx>=x.start&&f.nextCharIdx<x.end).length;y.append("option").attr("value",b).property("selected",b===u).text(`Excerpt ${b+1} (${w} windows)`)}),y.on("change",function(){u=parseInt(this.value),m=0,e()});const k=a.append("div").attr("id","wiki-excerpt-container");let C=!1;e()}catch(t){console.error("Failed to load wiki text data:",t),a.select("#loading-container").select("p").text("Failed to load data. Please check the console for details.").style("color","red")}}function ae(){const a=document.querySelector("main");if(!a){console.error("Main element not found");return}const t=I(a).append("article").attr("id","summary").style("margin-top","2em").style("margin-bottom","3em");t.append("h2").text("Summary").style("font-family",'Consolas, Monaco, "Courier New", monospace').style("font-size","1.6em").style("font-weight","600").style("color",M.headingColor).style("margin-bottom","0.5em");const e=t.append("div").style("font-family","Georgia, serif").style("font-size","1em").style("line-height","1.7").style("color",M.textColor);e.html(`
        <p>While we definitely did not fully characterize what the impact of quantization for LLMs is generally, we have:</p>
        <ol style="margin-left: 2em;">
            <li>Observed some interesting artifacts in outputs, similar to the noise of quantized audio or images with small color spaces.</li>
            <li>Gained a better understanding of the machinery which underlies state-of-the-art techniques for making models smaller.</li>
        </ol>
    `),e.append("p").html('Have any thoughts or questions? Feel free to email me at <a href="mailto:michaelgiba@gmail.com" style="color: ${PROJECT_COLORS.primaryVizColor};">michaelgiba@gmail.com</a>.').style("margin-top","20px").style("font-style","italic")}document.addEventListener("DOMContentLoaded",()=>{requestAnimationFrame(()=>{document.body.classList.add("loaded")}),Nt(),Ut(),Zt(),ne(),ae()});
