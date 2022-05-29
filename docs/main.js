let t=5;const e={setLevel(e){t=e},severe(e){t>=1&&console.error(e)},warn(e){t>=2&&console.warn(e)},info(e){t>=3&&console.log(e)},fine(e){t>=4&&console.log(e)},finer(e){t>=5&&console.log(e)}},n={version:'2.000',options:{instantButtons:!1,fasterButtons:!1,fasterTasks:!1,loggerLevel:5}};function o(t,e){return t==e?t:Math.random()*(e-t)+t}function i(t){return t[(e=0,n=t.length,Math.floor(o(e,n)))];var e,n}const l={},s={};function a(){}class r{constructor({id:t=null,cooldown:n=0,saveCooldown:o=!1,onClick:i=a,onFinish:s=a,text:r='button',tooltip:d=null,width:c=null}={}){this.id=t,this.cooldown=n,this.onCooldown=this.cooldown>0,this.saveCooldown=o,this.element=function(t,e){let n=$('<div>').addClass('button').text(e).on('click',(()=>t.click()));return $('<div>').addClass('cooldown').appendTo(n),n}(this,r),this.onClick=i,this.onFinish=s,null==this.id&&this.saveCooldown&&e.warn('Button with no ID cannot save cooldown'),null!=d&&d.exists()&&d.appendTo(this.element),null!=this.id&&this.element.addClass('button_'+this.id),null!=c&&this.element.css('width',c),null!=this.id&&l.hasOwnProperty(this.id)&&this.startCooldown(l[this.id])}static getButton(t){return s[t]}static saveSavedCooldowns(){return JSON.stringify(l)}static loadSavedCooldowns(t){l=JSON.parse(t)}setText(){this.element.text(text)}setCooldown(t){this.cooldown=t}appendTo(t){return this.element.appendTo(t),this}startCooldown(t=null){let e=this.cooldown,n=100;if(null==t||t>e?t=e:n=t/e*100,e<=2)return void this.finish();this.clearCooldown();let o=this;if(this.element.find('.cooldown').width(n+'%').animate({width:'0%'},t,'linear',(()=>{o.clearCooldown(),o.finish()})),this.saveCooldown){l[this.id]=.001*t;let e=setInterval((function(){if(l[this.id]-.5<0)return delete l[this.id],void clearInterval(e);var t,n;l[this.id]=(t=l[this.id]-.5,n=2,+t.toFixed(n))}),500)}this.onCooldown=!0,this.setDisabled(!0)}click(){if(!this.element.hasClass('disabled')){let t=this.onClick();(null==t||t)&&this.startCooldown()}}finish(){this.onFinish()}clearCooldown(){this.onCooldown=!1,this.setDisabled(!1)}setDisabled(t){t||this.onCooldown?t&&this.element.addClass('disabled'):this.element.removeClass('disabled')}}const d={};function c(t){let e=t.split(/[.\[\]'"]+/);for(let t=e.length-1;t>=0;--t)e[t].length<=0&&e.splice(t,1);return e}function u(t,e=null){let n=c(t),o=d,i=null;for(let t=0;t<n.length;++t){if(i=n[t],'object'==typeof o&&!o.hasOwnProperty(i))return e;o=o[i]}return o}function h(t,n){return function(t,n){let o,i=c(t),l=d,s=null;for(o=0;o<i.length-1;++o)s=i[o],l.hasOwnProperty(s)||(l[s]={}),l=l[s];s=i[o];let a=l.hasOwnProperty(s);return l[s]=n,e.finer('SET '+t+' = '+n),!a}(t,n)}function p(t){return $(t.target).hasClass('menu-btn')}function f(){return!0}const m={keyLock:!1,navigation:!0,darkMode:!1,darkArea:!1,currentArea:null};function v(t){t?(m.darkMode=!0,$('body').addClass('dark')):(m.darkMode=!1,$('body').removeClass('dark'))}function g(t=null){m.darkArea=t,2==u('options.lights')&&v(!!t)}let w={},b=null,x=null,C=null;function y(t){$('<div>').addClass('notification').css('opacity',0).text(t).prependTo(b).animate({opacity:1},500,'linear',(function(){!function(){let t=x.position().top+x.outerHeight(!0);$('.notification').each((function(){let e=$(this);e.position().top>t&&e.remove()}))}()}))}function k(t){return t.length>0&&!('.!?'.indexOf(t.slice(-1))>-1)&&(e.warn('Message '+t+' does not end with punctuation'),t+='.'),t}function T(t='',e=null,n){t=k(t),null!=e&&m.currentArea!=e?n||(w.hasOwnProperty(e)||(w[e]=[]),w[e].push(t)):y(t)}let L=null,E=null,A=[],I=[];function P(){return I.length>0?I[0]:null}function S(){return P().eventPanel}function O(){if(I.length<=0){let t=[];for(let e of A)e.isAvailable()&&t.push(e);if(!(t.length>0))return void null.scheduleNext(.5);_(function(t,e=1,n='weight'){let i=0;for(let o of t)o.hasOwnProperty(n)?i+=o[n]:i+=e;let l=o(0,i),s=0,a=0;for(;s<l;){let o=t[a++];o.hasOwnProperty(n)?s+=o[n]:s+=e}return t[a-1]}(t))}null.scheduleNext()}function _(t){m.keyLock=!0,m.navigation=!1,I.push(t),t.eventPanel=$('<div>').addClass('event event-panel').css('opacity',0),$('<div>').addClass('event-title').text(t.title).appendTo(t.eventPanel),$('<div>').addClass('event-description').appendTo(t.eventPanel),$('<div>').addClass('event-buttons').appendTo(t.eventPanel),'function'==typeof t.getContext&&(t.context=t.getContext());let e=B('start',t);null!=e.notification&&T(e.notification),I.length<=1&&N()}function N(){D('start',!0);let t=S();$('.wrapper').append(t),t.animate({opacity:1},200,'linear'),B(L).blink&&function(){let t=document.title;if(null!=E)return;E=setInterval((()=>{document.title='*** EVENT ***',setTimeout((()=>{document.title=t}),1500)}),3e3)}()}function V(){let t=S();t.animate({opacity:0},200,'linear',(()=>{t.remove();let n=P();delete n.eventPanel,delete n.context,I.shift(),I.length>0?(N(),e.finer(I.length+' events remaining')):(null!=E&&(clearInterval(E),E=null),m.keyLock=!1,m.navigation=!0,$('body').trigger('focus'))}))}function D(t,n=!1){e.finer('Loading scene: '+t),L=t;let o=B(t),i=S();'function'==typeof o.onLoad&&o.onLoad(),null==o.notification||n||T(o.notification),null!=o.eventTitle&&$('.event-title',i).text(o.eventTitle),$('.event-description',i).empty(),$('.event-buttons',i).empty(),function(t){let e=S(),n=$('.event-description',e);for(let e=0;e<t.text.length;++e)$('<div>').text(t.text[e]).appendTo(n);if(null!=t.input){document.onselectstart=p,document.onmousedown=p;let e=$('<input>').attr({type:'text',name:'input',spellcheck:!1,placeholder:t.input}).appendTo(n);null!=t.maxinput&&e.attr('maxlength',t.maxinput),$('<div>').addClass('input-result').css('opacity',0).appendTo(n),n.find('input').trigger('focus').trigger('select')}let o=$('<div>').addClass('exit-buttons').appendTo($('.event-buttons',e));null!=t.buttons&&function(t,e){for(let n in t){if(t.hasOwnProperty(n)){let o=t[n],i=o.text;null==i&&(i=n);let l=new r({id:n,text:i,tooltip:o.tooltip||null,onClick:function(){F(this)},cooldown:o.cooldown}).appendTo(e);null!=o.cooldown&&l.startCooldown()}M()}}(t.buttons,o);$('<div>').addClass('clear').appendTo(o)}(o)}function M(){let t=B(L).buttons;for(let e in t)if(t.hasOwnProperty(e)){let n=r.getButton(e),o=t[e];null==o.available||o.available()||n.setDisabled(!0)}}function F(t){let n=B(L),i=n.buttons[t.id];if(null!=i.click){let t=i.click();if(null!=t&&!t){if('string'==typeof t)if(null==n.input)T(t);else{let e=S().find('.input-result');0==e.css('opacity')&&(t=k(t),e.text(t).css('opacity',1).animate({opacity:0},1500,'linear'))}return}null!=n.input&&'end'==i.nextScene&&(document.onselectstart=f,document.onmousedown=f)}if(M(),null!=i.notification&&T(i.notification),null!=i.nextScene)if('end'==i.nextScene)t.setDisabled(!0),V();else if('string'==typeof i.nextScene)D(i.nextScene);else{let t=function(t){let e=0;for(let n in t)t.hasOwnProperty(n)&&(e+=t[n]);let n=o(0,e),i=0;for(let e in t)if(t.hasOwnProperty(e)&&(i+=t[e],i>=n))return e;return null}(i.nextScene);if(null==t)return e.severe('No suitable scene found after "'+L+'"'),void V();D(t)}}function B(t,e=null){let n=(e=e||P()).scenes[t];return'function'==typeof n?n(e.context):n}const H={};class z{constructor(t,e){this.id=t,this.name=e,this.isVisible=!0,this.element=null,this.buttonElement=null,this.onLoadCallback=()=>{},this.onArrivalCallback=()=>{}}onLoad(t){return null==t?this.onLoadCallback(this):this.onLoadCallback=t,this}onArrival(t){return null==t?this.onArrivalCallback(this):this.onArrivalCallback=t,this}setName(t,e=!1){this.name=t,this.buttonElement.text(this.name),e&&this.buttonElement.hide().fadeIn(500,'linear')}setVisible(t){return this.isVisible=t,null==this.element||null==this.buttonElement||(t?this.buttonElement.fadeIn(500,'linear'):this.buttonElement.hide()),this}}class q{constructor(t,e){this.id=t,this.name=e,this.locations=[],this.currentIndex=-1,this.isVisible=!0,this.element=null,this.buttonElement=null}Init(){for(let t of this.locations)t.onLoad(),t.setVisible(t.isVisible);this.goToLocation(0)}onArrival(t){!function(t){if(w.hasOwnProperty(t))for(;w[t].length;)Notifications.printMessage(w[t].shift())}(this.id)}addLocation(t){this.locations.push(t)}addLocations(...t){for(let e of t)this.addLocation(e)}goToLocation(t){if((t<0||t>=this.locations.length)&&e.warn('Tried to go to invalid location index '+t),this.currentIndex==t)return;let n=this.locations[t];this.element.find('.location-button').removeClass('selected'),n.buttonElement.addClass('selected');let o=this.element.find('.location-content .location-slider'),i=o.find('.location').index(n.element),l=this.currentIndex>-1?this.currentIndex:0,s=Math.abs(i-l);o.animate({top:-624*i+'px'},300*s),n.onArrival(),this.currentIndex=t}createElement(){if(null!=this.element)return this.element;let t=$('<div>').addClass('area-panel area-panel_'+this.id),e=$('<div>').addClass('location-select').appendTo(t),n=$('<div>').addClass('location-content').appendTo(t),o=$('<div>').addClass('location-slider').appendTo(n),i=this;for(let t=0;t<this.locations.length;++t){let n=this.locations[t];n.buttonElement=$('<div>').addClass('location-button location-button_'+n.id).text(n.name).on('click',(()=>{i.goToLocation(t)})).appendTo(e),n.element=$('<div>').addClass('location location_'+n.id).appendTo(o)}return this.element=t,t}setName(t,e=!1){this.name=t,this.buttonElement.text(this.name),e&&this.buttonElement.hide().fadeIn(500,'linear')}setVisible(t){return this.isVisible=t,null==this.element||null==this.buttonElement||(t?(this.buttonElement.fadeIn(200,'linear'),this.element.show()):(this.buttonElement.hide(),this.element.hide())),this}}function J(t){let e=$('<div>').addClass('area-button area-button_'+t.id).text(t.name).on('click',(()=>{R(t.id)})).appendTo('.area-select');t.buttonElement=e,t.createElement().appendTo('.area-slider'),H[t.id]=t}function R(t){if(m.currentArea==t)return;e.finer('Traveling to area '+t);let n=H[t];if(null==n)return void e.severe('Invalid area '+t);$('.area-button').removeClass('selected'),n.buttonElement.addClass('selected');let o=$('.area-slider'),i=$('.area-panel').index(n.element),l=null==m.currentArea?0:$('.area-panel').index(H[m.currentArea].element),s=Math.abs(i-l);o.animate({left:-700*i+'px'},300*s),m.currentArea=t,n.onArrival(s)}const j=['dreamed of white sails flying in the salty air.','dreamed of stormy seas and raging tides.','dreamed of a bottomless abyss, rays of light fading away.'],Q=['a blue sea, waves gently lapping against the shore','dark and stormy nights','dreamed of a blazing inferno, heat unbearable','bright skies and lazy clouds','crackling thunder and pouring rain','soft flakes of snow','merciless ice hurtling from the sky','soft whispers and a warm embrace','fish swimming across the sky','a hunter stalking its prey','a world covered in ash','a land of unyielding stone, not a blade of grass in sight','a blazing radiance, the heat of the sun\'s fury','crimson mist and a wolf\'s howl','a trident buried deep in the sea','a field of stars, glistening in the darkness'];class W extends z{constructor(t,e){super(t,e)}}const G=new q('house','');let K=null;const U=['feather-soft whiskers brush past.','purring grows more insistent.'];function X(t){T(t),K=setTimeout((()=>{X(i(U))}),o(1e4,2e4))}const Y=new r({id:'start_game',text:'wake up',cooldown:5e3,onClick:()=>{let t=u('progress.start');t<j.length&&(T(j[t]),t==j.length-1&&(setTimeout((()=>{T('the embrace of far-away adventures reach out in an embrace.'),tt.element.insertBefore(Y.element),Z=5}),3e3),setTimeout((()=>{X('something purrs.')}),1e4)))},onFinish:()=>{let t=u('progress.start');t<j.length?function(t,n){let o=u(t,0);isNaN(o)?e.severe('Tried to add to "'+t+'" which is not a number.'):h(t,o+n)}('progress.start',1):t==j.length&&(G.setName('A Dark Room',!0),g(!0),tt.element.remove(),T('an inquisitive face peeks up above the bedsheets.'),clearTimeout(K),K=null)}});let Z=0;const tt=new r({id:'random_dream',text:'dream',cooldown:5e3,onClick:()=>{T('dreamed of '+i(Q)+'.')},onFinish:()=>{--Z<=0&&(T('probably better .'),tt.setDisabled(!0))}});const et=new q('town','A Quiet Town');class nt{constructor(t='bottom left'){this.element=$('<div>').addClass('tooltip '+t)}addText(t){return $('<div>').text(t).appendTo(this.element),this}addCost(t,e){return $('<div>').addClass('row_key').text(t).appendTo(this.element),$('<div>').addClass('row_val').text(e).appendTo(this.element),this}append(t){return this.element.append(t),this}appendTo(t){return this.element.appendTo(t),this}exists(){return this.element.children().length>0}}function ot(){!function(){let t=$('.main');$('<div>').addClass('area-select').appendTo(t),$('<div>').addClass('area-slider').appendTo(t)}(),function(){const t=new W('bedroom','').onLoad((t=>{u('progress.start')<j.length&&Y.appendTo(t.element)}));G.addLocations(t,new W('hallway','Hallway').setVisible(!1)),J(G),G.Init()}(),et.addLocations(new z('store','Store').onLoad((()=>{})),new z('park','Park')),J(et),et.Init(),et.setVisible(!1),function(){let t=$('.area-slider');t.width(700*t.children().length+'px')}()}function it(){let t=$('<div>').addClass('footer').appendTo('body');$('<span>').addClass('footer-button version').text('v'+n.version).appendTo(t),$('<span>').addClass('footer-button github').text('github.').on('click',(()=>{window.open('https://github.com/Drakonkinst/cat-simulation-2')})).appendTo(t),$('<span>').addClass('footer-button').text('discord.').on('click',(()=>{window.open('https://discord.gg/Wrp7Fre')})).appendTo(t),$('<span>').addClass('footer-button').text('options.').on('click',(()=>{_({title:'Options',scenes:{start:()=>{$('div.event-title').text('Options');let t=u('options.lights',0);return{text:['set to heart\'s desire.'],buttons:{lights:{text:lt(t),click:()=>{var e;t=(t+1)%3,h('options.lights',e=t),0==e?v(!1):1==e?v(!0):2==e&&g(m.darkArea),$('.button.button_lights').text(lt(t))}},save:{nextScene:'export_import'},restart:{nextScene:'confirm_restart'},close:{nextScene:'end'}}}},confirm_restart:()=>($('div.event-title').text('Restart?'),{text:['restart the game?'],buttons:{yes:{click:()=>{T('nothing here yet.')},nextScene:'end'},no:{nextScene:'start'}}}),export_import:()=>($('div.event-title').text('Export / Import'),{text:['export or import save data','for backing up or migrating computers'],buttons:{export:{click:()=>{T('nothing here yet.')}},import:{click:()=>{T('nothing here yet.')}},cancel:{nextScene:'start'}}})}})})).appendTo(t)}function lt(t){let e='lights: ';return 0==t?e+='on':1==t?e+='off':2==t&&(e+='adaptive'),e}function st(){e.setLevel(n.options.loggerLevel),h('world.day',1),h('options.lights',0),h('progress.start',0),h('progress.unlocked.town',!1),it(),b=$('<div>').addClass('notifications').appendTo('.wrapper'),x=$('<div>').addClass('notify-gradient').appendTo(b),C=$('<div>').addClass('quick-notify').appendTo('.wrapper'),ot(),window.getState=rt}function at(){st(),R('house'),new r({text:'Hello, world!',tooltip:(new nt).addCost('soul',1).addText('something\'s out there.'),cooldown:1e3,onClick:()=>{var t;e.info('Hello, world!'),T('Hello, world!'),t=k(t='Hello, world!'),C.stop().text(t).css('opacity',1).animate({opacity:0},3e3,'linear'),O()}})}function rt(){return d}$((()=>{at()}));
//# sourceMappingURL=main.js.map
