
(function(){
  var btn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
  if(btn){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o);});}

  // count-up stats
  var els=document.querySelectorAll('[data-count]');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;io.unobserve(e.target);
      var el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'',t0=null;
      function step(t){t0=t0||t;var p=Math.min((t-t0)/1200,1);el.textContent=Math.round(end*p)+(p===1?suf:'');if(p<1)requestAnimationFrame(step);}
      requestAnimationFrame(step);});},{threshold:.4});
    els.forEach(function(el){io.observe(el);});
  } else {els.forEach(function(el){el.textContent=el.dataset.count+(el.dataset.suffix||'');});}

  // forms
  document.querySelectorAll('form.form').forEach(function(form){
    var status=form.querySelector('.status');
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var ok=true;
      form.querySelectorAll('[required]').forEach(function(f){
        var bad=f.type==='checkbox'?!f.checked:!f.value.trim();
        if(f.type==='email'&&f.value&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value))bad=true;
        f.classList.toggle('invalid',bad);if(bad)ok=false;});
      if(form.querySelector('.hp').value){return;} // bot
      if(!ok){status.className='status err';status.textContent='Please fill in all required fields correctly.';return;}
      var data=new FormData(form),endpoint=form.dataset.endpoint;
      var b=form.querySelector('button');b.disabled=true;
      if(endpoint){
        fetch(endpoint,{method:'POST',body:data,headers:{Accept:'application/json'}}).then(function(r){
          if(!r.ok)throw 0;form.reset();status.className='status ok';
          status.textContent='Thank you! Your message has been sent. We will reply soon.';
        }).catch(function(){status.className='status err';status.textContent='Could not send. Please email us at '+form.dataset.email+'.';})
        .finally(function(){b.disabled=false;});
      } else {
        // no backend configured: open the visitor's email app with the message pre-filled
        var body=[];data.forEach(function(v,k){if(k!=='website'&&k!=='consent')body.push(k+': '+v);});
        location.href='mailto:'+form.dataset.email+'?subject='+encodeURIComponent(data.get('subject')||'Website enquiry')+'&body='+encodeURIComponent(body.join('\n'));
        status.className='status ok';status.textContent='Your email app should open with the message ready to send.';b.disabled=false;
      }
    });
  });
})();
