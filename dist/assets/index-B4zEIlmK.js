(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function i(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function l(a){if(a.ep)return;a.ep=!0;const n=i(a);fetch(a.href,n)}})();const be={flights:{flight_id:"0",airline:"1",airline_code:"2",origin:"3",destination:"4",sched_dep:"5",actual_dep:"6",sched_arr:"7",actual_arr:"8",aircraft_type:"9",tail_number:"10",capacity:"11",pax_count:"12",status:"13",delay_mins:"14",delay_reason:"15",terminal:"16",gate:"17",is_international:"18",distance_km:"19",fuel_kg:"20",pushback_time:"21",on_time:"22",weather:"23",load_factor:"24",bag_count:"25",on_time_ratio:"26",time_of_day:"27",day_of_week:"28",is_holiday:"29",season:"30",flight_type:"31"},passengers:{passenger_id:"0",ticket_no:"1",pnr_code:"2",first_name:"3",last_name:"4",nationality:"5",dob:"6",gender:"7",seat:"8",booking_class:"9",flight_id:"10",checkin_time:"11",boarding_time:"12",gate:"13",bag_count:"14",email:"18",phone:"19",is_vip:"22",wait_time_hrs:"23",special_assistance:"24",booked_class:"25",age:"26",age_group:"27"},baggage:{tag_id:"0",bag_id:"1",flight_id:"2",pnr_code:"3",weight_kg:"4",dimensions:"5",check_type:"6",belt:"7",scan_time:"8",checkin_time:"9",carousel:"10",status:"11",mishandled:"12",claim_count:"13",area:"14"},gate_events:{event_id:"0",flight_id:"1",gate:"2",terminal:"3",event_type:"4",event_time:"5",staff_id:"6",duration_mins:"7",priority:"8",delayed:"9"},security_screening:{screening_id:"0",pnr_code:"1",queue_id:"2",lane:"3",scan_time:"4",entry_time:"5",exit_time:"6",result:"7",flagged:"9",staff_id:"10",scanner_id:"11",wait_secs:"12",secondary_check:"13",shift_id:"15",throughput_per_hr:"16",staff_count:"17",queue_length:"18"},maintenance_logs:{work_order:"0",tail_number:"1",flight_id:"2",work_type:"3",team_id:"4",start_time:"5",end_time:"6",duration_hrs:"7",work_order_num:"8",defect_type:"9",fix_type:"10",severity:"11",tech_id:"12",resolved:"13"},staff_shifts:{staff_id:"0",name:"1",dept:"2",role:"3",shift_date:"4",shift_start:"5",shift_end:"6",terminal:"7",gate:"8",assigned_id:"9",hours:"10",overtime:"11",language:"14"},retail_transactions:{txn_id:"0",staff_id:"1",shop_name:"2",shop_type:"3",pnr_code:"4",flight_id:"5",txn_time:"6",item:"7",quantity:"8",unit_price:"9",total_amount:"10",payment_method:"11",currency:"12",terminal:"14",location:"15",is_airside:"16"}},Ee=[{key:"flights",file:"flights.csv"},{key:"passengers",file:"passengers.csv"},{key:"baggage",file:"baggage.csv"},{key:"gate_events",file:"gate_events.csv"},{key:"security_screening",file:"security_screening.csv"},{key:"maintenance_logs",file:"maintenance_logs.csv"},{key:"staff_shifts",file:"staff_shifts.csv"},{key:"retail_transactions",file:"retail_transactions.csv"}];async function _e(e){const t={};for(const{key:i,file:l}of Ee){e==null||e(i,0);const a=await Ie(`/data/${l}`);t[i]=a,e==null||e(i,100)}return t}function Ie(e){return new Promise((t,i)=>{Papa.parse(e,{download:!0,header:!0,skipEmptyLines:!0,complete:({data:l})=>t(l),error:i})})}function Te(e,t){const i=be[e];if(!i)return t;const l={};for(const[a,n]of Object.entries(i))l[a]=t[n]??null;return l}function k(e,t){return t.map(i=>Te(e,i))}const r={flights:[],passengers:[],baggage:[],gate_events:[],security_screening:[],maintenance_logs:[],staff_shifts:[],retail_transactions:[],_idx:{flightById:{},passByPnr:{},passByFlight:{},baggageByFlight:{},baggageByPnr:{},gateEventsByFlight:{},gateEventsByGate:{},screeningByPnr:{},maintenanceByFlight:{},maintenanceByTail:{},retailByFlight:{},retailByPnr:{},staffByGate:{}}};function Ae(e){r.flights=k("flights",e.flights),r.passengers=k("passengers",e.passengers),r.baggage=k("baggage",e.baggage),r.gate_events=k("gate_events",e.gate_events),r.security_screening=k("security_screening",e.security_screening),r.maintenance_logs=k("maintenance_logs",e.maintenance_logs),r.staff_shifts=k("staff_shifts",e.staff_shifts),r.retail_transactions=k("retail_transactions",e.retail_transactions),ke(),Se()}function ke(){const e=["ATC","CREW","TECH","WX","TURNAROUND",""],t=["Boarding Start","Boarding Complete","Gate Open","Gate Close","Aircraft Push","Aircraft Dock","Fuel Complete"],i=["Inspection","Repair","Part Replacement","Engine Check","Software Update","Safety Audit"],l=["Hydraulic leak","Sensor fault","Tire wear","Navigation error","Engine vibration","Brake issue","None"],a=["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13","B14","B15","B16","B17","B18","B19","B20"],n=["Security","Ground Handling","Ops","Retail","Immigration","Customs","Maintenance"],s=["Agent","Supervisor","Manager","Technician","Officer","Coordinator"],c=["Duty Free","IndiGo Café","Starbucks","WHSmith","Shoppers Stop","Food Court","Grab & Go"],o=["Perfume","Whisky","Chocolate","Electronics","Snacks","Coffee","Books","Cosmetics","Toys","Clothing"],v=["Card","Cash","UPI","Miles","Contactless"];r.flights.forEach((d,p)=>{d.gate=a[p%a.length],d.delay_mins=parseInt(d.delay_mins)||0,d.delay_reason=d.delay_reason||(d.delay_mins>0?e[p%5]:""),d.capacity=parseInt(d.capacity)||200,d.pax_count=parseInt(d.pax_count)||Math.floor(d.capacity*(.6+Math.random()*.35)),d.load_factor=parseFloat(d.load_factor)||(d.pax_count/d.capacity*100).toFixed(1),d.bag_count=parseInt(d.bag_count)||Math.floor(d.pax_count*.8),d.is_international=String(d.is_international)==="True",d.is_holiday=String(d.is_holiday)==="True",d._simStatus="Scheduled",d._simDelay=d.delay_mins}),r.baggage.forEach((d,p)=>{const y=Math.random();y<.72?d.status="Loaded":y<.85?d.status="In Transit":y<.94?d.status="On Belt":y<.98?d.status="Delayed":d.status="Mishandled",d.mishandled=d.status==="Mishandled",d.weight_kg=parseFloat(d.weight_kg)||15,d.carousel=parseInt(d.carousel)||p%10+1}),r.gate_events.forEach((d,p)=>{d.event_type=t[p%t.length],d.priority=p%10===0?"Urgent":p%4===0?"Priority":"Routine",d.delayed=Math.random()<.15,d.gate=a[p%a.length],d.duration_mins=parseInt(d.duration_mins)||30}),r.security_screening.forEach((d,p)=>{const y=Math.random();d.result=y<.88?"Clear":y<.95?"Secondary Check":"Flagged",d.flagged=d.result==="Flagged",d.secondary_check=d.result==="Secondary Check"||d.flagged,d.lane=parseInt(d.lane)||p%8+1,d.queue_length=Math.floor(15+Math.random()*85),d.wait_secs=parseInt(d.wait_secs)||Math.floor(30+Math.random()*120),d.throughput_per_hr=parseInt(d.throughput_per_hr)||Math.floor(280+Math.random()*160)}),r.maintenance_logs.forEach((d,p)=>{d.work_type=i[p%i.length],d.defect_type=l[p%l.length],d.severity=p%3+1,d.resolved=Math.random()<.35,d.duration_hrs=parseInt(d.duration_hrs)||Math.floor(1+Math.random()*12),d._simStatus=d.resolved?"Resolved":p%3===0?"In Progress":"Open"}),r.staff_shifts.forEach((d,p)=>{d.dept=n[p%n.length],d.role=s[p%s.length],d.overtime=Math.random()<.12,d.gate=a[p%a.length],d.hours=parseInt(d.hours)||8}),r.passengers.forEach((d,p)=>{d.is_vip=String(d.is_vip)==="True"||Math.random()<.05,d.special_assistance=String(d.special_assistance)==="True"||Math.random()<.04,d.age=parseInt(d.age)||30,d.wait_time_hrs=parseFloat(d.wait_time_hrs)||Math.random()*3}),r.retail_transactions.forEach((d,p)=>{d.shop_name=c[p%c.length],d.item=o[p%o.length],d.payment_method=v[p%v.length],d.total_amount=parseInt(d.total_amount)||Math.floor(500+Math.random()*5e3),d.unit_price=parseInt(d.unit_price)||Math.floor(d.total_amount*(.8+Math.random()*.5)),d.quantity=parseInt(d.quantity)||1})}function Se(){const e=r._idx;r.flights.forEach(t=>{e.flightById[t.flight_id]=t,e.passByFlight[t.flight_id]=[],e.baggageByFlight[t.flight_id]=[],e.gateEventsByFlight[t.flight_id]=[],e.maintenanceByFlight[t.flight_id]=[],e.retailByFlight[t.flight_id]=[]}),r.passengers.forEach(t=>{e.passByPnr[t.pnr_code]=t,e.passByFlight[t.flight_id]&&e.passByFlight[t.flight_id].push(t)}),r.baggage.forEach(t=>{e.baggageByPnr[t.pnr_code]||(e.baggageByPnr[t.pnr_code]=[]),e.baggageByPnr[t.pnr_code].push(t),e.baggageByFlight[t.flight_id]&&e.baggageByFlight[t.flight_id].push(t)}),r.gate_events.forEach(t=>{e.gateEventsByGate[t.gate]||(e.gateEventsByGate[t.gate]=[]),e.gateEventsByGate[t.gate].push(t),e.gateEventsByFlight[t.flight_id]&&e.gateEventsByFlight[t.flight_id].push(t)}),r.security_screening.forEach(t=>{e.screeningByPnr[t.pnr_code]=t}),r.maintenance_logs.forEach(t=>{e.maintenanceByTail[t.tail_number]||(e.maintenanceByTail[t.tail_number]=[]),e.maintenanceByTail[t.tail_number].push(t),e.maintenanceByFlight[t.flight_id]&&e.maintenanceByFlight[t.flight_id].push(t)}),r.staff_shifts.forEach(t=>{e.staffByGate[t.gate]||(e.staffByGate[t.gate]=[]),e.staffByGate[t.gate].push(t)}),r.retail_transactions.forEach(t=>{e.retailByPnr[t.pnr_code]||(e.retailByPnr[t.pnr_code]=[]),e.retailByPnr[t.pnr_code].push(t),e.retailByFlight[t.flight_id]&&e.retailByFlight[t.flight_id].push(t)})}function xe(e){return r._idx.passByFlight[e]||[]}function $e(e){return r._idx.baggageByFlight[e]||[]}function Le(e){return r._idx.gateEventsByFlight[e]||[]}function Ce(e){return r._idx.maintenanceByFlight[e]||[]}function we(e){return r._idx.retailByFlight[e]||[]}function Re(e){return r._idx.screeningByPnr[e]||null}function Me(e){return r._idx.baggageByPnr[e]||[]}function Be(e){return r._idx.gateEventsByGate[e]||[]}function Ne(e){return r._idx.staffByGate[e]||[]}const ce=[],A=[];function L(e){e.time=new Date,A.unshift(e),A.length>50&&A.pop(),ce.forEach(t=>t(e))}function oe(e){ce.push(e)}function Oe(e){const t=A.findIndex(i=>i.id===e);t!==-1&&A.splice(t,1)}const vt=[10,30,60,120,300];let R=2;const f={running:!0,speedMultiplier:60,simTime:new Date("2024-11-01T06:00:00"),lastTick:Date.now(),listeners:{},_retailIdx:0,_tickCount:0};function De(){Pt()}function Ge(){f.running=!1}function Pe(){f.running=!0,Pt()}function Fe(){R=Math.min(R+1,vt.length-1),f.speedMultiplier=vt[R]}function He(){R=Math.max(R-1,0),f.speedMultiplier=vt[R]}function Xt(){return vt[R]}function $(e,t){f.listeners[e]||(f.listeners[e]=[]),f.listeners[e].push(t)}function D(e,t){f.listeners[e]&&(f.listeners[e]=f.listeners[e].filter(i=>i!==t))}function N(e,t){(f.listeners[e]||[]).forEach(i=>i(t))}function Pt(){if(!f.running)return;const e=Date.now(),t=(e-f.lastTick)/1e3;f.lastTick=e,f.simTime=new Date(f.simTime.getTime()+t*f.speedMultiplier*1e3),je(),f._tickCount++,f._tickCount%15===0&&(Ve(),N("security",null)),f._tickCount%5===0&&Ye(),f._tickCount%30===0&&(qe(),N("baggage",null)),f._tickCount%10===0&&N("overview",null),f._tickCount%(8+Math.floor(Math.random()*27))===0&&We(),N("tick",{simTime:f.simTime,tick:f._tickCount}),setTimeout(Pt,1e3)}const Ue=[{label:"Scheduled",mins:-120,color:"grey"},{label:"Check-In Open",mins:-90,color:"blue"},{label:"Boarding",mins:-40,color:"amber"},{label:"Gate Closing",mins:-10,color:"red"},{label:"Departed",mins:0,color:"green"},{label:"Arrived",mins:90,color:"green"}];function je(){const e=f.simTime;let t=!1;r.flights.forEach(i=>{if(!i.sched_dep)return;const l=new Date(i.sched_dep),a=(e-l)/6e4;let n="Scheduled",s="grey";for(const c of Ue)a>=c.mins&&(n=c.label,s=c.color);i.delay_mins>0&&n!=="Departed"&&n!=="Arrived"&&a>-15&&a<0&&(n="Delayed",s="red"),i._simStatus!==n&&(i._simStatus=n,i._simColor=s,t=!0)}),t&&N("flights",null)}function Ve(){r.security_screening.forEach(e=>{const t=Math.floor((Math.random()-.5)*30);e.queue_length=Math.max(5,Math.min(200,(e.queue_length||50)+t)),e.throughput_per_hr=Math.max(150,Math.min(500,(e.throughput_per_hr||300)+Math.floor((Math.random()-.5)*40)))})}function Ye(){const e=r.retail_transactions;if(!e.length)return;const t=e[f._retailIdx%e.length];f._retailIdx++,N("retail_txn",t)}function qe(){r.baggage.slice(0,50).forEach(t=>{const i=Math.random();i<.7?t.status="Loaded":i<.83?t.status="In Transit":i<.92?t.status="On Belt":i<.97?t.status="Delayed":t.status="Mishandled",t.mishandled=t.status==="Mishandled"})}const Qt=[Ke,Xe,Qe,Ze,Je,ti,ei,ii];function We(){const e=Qt[Math.floor(Math.random()*Qt.length)];e()}function bt(){return r.flights[Math.floor(Math.random()*Math.min(r.flights.length,200))]}function ze(){return r.maintenance_logs[Math.floor(Math.random()*r.maintenance_logs.length)]}function Ke(){const e=bt();e&&L({id:`atc-${Date.now()}`,type:"critical",icon:"🔴",title:`ATC Hold — ${e.flight_id}`,msg:`${e.airline} flight to ${e.destination} held by ATC. +${30+Math.floor(Math.random()*60)}min delay expected.`,flightId:e.flight_id})}function Xe(){const e=bt();e&&L({id:`crew-${Date.now()}`,type:"warning",icon:"🟡",title:`Crew Delay — ${e.flight_id}`,msg:`${e.airline} crew not reported for ${e.flight_id} to ${e.destination}. Gate: ${e.gate}`,flightId:e.flight_id})}function Qe(){var i;const e=Math.floor(Math.random()*8)+1,t=((i=r.security_screening[Math.floor(Math.random()*r.security_screening.length)])==null?void 0:i.pnr_code)||"PP-****0000";L({id:`sec-${Date.now()}`,type:"critical",icon:"🔐",title:`Security Alert — Lane ${e}`,msg:`Passenger ${t} flagged for secondary screening at Lane ${e}. XRAY-${e} requires attention.`,lane:e})}function Ze(){const e=ze();!e||e.resolved||L({id:`maint-${Date.now()}`,type:"warning",icon:"🔧",title:`Maintenance — ${e.tail_number}`,msg:`Work order ${e.work_order}: ${e.defect_type} on ${e.tail_number}. Severity ${e.severity}. Status: ${e._simStatus}`,workOrder:e.work_order})}function Je(){const e=r.passengers.filter(i=>i.is_vip);if(!e.length)return;const t=e[Math.floor(Math.random()*e.length)];L({id:`vip-${Date.now()}`,type:"vip",icon:"⭐",title:`VIP Boarding — ${t.first_name} ${t.last_name}`,msg:`VIP passenger (${t.booking_class}) boarding ${t.flight_id} at Gate ${t.gate}. Arrange escort.`,pnr:t.pnr_code})}function ti(){const e=bt();if(!e)return;const t=["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12"],i=t[Math.floor(Math.random()*t.length)];L({id:`gate-${Date.now()}`,type:"warning",icon:"🚪",title:`Gate Change — ${e.flight_id}`,msg:`${e.airline} ${e.flight_id} to ${e.destination} moved to Gate ${i}. PA announcement required.`,flightId:e.flight_id}),e.gate=i}function ei(){const e=bt();e&&L({id:`divert-${Date.now()}`,type:"critical",icon:"↩️",title:`Diversion Alert — ${e.flight_id}`,msg:`${e.airline} ${e.flight_id} (${e.aircraft_type}) reporting turbulence. Monitoring situation.`,flightId:e.flight_id})}function ii(){const e=["Heavy fog","Thunderstorm","Strong crosswinds","Low visibility","Hail warning"],t=e[Math.floor(Math.random()*e.length)];L({id:`wx-${Date.now()}`,type:"warning",icon:"⛈️",title:"Weather Advisory",msg:`${t} reported in DEL airspace. ${1+Math.floor(Math.random()*5)} flights may be affected. Monitoring.`})}function ai(){const e=document.getElementById("bg-canvas");if(!e)return;const t=e.getContext("2d");let i=e.width=window.innerWidth,l=e.height=window.innerHeight;window.addEventListener("resize",()=>{i=e.width=window.innerWidth,l=e.height=window.innerHeight});const a=Array.from({length:45},()=>({x:Math.random()*i,y:Math.random()*l,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,radius:Math.random()*1.8+.8,color:Math.random()>.3?"rgba(0, 212, 255, ":"rgba(168, 255, 62, ",alpha:Math.random()*.5+.2}));function n(){t.clearRect(0,0,i,l);const s=40;t.strokeStyle="rgba(0, 212, 255, 0.025)",t.lineWidth=1,t.beginPath();for(let c=0;c<i;c+=s)t.moveTo(c,0),t.lineTo(c,l);for(let c=0;c<l;c+=s)t.moveTo(0,c),t.lineTo(i,c);t.stroke();for(let c=0;c<a.length;c++)for(let o=c+1;o<a.length;o++){const v=a[c].x-a[o].x,d=a[c].y-a[o].y,p=Math.sqrt(v*v+d*d);p<140&&(t.strokeStyle=`rgba(0, 212, 255, ${.08*(1-p/140)})`,t.lineWidth=.8,t.beginPath(),t.moveTo(a[c].x,a[c].y),t.lineTo(a[o].x,a[o].y),t.stroke())}a.forEach(c=>{c.x+=c.vx,c.y+=c.vy,c.x<0&&(c.x=i),c.x>i&&(c.x=0),c.y<0&&(c.y=l),c.y>l&&(c.y=0),t.fillStyle=`${c.color}${c.alpha})`,t.beginPath(),t.arc(c.x,c.y,c.radius,0,Math.PI*2),t.fill()}),requestAnimationFrame(n)}n()}function _(e){if(!e)return"--:--";try{return new Date(e).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}catch{return"--:--"}}function X(e){const t=parseInt(e)||0;return t>=1e7?`₹${(t/1e7).toFixed(1)}Cr`:t>=1e5?`₹${(t/1e5).toFixed(1)}L`:t>=1e3?`₹${(t/1e3).toFixed(1)}K`:`₹${t.toLocaleString("en-IN")}`}function pt(e){return(parseInt(e)||0).toLocaleString("en-IN")}function re(e){const t=parseInt(e)||0;return t===0?null:t<60?`+${t}m`:`+${Math.floor(t/60)}h ${t%60}m`}function si(e){return`${parseFloat(e||0).toFixed(1)}%`}function ni(e){return`${parseFloat(e||0).toFixed(1)} kg`}function Q(e){const t=(e||"").toLowerCase();return t.includes("board")||t.includes("check-in")?"amber pulse-amber":t.includes("depart")||t.includes("arriv")||t.includes("clear")||t.includes("ok")||t.includes("loaded")?"green":t.includes("delay")||t.includes("cancel")||t.includes("flag")||t.includes("mishandled")||t.includes("gate clos")?"red pulse-red":t.includes("schedul")||t.includes("open")||t.includes("in transit")?"blue":t.includes("progress")||t.includes("transit")?"cyan":t.includes("resolv")||t.includes("deliver")?"green":t.includes("on belt")?"amber":"grey"}function li(e){return{IndiGo:"#0ea5e9",Vistara:"#a855f7","Air India":"#ef4444","British Airways":"#1d4ed8",Emirates:"#d97706","Qatar Airways":"#7c3aed",Lufthansa:"#fbbf24",KLM:"#0891b2","Air France":"#3b82f6",SpiceJet:"#f97316","Air India Express":"#dc2626","Singapore Airlines":"#fbbf24"}[e]||"#94a3b8"}function E(e,t,i=800,l="",a=""){if(!e)return;const n=parseInt(e.dataset.val||0);e.dataset.val=t;const s=performance.now(),c=t-n;function o(v){const d=Math.min((v-s)/i,1),p=1-Math.pow(1-d,3);e.textContent=l+Math.round(n+c*p).toLocaleString("en-IN")+a,d<1&&requestAnimationFrame(o)}requestAnimationFrame(o)}let m={},Y=null;function di(e){e.innerHTML=`
    <!-- VIEW HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">⚡</div>
        <div>
          <h1>COMMAND OVERVIEW & OPERATIONAL MATRIX</h1>
          <div class="view-hd-sub">DEL TERMINAL 3 · REAL-TIME TELEMETRY STREAM</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE TELEMETRY STREAM
      </div>
    </div>

    <!-- KPI STRIP -->
    <div class="kpi-row" id="ov-kpi-grid">
      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">TOTAL FLIGHTS</div>
        <div class="kpi-value" data-accent="neon" id="ov-kpi-flights">0</div>
        <div class="kpi-sub">Active departures today</div>
        <div class="kpi-glyph">✈</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">ON-TIME PERFORMANCE</div>
        <div class="kpi-value" data-accent="acid" id="ov-kpi-ontime">0%</div>
        <div class="kpi-sub">Flights on schedule</div>
        <div class="kpi-glyph">✅</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">AVG DELAY</div>
        <div class="kpi-value" data-accent="amber" id="ov-kpi-delay">0m</div>
        <div class="kpi-sub">Across delayed flights</div>
        <div class="kpi-glyph">⏱</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-rose)">
        <div class="kpi-label">INCIDENTS & ALERTS</div>
        <div class="kpi-value" data-accent="red" id="ov-kpi-alerts">0</div>
        <div class="kpi-sub">Active operational flags</div>
        <div class="kpi-glyph">🚨</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">PASSENGERS</div>
        <div class="kpi-value" id="ov-kpi-pax">0</div>
        <div class="kpi-sub">Processed in window</div>
        <div class="kpi-glyph">👥</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">BAGS LOADED</div>
        <div class="kpi-value" id="ov-kpi-bags">0</div>
        <div class="kpi-sub">Checked baggage items</div>
        <div class="kpi-glyph">🧳</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">SECURITY THROUGHPUT</div>
        <div class="kpi-value" id="ov-kpi-sec">0/hr</div>
        <div class="kpi-sub">Avg 8 screening lanes</div>
        <div class="kpi-glyph">🔐</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">RETAIL REVENUE</div>
        <div class="kpi-value" data-accent="acid" id="ov-kpi-rev">₹0</div>
        <div class="kpi-sub">Pre-flight purchases</div>
        <div class="kpi-glyph">🛍</div>
      </div>
    </div>

    <!-- MAIN MATRIX LAYOUT -->
    <div class="g21">
      
      <!-- LEFT COLUMN -->
      <div class="gc">
        
        <!-- Flight status chart & Legend -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">
              <div class="dot-live"></div>
              FLIGHT STATUS DISTRIBUTION
            </div>
            <span class="mono text-muted" style="font-size:0.75rem">REAL-TIME</span>
          </div>
          <div class="panel-bd" style="display:grid; grid-template-columns: 180px 1fr; gap: 20px; align-items: center">
            <div style="width:180px; height:180px; position:relative; display:flex; align-items:center; justify-content:center">
              <canvas id="ov-status-chart"></canvas>
              <div style="position:absolute; text-align:center; pointer-events:none">
                <div style="font-family:var(--font-display); font-size:1.6rem; font-weight:800; color:var(--text-main)" id="ov-total-count">0</div>
                <div style="font-size:0.72rem; color:var(--text-muted); font-weight:600">FLIGHTS</div>
              </div>
            </div>
            <div id="ov-status-legend" class="gc" style="gap:10px"></div>
          </div>
        </div>

        <!-- Airline OTP Bar Chart -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">📊 AIRLINE ON-TIME PERFORMANCE (OTP %)</div>
          </div>
          <div class="panel-bd" style="height: 200px">
            <canvas id="ov-airline-chart"></canvas>
          </div>
        </div>

        <!-- Recent Flight Activity Feed -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">
              <div class="dot-live"></div>
              LIVE DEPARTURE MONITOR
            </div>
            <span class="text-muted" style="font-size:0.75rem">CLICK ROW FOR FLIGHT TELEMETRY</span>
          </div>
          <div class="panel-bd nopad">
            <div id="ov-flight-feed" style="max-height:240px; overflow-y:auto; padding:6px"></div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="gc">
        
        <!-- Delay Causes -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">⏱ DELAY CAUSE MATRIX</div>
          </div>
          <div class="panel-bd" style="height:190px; display:flex; align-items:center; justify-content:center">
            <canvas id="ov-delay-chart" style="max-width:180px; max-height:180px"></canvas>
          </div>
        </div>

        <!-- Security Lanes Mini Bar Strip -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">🔐 SECURITY LANE QUEUE SPECTRUM</div>
          </div>
          <div class="panel-bd">
            <div id="ov-sec-lanes" class="lane-grid"></div>
          </div>
        </div>

        <!-- Staff Coverage -->
        <div class="panel">
          <div class="panel-hd">
            <div class="panel-hd-label">👔 STAFF DEPLOYMENT</div>
          </div>
          <div class="panel-bd" id="ov-staff-panel" style="display:flex; flex-direction:column; gap:8px"></div>
        </div>

      </div>

    </div>

    <!-- BOTTOM ROW: BAGGAGE + RETAIL SPECTRUMS -->
    <div class="g2">
      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">🧳 BAGGAGE HANDLING METRICS</div>
        </div>
        <div class="panel-bd" style="height:160px">
          <canvas id="ov-bag-chart"></canvas>
        </div>
      </div>

      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">🛍 RETAIL HOURLY VELOCITY</div>
        </div>
        <div class="panel-bd" style="height:160px">
          <canvas id="ov-retail-chart"></canvas>
        </div>
      </div>
    </div>
  `,oi(),Zt(),Y=()=>Zt(),$("overview",Y),$("flights",Y)}function ci(){Y&&D("overview",Y),Object.values(m).forEach(e=>{var t;return(t=e==null?void 0:e.destroy)==null?void 0:t.call(e)}),m={}}function oi(){const e={plugins:{legend:{display:!1},tooltip:{backgroundColor:"#0f172a",titleColor:"#f8fafc",bodyColor:"#94a3b8",borderColor:"rgba(255,255,255,0.1)",borderWidth:1,padding:10}},animation:{duration:600,easing:"easeInOutQuart"}},t=document.getElementById("ov-status-chart");t&&(m.status=new Chart(t,{type:"doughnut",data:{labels:[],datasets:[{data:[],backgroundColor:[],borderWidth:0,hoverOffset:6}]},options:{...e,cutout:"76%",responsive:!0,maintainAspectRatio:!0}}));const i=document.getElementById("ov-airline-chart");i&&(m.airline=new Chart(i,{type:"bar",data:{labels:[],datasets:[{data:[],backgroundColor:"#38bdf8",borderRadius:4}]},options:{...e,indexAxis:"y",responsive:!0,maintainAspectRatio:!1,scales:{x:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#94a3b8"},max:100},y:{grid:{display:!1},ticks:{color:"#f8fafc"}}}}}));const l=document.getElementById("ov-delay-chart");l&&(m.delay=new Chart(l,{type:"doughnut",data:{labels:["ATC","CREW","TECH","WX","TURNAROUND"],datasets:[{data:[],backgroundColor:["#f43f5e","#fbbf24","#c084fc","#38bdf8","#34d399"],borderWidth:0}]},options:{...e,cutout:"65%",responsive:!0,maintainAspectRatio:!0,plugins:{...e.plugins,legend:{display:!0,position:"right",labels:{color:"#94a3b8",font:{size:10}}}}}}));const a=document.getElementById("ov-bag-chart");a&&(m.bag=new Chart(a,{type:"bar",data:{labels:["Loaded","In Transit","On Belt","Delayed","Mishandled"],datasets:[{data:[],backgroundColor:["#34d399","#38bdf8","#fbbf24","#f97316","#f43f5e"],borderWidth:0,borderRadius:4}]},options:{...e,responsive:!0,maintainAspectRatio:!1,scales:{x:{grid:{display:!1},ticks:{color:"#94a3b8"}},y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#94a3b8"}}}}}));const n=document.getElementById("ov-retail-chart");if(n){const s=Array.from({length:24},(o,v)=>`${String(v).padStart(2,"0")}:00`),c=s.map(()=>Math.floor(Math.random()*2e5+2e4));m.retail=new Chart(n,{type:"line",data:{labels:s,datasets:[{data:c,borderColor:"#34d399",borderWidth:2,fill:!0,backgroundColor:"rgba(52,211,153,0.08)",tension:.4,pointRadius:0}]},options:{...e,responsive:!0,maintainAspectRatio:!1,scales:{x:{grid:{display:!1},ticks:{color:"#94a3b8",maxTicksLimit:8}},y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#94a3b8",callback:o=>"₹"+(o/1e3).toFixed(0)+"K"}}}}})}}function Zt(){const e=r.flights,t=r.passengers,i=r.baggage,l=r.security_screening,a=r.retail_transactions,n=r.staff_shifts,s=e.filter(g=>g.delay_mins>0),c=e.filter(g=>g.delay_mins===0),o=s.length?Math.round(s.reduce((g,u)=>g+parseInt(u.delay_mins||0),0)/s.length):0,v=a.reduce((g,u)=>g+parseInt(u.total_amount||0),0),d=Math.round(l.reduce((g,u)=>g+(parseInt(u.throughput_per_hr)||300),0)/(l.length||1));E(document.getElementById("ov-kpi-flights"),e.length);const p=Math.round(c.length/(e.length||1)*100),y=document.getElementById("ov-kpi-ontime");y&&E(y,p,800,"","%"),E(document.getElementById("ov-kpi-delay"),o,800,"+","m"),E(document.getElementById("ov-kpi-pax"),t.length);const T=i.filter(g=>g.status==="Loaded").length;E(document.getElementById("ov-kpi-bags"),T),E(document.getElementById("ov-kpi-sec"),d,800,"","/hr");const h=document.getElementById("ov-kpi-rev");h&&(h.textContent=X(v),h.dataset.val=v);const b={};e.forEach(g=>{const u=g._simStatus||"Scheduled";b[u]=(b[u]||0)+1});const I={Scheduled:"#94a3b8","Check-In Open":"#38bdf8",Boarding:"#fbbf24","Gate Closing":"#f97316",Departed:"#34d399",Arrived:"#4ade80",Delayed:"#f43f5e",Cancelled:"#c084fc"},_t=Object.keys(b),Ht=Object.values(b),Ut=_t.map(g=>I[g]||"#94a3b8");m.status&&(m.status.data.labels=_t,m.status.data.datasets[0].data=Ht,m.status.data.datasets[0].backgroundColor=Ut,m.status.update("none"));const jt=document.getElementById("ov-total-count");jt&&(jt.textContent=pt(e.length));const Vt=document.getElementById("ov-status-legend");Vt&&(Vt.innerHTML=_t.map((g,u)=>`
      <div style="display:flex; align-items:center; gap:8px">
        <div style="width:8px; height:8px; border-radius:50%; background:${Ut[u]}; flex-shrink:0"></div>
        <span style="font-size:0.8rem; color:var(--text-main); flex:1">${g}</span>
        <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-main); font-weight:700">${Ht[u]}</span>
      </div>
    `).join(""));const G={};e.forEach(g=>{G[g.airline]||(G[g.airline]={total:0,onTime:0}),G[g.airline].total++,g.delay_mins==0&&G[g.airline].onTime++});const It=Object.entries(G).map(([g,u])=>({name:g,pct:Math.round(u.onTime/u.total*100)})).sort((g,u)=>u.pct-g.pct).slice(0,8);m.airline&&(m.airline.data.labels=It.map(g=>g.name),m.airline.data.datasets[0].data=It.map(g=>g.pct),m.airline.data.datasets[0].backgroundColor=It.map(g=>g.pct>=80?"#34d399":g.pct>=60?"#fbbf24":"#f43f5e"),m.airline.update());const Tt={ATC:0,CREW:0,TECH:0,WX:0,TURNAROUND:0};e.forEach(g=>{g.delay_reason&&Tt[g.delay_reason]!==void 0&&Tt[g.delay_reason]++}),m.delay&&(m.delay.data.datasets[0].data=Object.values(Tt),m.delay.update());const At={Loaded:0,"In Transit":0,"On Belt":0,Delayed:0,Mishandled:0};i.forEach(g=>{At[g.status]!==void 0&&At[g.status]++}),m.bag&&(m.bag.data.datasets[0].data=Object.values(At),m.bag.update());const Z={};l.forEach(g=>{const u=parseInt(g.lane);u>=1&&u<=8&&(Z[u]||(Z[u]={queues:[]}),Z[u].queues.push(parseInt(g.queue_length)||50))});const Yt=document.getElementById("ov-sec-lanes");Yt&&(Yt.innerHTML=Array.from({length:8},(g,u)=>{const J=u+1,St=Z[J],zt=St?Math.round(St.queues.reduce((me,ye)=>me+ye,0)/St.queues.length):Math.floor(Math.random()*100),xt=Math.min(100,zt),Kt=xt>70?"var(--accent-rose)":xt>40?"var(--accent-amber)":"var(--accent-emerald)";return`
        <div class="lane-card">
          <div class="lane-num">L${J}</div>
          <div class="lane-qbar-wrap">
            <div class="lane-qbar-fill" style="height:${xt}%; background:${Kt}"></div>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:${Kt}; font-weight:700">${zt}</div>
        </div>
      `}).join(""));const kt={};n.forEach(g=>{kt[g.dept]=(kt[g.dept]||0)+1});const qt=document.getElementById("ov-staff-panel");qt&&(qt.innerHTML=Object.entries(kt).map(([g,u])=>`
      <div style="display:flex; align-items:center; justify-content:space-between">
        <span style="font-size:0.82rem; color:var(--text-main); font-weight:500">${g}</span>
        <span class="chip neon" style="font-size:0.7rem">${u} STAFF</span>
      </div>
    `).join(""));const Wt=document.getElementById("ov-flight-feed");if(Wt){const g=e.slice(0,10);Wt.innerHTML=g.map(u=>{const J=Q(u._simStatus||"Scheduled");return`
        <div style="display:flex; align-items:center; gap:12px; padding:8px 12px; border-bottom:1px solid var(--border-subtle); cursor:pointer" onclick="window._openFlightModal?.('${u.flight_id}')">
          <span class="chip ${J}" style="min-width:100px; justify-content:center">${u._simStatus||"Scheduled"}</span>
          <span class="mono text-accent" style="font-weight:700; min-width:65px">${u.flight_id}</span>
          <span style="font-size:0.82rem; color:var(--text-main); flex:1">${u.airline} → ${u.destination}</span>
          <span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted)">${_(u.sched_dep)}</span>
          ${u.delay_mins>0?`<span class="chip red" style="font-size:0.68rem">+${u.delay_mins}m</span>`:""}
        </div>
      `}).join("")}}function Et(e,t,i){document.getElementById("modal-title").textContent=e,document.getElementById("modal-subtitle").textContent=t||"",document.getElementById("modal-body").innerHTML=i,document.getElementById("modal-backdrop").classList.add("open")}function $t(){document.getElementById("modal-backdrop").classList.remove("open")}function ri(){var e,t;(e=document.getElementById("modal-close"))==null||e.addEventListener("click",$t),(t=document.getElementById("modal-backdrop"))==null||t.addEventListener("click",i=>{i.target===i.currentTarget&&$t()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&$t()})}let P=[],gt="sched_dep",q=1,w=0;const tt=50;let M="",wt="all",Rt="all",Mt="all",ut=null;function vi(e){const t=[...new Set(r.flights.map(i=>i.airline))].sort();e.innerHTML=`
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">✈</div>
        <div>
          <h1>FLIGHT RADAR & FIDS MONITOR</h1>
          <div class="view-hd-sub">DEL DEPARTURES · ${r.flights.length} MONITORED FLIGHTS</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE RADAR FEED
      </div>
    </div>

    <!-- KPI STRIP -->
    <div class="kpi-row mb2">
      <div class="kpi-tile" style="--accent:var(--neon)">
        <div class="kpi-label">TOTAL FLIGHTS</div>
        <div class="kpi-value" data-accent="neon" id="fl-kpi-total">${r.flights.length}</div>
        <div class="kpi-sub">Today's schedule</div>
      </div>
      <div class="kpi-tile" style="--accent:var(--amber)">
        <div class="kpi-label">BOARDING NOW</div>
        <div class="kpi-value" data-accent="amber" id="fl-kpi-boarding">0</div>
        <div class="kpi-sub">Active gate calls</div>
      </div>
      <div class="kpi-tile" style="--accent:var(--red)">
        <div class="kpi-label">DELAYED FLIGHTS</div>
        <div class="kpi-value" data-accent="red" id="fl-kpi-delayed">${r.flights.filter(i=>i.delay_mins>0).length}</div>
        <div class="kpi-sub">+15m delay threshold</div>
      </div>
      <div class="kpi-tile" style="--accent:var(--acid)">
        <div class="kpi-label">DEPARTED</div>
        <div class="kpi-value" data-accent="acid" id="fl-kpi-departed">0</div>
        <div class="kpi-sub">En-route to destination</div>
      </div>
    </div>

    <!-- CONTROL BAR -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input id="fl-search" placeholder="SEARCH FLIGHT, DESTINATION, AIRLINE..." />
      </div>

      <div class="filter-group" id="fl-status-chips">
        <button class="filter-btn active" data-val="all">ALL</button>
        <button class="filter-btn" data-val="Scheduled">SCHEDULED</button>
        <button class="filter-btn" data-val="Check-In Open">CHECK-IN</button>
        <button class="filter-btn" data-val="Boarding">BOARDING</button>
        <button class="filter-btn" data-val="Departed">DEPARTED</button>
        <button class="filter-btn" data-val="Delayed">DELAYED</button>
      </div>

      <div class="filter-group">
        <button class="filter-btn active" id="fl-type-all" data-type="all">ALL TYPES</button>
        <button class="filter-btn" id="fl-type-intl" data-type="intl">INTL</button>
        <button class="filter-btn" id="fl-type-dom"  data-type="dom">DOMESTIC</button>
      </div>

      <select class="filter-select" id="fl-airline-filter">
        <option value="all">ALL AIRLINES</option>
        ${t.map(i=>`<option value="${i}">${i}</option>`).join("")}
      </select>
    </div>

    <!-- TABLE PANEL -->
    <div class="panel">
      <div class="panel-inner-corners"></div>
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl" id="fl-table">
            <thead>
              <tr>
                <th data-col="flight_id">FLIGHT</th>
                <th data-col="airline">AIRLINE</th>
                <th data-col="destination">DESTINATION</th>
                <th data-col="sched_dep">SCHED DEP</th>
                <th data-col="actual_dep">ACTUAL DEP</th>
                <th data-col="_simStatus">STATUS</th>
                <th data-col="gate">GATE</th>
                <th data-col="delay_mins">DELAY</th>
                <th data-col="aircraft_type">AIRCRAFT</th>
                <th data-col="flight_type">TYPE</th>
                <th data-col="load_factor">LOAD</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody id="fl-tbody"></tbody>
          </table>
        </div>

        <div class="tbl-foot">
          <span class="page-info" id="fl-page-info"></span>
          <div class="pagination" id="fl-pagination"></div>
        </div>
      </div>
    </div>
  `,gi(e),B(),S(),ut=()=>{ve(),S()},$("flights",ut)}function pi(){ut&&D("flights",ut)}function gi(e){var t,i,l,a;(t=e.querySelector("#fl-search"))==null||t.addEventListener("input",n=>{M=n.target.value.toLowerCase(),w=0,B(),S()}),(i=e.querySelector("#fl-status-chips"))==null||i.addEventListener("click",n=>{const s=n.target.closest(".filter-btn");s&&(e.querySelectorAll("#fl-status-chips .filter-btn").forEach(c=>c.classList.remove("active")),s.classList.add("active"),wt=s.dataset.val,w=0,B(),S())}),e.querySelectorAll("[data-type]").forEach(n=>{n.addEventListener("click",()=>{e.querySelectorAll("[data-type]").forEach(s=>s.classList.remove("active")),n.classList.add("active"),Rt=n.dataset.type,w=0,B(),S()})}),(l=e.querySelector("#fl-airline-filter"))==null||l.addEventListener("change",n=>{Mt=n.target.value,w=0,B(),S()}),(a=e.querySelector("#fl-table thead"))==null||a.addEventListener("click",n=>{const s=n.target.closest("th[data-col]");if(!s)return;const c=s.dataset.col;gt===c?q*=-1:(gt=c,q=1),e.querySelectorAll("#fl-table thead th").forEach(o=>o.classList.remove("sort-asc","sort-desc")),s.classList.add(q===1?"sort-asc":"sort-desc"),B(),S()})}function B(){let e=r.flights;M&&(e=e.filter(t=>{var i,l,a,n;return((i=t.flight_id)==null?void 0:i.toLowerCase().includes(M))||((l=t.destination)==null?void 0:l.toLowerCase().includes(M))||((a=t.airline)==null?void 0:a.toLowerCase().includes(M))||((n=t.gate)==null?void 0:n.toLowerCase().includes(M))})),wt!=="all"&&(e=e.filter(t=>t._simStatus===wt)),Rt==="intl"&&(e=e.filter(t=>t.is_international)),Rt==="dom"&&(e=e.filter(t=>!t.is_international)),Mt!=="all"&&(e=e.filter(t=>t.airline===Mt)),e=[...e].sort((t,i)=>{let l=t[gt]??"",a=i[gt]??"";return!isNaN(parseFloat(l))&&!isNaN(parseFloat(a))&&(l=parseFloat(l),a=parseFloat(a)),l<a?-q:l>a?q:0}),P=e}function S(){ve();const e=document.getElementById("fl-tbody");if(!e)return;const t=w*tt,i=P.slice(t,t+tt);e.innerHTML=i.map(n=>{const s=re(n.delay_mins),c=Q(n._simStatus||"Scheduled"),o=parseFloat(n.load_factor)||70,v=o>=90?"var(--acid)":o>=70?"var(--amber)":"var(--red)";return`
      <tr data-flight="${n.flight_id}">
        <td class="mono bright neon">${n.flight_id}</td>
        <td>
          <div class="flex items-center gap8">
            <div style="width:6px;height:6px;border-radius:50%;background:${li(n.airline)};flex-shrink:0"></div>
            <span>${n.airline}</span>
          </div>
        </td>
        <td class="mono bright">${n.destination}</td>
        <td class="mono">${_(n.sched_dep)}</td>
        <td class="mono">${_(n.actual_dep||n.sched_dep)}</td>
        <td><span class="chip ${c}">${n._simStatus||"Scheduled"}</span></td>
        <td class="mono bright">${n.gate||"--"}</td>
        <td>${s?`<span class="chip red" style="font-size:0.55rem">${s} ${n.delay_reason||""}</span>`:'<span class="text-acid" style="font-size:0.65rem">ON TIME</span>'}</td>
        <td class="mono dim">${n.aircraft_type||"--"}</td>
        <td><span class="chip ${n.is_international?"neon":"grey"}" style="font-size:0.55rem">${n.flight_type||(n.is_international?"INTL":"DOM")}</span></td>
        <td>
          <div class="flex items-center gap8">
            <div class="pbar-wrap" style="width:40px">
              <div class="pbar-fill" style="width:${o}%; background:${v}"></div>
            </div>
            <span class="mono" style="font-size:0.62rem; color:${v}">${o.toFixed(0)}%</span>
          </div>
        </td>
        <td>
          <button class="btn-ghost" style="padding:2px 6px; font-size:0.58rem" onclick="window._openFlightModal('${n.flight_id}')">
            TELEMETRY →
          </button>
        </td>
      </tr>
    `}).join(""),e.querySelectorAll("tr[data-flight]").forEach(n=>{n.addEventListener("click",s=>{s.target.closest("button")||pe(n.dataset.flight)})});const l=document.getElementById("fl-page-info"),a=document.getElementById("fl-pagination");if(l&&(l.textContent=`DISPLAYING ${t+1}–${Math.min(t+tt,P.length)} OF ${P.length} FLIGHTS`),a){const n=Math.ceil(P.length/tt);a.innerHTML=Array.from({length:Math.min(n,8)},(s,c)=>`
      <button class="pg-btn ${c===w?"active":""}" data-p="${c}">${c+1}</button>
    `).join(""),a.querySelectorAll(".pg-btn").forEach(s=>{s.addEventListener("click",()=>{w=parseInt(s.dataset.p),S()})})}}function ve(){const e=r.flights.filter(i=>i._simStatus==="Boarding").length,t=r.flights.filter(i=>i._simStatus==="Departed").length;E(document.getElementById("fl-kpi-boarding"),e),E(document.getElementById("fl-kpi-departed"),t)}function pe(e){const t=r._idx.flightById[e];if(!t)return;const i=xe(e);$e(e);const l=Le(e);Ce(e);const a=we(e),n=Q(t._simStatus||"Scheduled"),s=re(t.delay_mins),c=i.filter(p=>p.is_vip),o=i.filter(p=>p.booking_class==="Economy").length,v=i.filter(p=>p.booking_class==="Business").length;a.reduce((p,y)=>p+parseInt(y.total_amount||0),0);const d=`
    <!-- Route Arc -->
    <div class="route-display">
      <div>
        <div class="route-iata text-neon">DEL</div>
        <div class="route-city">DELHI T3</div>
      </div>
      <div class="route-line">
        <div class="route-dash"></div>
        <div class="route-plane text-neon">✈</div>
        <div class="route-dash"></div>
      </div>
      <div style="text-align:right">
        <div class="route-iata text-acid">${t.destination}</div>
        <div class="route-city">${t.destination}</div>
      </div>
    </div>

    <!-- Flight Info Matrix -->
    <div class="modal-sect">
      <div class="modal-sect-title">TELEMETRY DATA</div>
      <div class="info-grid">
        <div class="info-item"><div class="l">Status</div><div><span class="chip ${n}">${t._simStatus||"Scheduled"}</span></div></div>
        <div class="info-item"><div class="l">Gate</div><div class="v mono">${t.gate||"--"}</div></div>
        <div class="info-item"><div class="l">Sched Dep</div><div class="v mono">${_(t.sched_dep)}</div></div>
        <div class="info-item"><div class="l">Actual Dep</div><div class="v mono">${_(t.actual_dep||t.sched_dep)}</div></div>
        <div class="info-item"><div class="l">Delay</div><div>${s?`<span class="chip red">${s} — ${t.delay_reason}</span>`:'<span class="chip acid">ON TIME</span>'}</div></div>
        <div class="info-item"><div class="l">Aircraft</div><div class="v mono">${t.aircraft_type} (${t.tail_number})</div></div>
        <div class="info-item"><div class="l">Distance</div><div class="v mono">${pt(t.distance_km)} km</div></div>
        <div class="info-item"><div class="l">Fuel Load</div><div class="v mono">${pt(t.fuel_kg)} kg</div></div>
        <div class="info-item"><div class="l">Load Factor</div><div class="v mono">${si(t.load_factor)}</div></div>
      </div>
    </div>

    <!-- Passengers -->
    <div class="modal-sect">
      <div class="modal-sect-title">PASSENGER METRICS (${i.length} MANIFEST)</div>
      <div class="stat-strip">
        <div class="stat-pill"><span class="sv">${i.length}</span><span class="sl">/ ${t.capacity} CAP</span></div>
        <div class="stat-pill"><span class="sv text-neon">${o}</span><span class="sl">ECONOMY</span></div>
        <div class="stat-pill"><span class="sv text-purple">${v}</span><span class="sl">BUSINESS</span></div>
        <div class="stat-pill"><span class="sv text-amber">${c.length}</span><span class="sl">VIP</span></div>
      </div>
    </div>

    <!-- Gate Events -->
    ${l.length?`
    <div class="modal-sect">
      <div class="modal-sect-title">GATE TIMELINE LOG</div>
      <div class="timeline">
        ${l.slice(0,5).map(p=>`
          <div class="tl-item">
            <div class="tl-line">
              <div class="tl-dot"></div>
              <div class="tl-connector"></div>
            </div>
            <div class="tl-body">
              <div class="tl-t">${p.event_type} — Gate ${p.gate}</div>
              <div class="tl-s">${_(p.event_time)} · Priority: ${p.priority} · Staff ID: ${p.staff_id}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>`:""}
  `;Et(`${t.flight_id} // ${t.airline}`,`ORIGIN: ${t.origin} → DEST: ${t.destination} · TAIL: ${t.tail_number}`,d)}window._openFlightModal=pe;let ht=null;const ui=Array.from({length:50},(e,t)=>`B${t+1}`);function hi(e){e.innerHTML=`
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🚪</div>
        <div>
          <h1>TERMINAL 3 GATE OPERATIONS MATRIX</h1>
          <div class="view-hd-sub">50 ACTIVE GATES · REAL-TIME ASSIGNMENTS</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE GATE TRACKING
      </div>
    </div>

    <!-- STATS -->
    <div class="stat-strip mb16">
      <div class="stat-pill"><span class="sv text-amber" id="g-boarding">0</span><span class="sl">BOARDING NOW</span></div>
      <div class="stat-pill"><span class="sv text-acid" id="g-available">0</span><span class="sl">AVAILABLE</span></div>
      <div class="stat-pill"><span class="sv text-muted" id="g-departed">0</span><span class="sl">DEPARTED</span></div>
      <div class="stat-pill"><span class="sv text-red" id="g-conflict">0</span><span class="sl">GATE CONFLICTS</span></div>
    </div>

    <!-- LEGEND -->
    <div class="flex gap16 mb16" style="font-size:0.62rem">
      <div class="flex items-center gap4"><div style="width:8px;height:8px;border-radius:1px;background:var(--amber)"></div> BOARDING</div>
      <div class="flex items-center gap4"><div style="width:8px;height:8px;border-radius:1px;background:var(--neon)"></div> CHECK-IN</div>
      <div class="flex items-center gap4"><div style="width:8px;height:8px;border-radius:1px;background:var(--acid)"></div> DEPARTED</div>
      <div class="flex items-center gap4"><div style="width:8px;height:8px;border-radius:1px;background:var(--surface);border:1px solid var(--border)"></div> AVAILABLE</div>
      <div class="flex items-center gap4"><div style="width:8px;height:8px;border-radius:1px;background:var(--red)"></div> CONFLICT</div>
    </div>

    <!-- GATE MAP PANEL -->
    <div class="panel mb16">
      <div class="panel-inner-corners"></div>
      <div class="panel-hd">
        <div class="panel-hd-label">📍 T3 GATE GRID MAP</div>
        <span class="mono text-muted" style="font-size:0.55rem">CLICK GATE FOR TELEMETRY</span>
      </div>
      <div class="panel-bd">
        <div class="gate-grid" id="gate-map"></div>
      </div>
    </div>

    <!-- GATE EVENTS + CHART -->
    <div class="g2">
      <div class="panel">
        <div class="panel-inner-corners"></div>
        <div class="panel-hd">
          <div class="panel-hd-label">
            <div class="dot-live"></div>
            GATE EVENT STREAM
          </div>
        </div>
        <div class="panel-bd nopad">
          <div id="gate-event-log" style="max-height:280px; overflow-y:auto; padding:8px; display:flex; flex-direction:column; gap:4px"></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-inner-corners"></div>
        <div class="panel-hd">
          <div class="panel-hd-label">📊 EVENTS BY CATEGORY</div>
        </div>
        <div class="panel-bd" style="height:260px">
          <canvas id="gate-event-chart"></canvas>
        </div>
      </div>
    </div>
  `,Jt(),te(),yi(),ht=()=>{Jt(),te()},$("flights",ht)}function fi(){ht&&D("flights",ht)}function mi(){const e={};return r.flights.forEach(t=>{t.gate&&(e[t.gate]||(e[t.gate]=[]),e[t.gate].push(t))}),e}function Jt(){const e=document.getElementById("gate-map");if(!e)return;const t=mi();let i=0,l=0,a=0,n=0;e.innerHTML=ui.map(d=>{const p=t[d]||[],y=p.filter(I=>I._simStatus!=="Departed"&&I._simStatus!=="Arrived"),T=y[0]||p[0];let h="",b='<div class="gate-airline" style="color:var(--text-3)">VACANT</div>';if(p.length>1&&y.length>1)h="conflict",n++;else if(T){const I=T._simStatus||"Scheduled";I==="Boarding"||I==="Gate Closing"?(h="boarding",i++):I==="Departed"||I==="Arrived"?(h="departed",a++):l++,b=`
        <div class="gate-flt">${T.flight_id}</div>
        <div class="gate-airline">${T.airline}</div>
        <div class="gate-time">${_(T.sched_dep)}</div>
      `}else l++;return`
      <div class="gate-cell ${h}" onclick="window._openGateModal('${d}')">
        <div class="gate-num">${d}</div>
        ${b}
      </div>
    `}).join("");const s=document.getElementById("g-boarding"),c=document.getElementById("g-available"),o=document.getElementById("g-departed"),v=document.getElementById("g-conflict");s&&(s.textContent=i),c&&(c.textContent=l),o&&(o.textContent=a),v&&(v.textContent=n)}function te(){const e=document.getElementById("gate-event-log");if(!e)return;const t=r.gate_events.slice(0,25);e.innerHTML=t.map(i=>`
    <div style="padding:6px 8px; background:var(--surface); border:1px solid var(--border); border-left:2px solid ${i.delayed?"var(--amber)":"var(--neon)"}">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <span style="font-size:0.7rem; font-weight:600; color:var(--text-0)">${i.event_type}</span>
        <span class="mono" style="font-size:0.58rem; color:var(--text-2)">${_(i.event_time)}</span>
      </div>
      <div style="font-size:0.62rem; color:var(--text-2); margin-top:2px">
        Gate ${i.gate} · Flight ${i.flight_id} · Staff: ${i.staff_id}
      </div>
    </div>
  `).join("")}function yi(){const e=document.getElementById("gate-event-chart");if(!e)return;const t={};r.gate_events.forEach(i=>{t[i.event_type]=(t[i.event_type]||0)+1}),new Chart(e,{type:"bar",data:{labels:Object.keys(t),datasets:[{data:Object.values(t),backgroundColor:"rgba(0,212,255,0.4)",borderColor:"#00d4ff",borderWidth:1,borderRadius:2}]},options:{responsive:!0,maintainAspectRatio:!1,indexAxis:"y",plugins:{legend:{display:!1}},scales:{x:{grid:{color:"rgba(0,51,102,0.3)"},ticks:{color:"#6b8fac",font:{family:"JetBrains Mono",size:9}}},y:{grid:{display:!1},ticks:{color:"#c8e4f8",font:{family:"Space Grotesk",size:9}}}}}})}window._openGateModal=function(e){const t=r.flights.filter(a=>a.gate===e),i=Be(e);Ne(e);const l=`
    <div class="modal-sect">
      <div class="modal-sect-title">ASSIGNED FLIGHTS (GATE ${e})</div>
      ${t.length?t.map(a=>`
        <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background:var(--surface); border:1px solid var(--border); margin-bottom:6px">
          <div>
            <div class="mono text-neon" style="font-weight:700">${a.flight_id}</div>
            <div style="font-size:0.68rem; color:var(--text-2)">${a.airline} → ${a.destination}</div>
          </div>
          <span class="chip ${Q(a._simStatus)}">${a._simStatus||"Scheduled"}</span>
          <span class="mono text-acid" style="font-size:0.7rem">${_(a.sched_dep)}</span>
        </div>
      `).join(""):'<div style="color:var(--text-3); font-size:0.7rem">NO ACTIVE FLIGHT ASSIGNMENTS</div>'}
    </div>

    <div class="modal-sect">
      <div class="modal-sect-title">RECENT GATE EVENTS</div>
      <div class="timeline">
        ${i.slice(0,5).map(a=>`
          <div class="tl-item">
            <div class="tl-line"><div class="tl-dot"></div><div class="tl-connector"></div></div>
            <div class="tl-body">
              <div class="tl-t">${a.event_type}</div>
              <div class="tl-s">${_(a.event_time)} · Priority: ${a.priority}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;Et(`GATE TELEMETRY // ${e}`,`TERMINAL 3 · ASSIGNED FLIGHTS: ${t.length}`,l)};let ft=null,W=0,F="",Bt="all";const et=50;function bi(e){var t,i;e.innerHTML=`
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🧳</div>
        <div>
          <h1>BAGGAGE TRACKING MATRIX</h1>
          <div class="view-hd-sub">ALL TERMINALS · ${r.baggage.length} TRACKED BAGS</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE BAGGAGE STREAM
      </div>
    </div>

    <!-- KPI STRIP -->
    <div class="kpi-row mb2">
      <div class="kpi-tile" style="--accent:var(--neon)">
        <div class="kpi-label">TOTAL BAGS</div>
        <div class="kpi-value" data-accent="neon" id="bg-total">${r.baggage.length}</div>
        <div class="kpi-sub">Checked baggage items</div>
      </div>
      <div class="kpi-tile" style="--accent:var(--acid)">
        <div class="kpi-label">LOADED</div>
        <div class="kpi-value" data-accent="acid" id="bg-loaded">0</div>
        <div class="kpi-sub">Aboard aircraft</div>
      </div>
      <div class="kpi-tile" style="--accent:var(--amber)">
        <div class="kpi-label">IN TRANSIT</div>
        <div class="kpi-value" data-accent="amber" id="bg-transit">0</div>
        <div class="kpi-sub">Conveyor system</div>
      </div>
      <div class="kpi-tile" style="--accent:var(--red)">
        <div class="kpi-label">MISHANDLED</div>
        <div class="kpi-value" data-accent="red" id="bg-mish">0</div>
        <div class="kpi-sub">Routing flags</div>
      </div>
    </div>

    <!-- CAROUSELS PANEL -->
    <div class="panel mb16">
      <div class="panel-inner-corners"></div>
      <div class="panel-hd">
        <div class="panel-hd-label">🎡 BAGGAGE CAROUSEL LOAD SPECTRUM (1-10)</div>
      </div>
      <div class="panel-bd">
        <div class="carousel-row" id="carousel-grid"></div>
      </div>
    </div>

    <!-- CONTROLS & TABLE -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="bg-search" placeholder="SEARCH TAG ID, FLIGHT, PNR..." />
      </div>
      <div class="filter-group" id="bg-chips">
        <button class="filter-btn active" data-val="all">ALL</button>
        <button class="filter-btn" data-val="Loaded">LOADED</button>
        <button class="filter-btn" data-val="In Transit">IN TRANSIT</button>
        <button class="filter-btn" data-val="On Belt">ON BELT</button>
        <button class="filter-btn" data-val="Delayed">DELAYED</button>
        <button class="filter-btn" data-val="Mishandled">MISHANDLED</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-inner-corners"></div>
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>TAG ID</th><th>FLIGHT</th><th>PNR</th><th>WEIGHT</th><th>CAROUSEL</th><th>STATUS</th><th>AREA</th><th>SCAN TIME</th><th>MISHANDLED</th>
              </tr>
            </thead>
            <tbody id="bg-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="bg-page-info"></span>
          <div class="pagination" id="bg-pagination"></div>
        </div>
      </div>
    </div>
  `,ee(),ie(),H(),(t=document.getElementById("bg-search"))==null||t.addEventListener("input",l=>{F=l.target.value.toLowerCase(),W=0,H()}),(i=document.getElementById("bg-chips"))==null||i.addEventListener("click",l=>{const a=l.target.closest(".filter-btn");a&&(document.querySelectorAll("#bg-chips .filter-btn").forEach(n=>n.classList.remove("active")),a.classList.add("active"),Bt=a.dataset.val,W=0,H())}),ft=()=>{ee(),ie(),H()},$("baggage",ft)}function Ei(){ft&&D("baggage",ft)}function ee(){const e=document.getElementById("carousel-grid");if(!e)return;const t={};for(let i=1;i<=10;i++)t[i]={bags:0};r.baggage.forEach(i=>{const l=i.carousel;l>=1&&l<=10&&t[l].bags++}),e.innerHTML=Object.entries(t).map(([i,l])=>`
    <div class="carousel-cell">
      <div class="carousel-num">CAROUSEL ${i}</div>
      <div class="carousel-bags">${l.bags}</div>
      <div class="carousel-label">BAGS ON BELT</div>
    </div>
  `).join("")}function ie(){const e=r.baggage;E(document.getElementById("bg-loaded"),e.filter(t=>t.status==="Loaded").length),E(document.getElementById("bg-transit"),e.filter(t=>t.status==="In Transit").length),E(document.getElementById("bg-mish"),e.filter(t=>t.mishandled).length)}function H(){let e=r.baggage;F&&(e=e.filter(s=>{var c,o,v;return((c=s.tag_id)==null?void 0:c.toLowerCase().includes(F))||((o=s.flight_id)==null?void 0:o.toLowerCase().includes(F))||((v=s.pnr_code)==null?void 0:v.toLowerCase().includes(F))})),Bt!=="all"&&(e=e.filter(s=>s.status===Bt));const t=W*et,i=e.slice(t,t+et),l=document.getElementById("bg-tbody");if(!l)return;l.innerHTML=i.map(s=>`
    <tr class="${s.mishandled?"alert-row":""}">
      <td class="mono bright neon">${s.tag_id}</td>
      <td class="mono bright">${s.flight_id}</td>
      <td class="mono dim">${s.pnr_code}</td>
      <td class="mono">${ni(s.weight_kg)}</td>
      <td class="mono bright">${s.carousel}</td>
      <td><span class="chip ${Q(s.status)}">${s.status}</span></td>
      <td class="dim">${s.area||"--"}</td>
      <td class="mono dim">${_(s.scan_time)}</td>
      <td>${s.mishandled?'<span class="chip red">⚠ MISHANDLED</span>':'<span class="chip acid">OK</span>'}</td>
    </tr>
  `).join("");const a=document.getElementById("bg-page-info"),n=document.getElementById("bg-pagination");if(a&&(a.textContent=`DISPLAYING ${t+1}–${Math.min(t+et,e.length)} OF ${e.length} BAGS`),n){const s=Math.ceil(e.length/et);n.innerHTML=Array.from({length:Math.min(s,8)},(c,o)=>`<button class="pg-btn ${o===W?"active":""}" data-p="${o}">${o+1}</button>`).join(""),n.querySelectorAll(".pg-btn").forEach(c=>c.addEventListener("click",()=>{W=parseInt(c.dataset.p),H()}))}}let x=0,U="",Nt="all",Ot="all";const it=50;function _i(e){var v,d,p,y,T;const t=r.passengers,i=t.filter(h=>h.is_vip).length,l=t.filter(h=>h.special_assistance).length,a=t.filter(h=>h.booking_class==="Economy").length,n=t.filter(h=>h.booking_class==="Business").length,s=[...new Set(t.map(h=>h.age_group))].filter(Boolean);e.innerHTML=`
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">👥</div>
        <div>
          <h1>PASSENGER HUB & MANIFEST TRACKER</h1>
          <div class="view-hd-sub">${t.length} PASSENGERS IN CURRENT SYSTEM WINDOW</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE MANIFEST TRACKING
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row">
      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">TOTAL PASSENGERS</div>
        <div class="kpi-value" data-accent="neon">${t.length}</div>
        <div class="kpi-sub">Registered manifest</div>
        <div class="kpi-glyph">👥</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">ECONOMY CLASS</div>
        <div class="kpi-value">${a}</div>
        <div class="kpi-sub">Standard seating</div>
        <div class="kpi-glyph">💺</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">BUSINESS CLASS</div>
        <div class="kpi-value" data-accent="acid">${n}</div>
        <div class="kpi-sub">Premium lounge access</div>
        <div class="kpi-glyph">👔</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">VIP PASSENGERS</div>
        <div class="kpi-value" data-accent="amber">${i}</div>
        <div class="kpi-sub">Priority escort required</div>
        <div class="kpi-glyph">⭐</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">SPECIAL ASSISTANCE</div>
        <div class="kpi-value">${l}</div>
        <div class="kpi-sub">Wheelchair / escort</div>
        <div class="kpi-glyph">♿</div>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="g2">
      <div class="panel">
        <div class="panel-hd"><div class="panel-hd-label">🌍 NATIONALITY DISTRIBUTION</div></div>
        <div class="panel-bd" style="height: 220px; display:flex; align-items:center; justify-content:center">
          <canvas id="pax-nat-chart" style="max-width: 220px; max-height: 220px"></canvas>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd"><div class="panel-hd-label">👶 AGE GROUP SPECTRUM</div></div>
        <div class="panel-bd" style="height: 220px">
          <canvas id="pax-age-chart"></canvas>
        </div>
      </div>
    </div>

    <!-- CONTROLS & TABLE -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="pax-search" placeholder="SEARCH PASSENGER NAME, PNR, FLIGHT..." />
      </div>
      <div class="filter-group" id="pax-class-chips">
        <button class="filter-btn active" data-val="all">ALL CLASSES</button>
        <button class="filter-btn" data-val="Economy">ECONOMY</button>
        <button class="filter-btn" data-val="Business">BUSINESS</button>
      </div>
      <div class="filter-group" id="pax-group-chips">
        ${["all",...s].map(h=>`<button class="filter-btn ${h==="all"?"active":""}" data-val="${h}">${h==="all"?"ALL AGES":h}</button>`).join("")}
      </div>
      <div class="filter-group">
        <button class="filter-btn" id="pax-vip-filter">VIP ONLY ⭐</button>
        <button class="filter-btn" id="pax-special-filter">SPECIAL ASSIST ♿</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>PASSENGER NAME</th><th>PNR</th><th>FLIGHT</th><th>GATE</th><th>CLASS</th><th>AGE GROUP</th><th>NATIONALITY</th><th>SEAT</th><th>STATUS</th><th>WAIT</th><th>BAGS</th>
              </tr>
            </thead>
            <tbody id="pax-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="pax-page-info"></span>
          <div class="pagination" id="pax-pagination"></div>
        </div>
      </div>
    </div>
  `,Ti(),C(),(v=document.getElementById("pax-search"))==null||v.addEventListener("input",h=>{U=h.target.value.toLowerCase(),x=0,C()}),(d=document.getElementById("pax-class-chips"))==null||d.addEventListener("click",h=>{const b=h.target.closest(".filter-btn");b&&(document.querySelectorAll("#pax-class-chips .filter-btn").forEach(I=>I.classList.remove("active")),b.classList.add("active"),Nt=b.dataset.val,x=0,C())}),(p=document.getElementById("pax-group-chips"))==null||p.addEventListener("click",h=>{const b=h.target.closest(".filter-btn");b&&(document.querySelectorAll("#pax-group-chips .filter-btn").forEach(I=>I.classList.remove("active")),b.classList.add("active"),Ot=b.dataset.val,x=0,C())});let c=!1,o=!1;(y=document.getElementById("pax-vip-filter"))==null||y.addEventListener("click",h=>{c=!c,h.currentTarget.classList.toggle("active",c),window._pax_vip=c,x=0,C()}),(T=document.getElementById("pax-special-filter"))==null||T.addEventListener("click",h=>{o=!o,h.currentTarget.classList.toggle("active",o),window._pax_special=o,x=0,C()})}function Ii(){}function Ti(){const e=document.getElementById("pax-nat-chart");if(e){const i={};r.passengers.forEach(a=>{i[a.nationality]=(i[a.nationality]||0)+1});const l=Object.entries(i).sort((a,n)=>n[1]-a[1]);new Chart(e,{type:"doughnut",data:{labels:l.map(a=>a[0]),datasets:[{data:l.map(a=>a[1]),backgroundColor:["#38bdf8","#c084fc","#34d399","#fbbf24","#f43f5e"],borderWidth:0}]},options:{cutout:"65%",responsive:!0,maintainAspectRatio:!0,plugins:{legend:{display:!0,position:"right",labels:{color:"#94a3b8",font:{size:10}}}}}})}const t=document.getElementById("pax-age-chart");if(t){const i={};r.passengers.forEach(l=>{i[l.age_group]=(i[l.age_group]||0)+1}),new Chart(t,{type:"bar",data:{labels:Object.keys(i),datasets:[{data:Object.values(i),backgroundColor:"#38bdf8",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},ticks:{color:"#94a3b8"}},y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#94a3b8"}}}}})}}function C(){let e=r.passengers;U&&(e=e.filter(s=>{var c,o;return`${s.first_name} ${s.last_name}`.toLowerCase().includes(U)||((c=s.pnr_code)==null?void 0:c.toLowerCase().includes(U))||((o=s.flight_id)==null?void 0:o.toLowerCase().includes(U))})),Nt!=="all"&&(e=e.filter(s=>s.booking_class===Nt)),Ot!=="all"&&(e=e.filter(s=>s.age_group===Ot)),window._pax_vip&&(e=e.filter(s=>s.is_vip)),window._pax_special&&(e=e.filter(s=>s.special_assistance));const t=x*it,i=e.slice(t,t+it),l=document.getElementById("pax-tbody");if(!l)return;l.innerHTML=i.map(s=>`
    <tr class="${s.is_vip?"vip-row":""}" onclick="window._openPaxModal('${s.pnr_code}')">
      <td class="bright">${s.first_name} ${s.last_name} ${s.is_vip?"⭐":""}</td>
      <td class="mono dim">${s.pnr_code}</td>
      <td class="mono bright neon">${s.flight_id}</td>
      <td class="mono">${s.gate||"--"}</td>
      <td><span class="chip ${s.booking_class==="Business"?"purple":"grey"}">${s.booking_class}</span></td>
      <td><span class="chip neon">${s.age_group||"--"}</span></td>
      <td class="dim">${s.nationality}</td>
      <td class="mono bright">${s.seat}</td>
      <td>${s.is_vip?'<span class="chip amber">VIP ⭐</span>':s.special_assistance?'<span class="chip neon">ASSIST ♿</span>':'<span class="chip grey">REGULAR</span>'}</td>
      <td class="mono dim">${s.wait_time_hrs?parseFloat(s.wait_time_hrs).toFixed(1)+"h":"--"}</td>
      <td class="mono bright">${s.bag_count||0}</td>
    </tr>
  `).join("");const a=document.getElementById("pax-page-info"),n=document.getElementById("pax-pagination");if(a&&(a.textContent=`Showing ${t+1}–${Math.min(t+it,e.length)} of ${e.length} passengers`),n){const s=Math.ceil(e.length/it);n.innerHTML=Array.from({length:Math.min(s,8)},(c,o)=>`<button class="pg-btn ${o===x?"active":""}" data-p="${o}">${o+1}</button>`).join(""),n.querySelectorAll(".pg-btn").forEach(c=>c.addEventListener("click",()=>{x=parseInt(c.dataset.p),C()}))}}window._openPaxModal=function(e){const t=r._idx.passByPnr[e];if(!t)return;const i=Re(e),l=Me(e),a=`
    <div class="modal-sect">
      <div class="modal-sect-title">PASSENGER PROFILE (${t.pnr_code})</div>
      <div class="info-grid">
        <div class="info-item"><div class="l">Name</div><div class="v">${t.first_name} ${t.last_name} ${t.is_vip?"⭐":""}</div></div>
        <div class="info-item"><div class="l">PNR Code</div><div class="v mono">${t.pnr_code}</div></div>
        <div class="info-item"><div class="l">Age / Gender</div><div class="v">${t.age} / ${t.gender}</div></div>
        <div class="info-item"><div class="l">Nationality</div><div class="v">${t.nationality}</div></div>
        <div class="info-item"><div class="l">Assigned Seat</div><div class="v mono">${t.seat}</div></div>
        <div class="info-item"><div class="l">Booking Class</div><div><span class="chip ${t.booking_class==="Business"?"purple":"grey"}">${t.booking_class}</span></div></div>
        <div class="info-item"><div class="l">Assigned Gate</div><div class="v mono">${t.gate||"--"}</div></div>
        <div class="info-item"><div class="l">Check-In Time</div><div class="v mono">${_(t.checkin_time)}</div></div>
      </div>
    </div>

    ${i?`
    <div class="modal-sect">
      <div class="modal-sect-title">SECURITY SCREENING RESULT</div>
      <div class="info-grid">
        <div class="info-item"><div class="l">Status</div><div><span class="chip ${i.result==="Clear"?"green":i.flagged?"red":"amber"}">${i.result}</span></div></div>
        <div class="info-item"><div class="l">Screening Lane</div><div class="v mono">LANE ${i.lane}</div></div>
        <div class="info-item"><div class="l">Wait Duration</div><div class="v">${i.wait_secs}s</div></div>
      </div>
    </div>`:""}

    <div class="modal-sect">
      <div class="modal-sect-title">CHECKED BAGGAGE (${l.length} BAGS)</div>
      ${l.length?l.map(n=>{var s;return`
        <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--bg-dark); border:1px solid var(--border-subtle); border-radius:6px; margin-bottom:6px">
          <span class="mono text-neon" style="font-weight:700">${n.tag_id}</span>
          <span style="font-size:0.8rem; color:var(--text-muted)">${(s=n.weight_kg)==null?void 0:s.toFixed(1)} kg · Carousel ${n.carousel}</span>
          <span class="chip ${n.mishandled?"red":"green"}">${n.status}</span>
        </div>
      `}).join(""):'<div style="font-size:0.8rem; color:var(--text-muted)">No checked baggage</div>'}
    </div>
  `;Et(`${t.first_name} ${t.last_name}`,`PNR: ${t.pnr_code} · FLIGHT: ${t.flight_id}`,a)};let mt=null,ct=null,z=0;const at=40;function Ai(e){var t,i;e.innerHTML=`
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🔐</div>
        <div>
          <h1>SECURITY & CHECKPOINT OPERATIONS</h1>
          <div class="view-hd-sub">TERMINAL 3 · 8 SCREENING LANES ACTIVE</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE CHECKPOINT METRICS
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row">
      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">CLEARED PASSENGERS</div>
        <div class="kpi-value" data-accent="acid" id="sec-clear">0</div>
        <div class="kpi-sub">Standard screening pass</div>
        <div class="kpi-glyph">✅</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-rose)">
        <div class="kpi-label">FLAGGED FOR CHECK</div>
        <div class="kpi-value" data-accent="red" id="sec-flagged">0</div>
        <div class="kpi-sub">Flagged items/x-ray</div>
        <div class="kpi-glyph">🚨</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">SECONDARY SEARCH</div>
        <div class="kpi-value" data-accent="amber" id="sec-secondary">0</div>
        <div class="kpi-sub">Secondary lane check</div>
        <div class="kpi-glyph">🔍</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">AVG THROUGHPUT</div>
        <div class="kpi-value" data-accent="neon" id="sec-thruput">0/hr</div>
        <div class="kpi-sub">Across active lanes</div>
        <div class="kpi-glyph">⚡</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">AVG WAIT TIME</div>
        <div class="kpi-value" id="sec-wait">0s</div>
        <div class="kpi-sub">Screening wait duration</div>
        <div class="kpi-glyph">⏱</div>
      </div>
    </div>

    <!-- LANE GRID -->
    <div class="panel">
      <div class="panel-hd">
        <div class="panel-hd-label">🔐 SCREENING LANES QUEUE STATUS</div>
        <span class="live-tag"><span class="live-dot"></span> LIVE UPDATES</span>
      </div>
      <div class="panel-bd">
        <div class="lane-grid" id="sec-lane-grid"></div>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="g2">
      <div class="panel">
        <div class="panel-hd"><div class="panel-hd-label">📊 QUEUE LENGTH BY LANE</div></div>
        <div class="panel-bd" style="height: 220px"><canvas id="sec-queue-chart"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-hd"><div class="panel-hd-label">📈 SCREENING OUTCOME BREAKDOWN</div></div>
        <div class="panel-bd" style="height: 220px; display:flex; align-items:center; justify-content:center">
          <canvas id="sec-result-chart" style="max-width: 200px; max-height: 200px"></canvas>
        </div>
      </div>
    </div>

    <!-- TABLE & CONTROLS -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="sec-search" placeholder="SEARCH PNR, SCREENING ID..." />
      </div>
      <div class="filter-group" id="sec-chips">
        <button class="filter-btn active" data-val="all">ALL</button>
        <button class="filter-btn" data-val="Clear">CLEARED</button>
        <button class="filter-btn" data-val="Secondary Check">SECONDARY</button>
        <button class="filter-btn" data-val="Flagged">FLAGGED</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>SCREENING ID</th><th>PNR</th><th>LANE</th><th>ENTRY TIME</th><th>RESULT</th><th>FLAGGED</th><th>WAIT (SEC)</th><th>SECONDARY</th>
              </tr>
            </thead>
            <tbody id="sec-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="sec-page-info"></span>
          <div class="pagination" id="sec-pagination"></div>
        </div>
      </div>
    </div>
  `,ae(),se(),Si(),ot(),(t=document.getElementById("sec-search"))==null||t.addEventListener("input",l=>{window._sec_search=l.target.value.toLowerCase(),z=0,ot()}),(i=document.getElementById("sec-chips"))==null||i.addEventListener("click",l=>{const a=l.target.closest(".filter-btn");a&&(document.querySelectorAll("#sec-chips .filter-btn").forEach(n=>n.classList.remove("active")),a.classList.add("active"),window._sec_filter=a.dataset.val,z=0,ot())}),mt=()=>{ae(),se(),xi()},$("security",mt)}function ki(){mt&&D("security",mt)}function Ft(){const e={};for(let t=1;t<=8;t++)e[t]={queues:[],waits:[],throughputs:[],flagged:0};return r.security_screening.forEach(t=>{const i=parseInt(t.lane);i>=1&&i<=8&&(e[i].queues.push(parseInt(t.queue_length)||50),e[i].waits.push(parseInt(t.wait_secs)||60),e[i].throughputs.push(parseInt(t.throughput_per_hr)||300),t.flagged&&e[i].flagged++)}),e}function K(e){return e.length?Math.round(e.reduce((t,i)=>t+i,0)/e.length):0}function ae(){const e=document.getElementById("sec-lane-grid");if(!e)return;const t=Ft();e.innerHTML=Object.entries(t).map(([i,l])=>{const a=K(l.queues),n=K(l.waits),s=K(l.throughputs),c=Math.min(100,a),o=c>70?"var(--accent-rose)":c>40?"var(--accent-amber)":"var(--accent-emerald)";return`
      <div class="lane-card">
        <div class="lane-num">LANE ${i}</div>
        <div class="lane-qbar-wrap">
          <div class="lane-qbar-fill" style="height:${c}%; background:${o}"></div>
        </div>
        <div style="font-weight:700; font-size:0.9rem; color:${o}">${a} pax</div>
        <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px">${s}/hr · ${n}s wait</div>
      </div>
    `}).join("")}function se(){const e=r.security_screening;E(document.getElementById("sec-clear"),e.filter(n=>n.result==="Clear").length),E(document.getElementById("sec-flagged"),e.filter(n=>n.flagged).length),E(document.getElementById("sec-secondary"),e.filter(n=>n.secondary_check).length);const t=Math.round(e.reduce((n,s)=>n+(parseInt(s.throughput_per_hr)||300),0)/e.length),i=document.getElementById("sec-thruput");i&&(i.textContent=t+"/hr");const l=Math.round(e.reduce((n,s)=>n+(parseInt(s.wait_secs)||60),0)/e.length),a=document.getElementById("sec-wait");a&&(a.textContent=l+"s")}function Si(){const e=Ft(),t=document.getElementById("sec-queue-chart");t&&(ct=new Chart(t,{type:"bar",data:{labels:Array.from({length:8},(l,a)=>`Lane ${a+1}`),datasets:[{data:Object.values(e).map(l=>K(l.queues)),backgroundColor:"#38bdf8",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},ticks:{color:"#94a3b8"}},y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#94a3b8"},max:150}}}}));const i=document.getElementById("sec-result-chart");if(i){const l=r.security_screening,a=l.filter(c=>c.result==="Clear").length,n=l.filter(c=>c.result==="Secondary Check").length,s=l.filter(c=>c.flagged).length;new Chart(i,{type:"doughnut",data:{labels:["Clear","Secondary","Flagged"],datasets:[{data:[a,n,s],backgroundColor:["#34d399","#fbbf24","#f43f5e"],borderWidth:0}]},options:{cutout:"65%",responsive:!0,maintainAspectRatio:!0,plugins:{legend:{display:!0,position:"right",labels:{color:"#94a3b8",font:{size:10}}}}}})}}function xi(){if(!ct)return;const e=Ft();ct.data.datasets[0].data=Object.values(e).map(t=>K(t.queues)),ct.update()}function ot(){let e=r.security_screening;const t=window._sec_search||"",i=window._sec_filter||"all";t&&(e=e.filter(o=>{var v,d;return((v=o.screening_id)==null?void 0:v.toLowerCase().includes(t))||((d=o.pnr_code)==null?void 0:d.toLowerCase().includes(t))})),i!=="all"&&(e=e.filter(o=>o.result===i));const l=z*at,a=e.slice(l,l+at),n=document.getElementById("sec-tbody");if(!n)return;n.innerHTML=a.map(o=>`
    <tr class="${o.flagged?"alert-row":""}">
      <td class="mono bright neon">${o.screening_id}</td>
      <td class="mono dim">${o.pnr_code}</td>
      <td class="mono bright">LANE ${o.lane}</td>
      <td class="mono dim">${_(o.entry_time)}</td>
      <td><span class="chip ${o.result==="Clear"?"green":o.flagged?"red":"amber"}">${o.result}</span></td>
      <td>${o.flagged?'<span class="chip red">⚠ FLAGGED</span>':'<span class="chip green">OK</span>'}</td>
      <td class="mono">${o.wait_secs}s</td>
      <td>${o.secondary_check?'<span class="chip amber">YES</span>':'<span class="chip grey">NO</span>'}</td>
    </tr>
  `).join("");const s=document.getElementById("sec-page-info"),c=document.getElementById("sec-pagination");if(s&&(s.textContent=`Showing ${l+1}–${Math.min(l+at,e.length)} of ${e.length} records`),c){const o=Math.ceil(e.length/at);c.innerHTML=Array.from({length:Math.min(o,8)},(v,d)=>`<button class="pg-btn ${d===z?"active":""}" data-p="${d}">${d+1}</button>`).join(""),c.querySelectorAll(".pg-btn").forEach(v=>v.addEventListener("click",()=>{z=parseInt(v.dataset.p),ot()}))}}function $i(e){var s,c;const t=r.maintenance_logs,i=t.filter(o=>o._simStatus==="Open"),l=t.filter(o=>o._simStatus==="In Progress"),a=t.filter(o=>o._simStatus==="Resolved"),n=[...new Set(t.map(o=>o.tail_number))].sort();e.innerHTML=`
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🔧</div>
        <div>
          <h1>AIRCRAFT MAINTENANCE CONTROL</h1>
          <div class="view-hd-sub">${t.length} WORK ORDERS · ${n.length} FLEET TAILS MONITORED</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE WORK ORDER STREAM
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row">
      <div class="kpi-tile" style="--accent: var(--accent-rose)">
        <div class="kpi-label">OPEN ORDERS</div>
        <div class="kpi-value" data-accent="red">${i.length}</div>
        <div class="kpi-sub">Pending technician action</div>
        <div class="kpi-glyph">🔴</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">IN PROGRESS</div>
        <div class="kpi-value" data-accent="amber">${l.length}</div>
        <div class="kpi-sub">Active hangar work</div>
        <div class="kpi-glyph">🔧</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">RESOLVED TODAY</div>
        <div class="kpi-value" data-accent="acid">${a.length}</div>
        <div class="kpi-sub">Cleared & released</div>
        <div class="kpi-glyph">✅</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">FLEET AIRCRAFT</div>
        <div class="kpi-value" data-accent="neon">${n.length}</div>
        <div class="kpi-sub">Registered tail numbers</div>
        <div class="kpi-glyph">✈</div>
      </div>
    </div>

    <!-- KANBAN BOARD -->
    <div class="panel">
      <div class="panel-hd"><div class="panel-hd-label">📋 WORK ORDER KANBAN BOARD</div></div>
      <div class="panel-bd">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px">
          
          <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); border-radius: 8px; overflow: hidden">
            <div style="padding: 12px 16px; background: rgba(244, 63, 94, 0.1); border-bottom: 1px solid var(--border-subtle); font-weight: 700; color: var(--accent-rose); display: flex; justify-content: space-between">
              <span>🔴 OPEN ORDERS</span>
              <span>${i.length}</span>
            </div>
            <div style="padding: 12px; display: flex; flex-direction: column; gap: 10px; max-height: 340px; overflow-y: auto">
              ${Lt(i.slice(0,8))}
            </div>
          </div>

          <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); border-radius: 8px; overflow: hidden">
            <div style="padding: 12px 16px; background: rgba(251, 191, 36, 0.1); border-bottom: 1px solid var(--border-subtle); font-weight: 700; color: var(--accent-amber); display: flex; justify-content: space-between">
              <span>🟡 IN PROGRESS</span>
              <span>${l.length}</span>
            </div>
            <div style="padding: 12px; display: flex; flex-direction: column; gap: 10px; max-height: 340px; overflow-y: auto">
              ${Lt(l.slice(0,8))}
            </div>
          </div>

          <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); border-radius: 8px; overflow: hidden">
            <div style="padding: 12px 16px; background: rgba(52, 211, 153, 0.1); border-bottom: 1px solid var(--border-subtle); font-weight: 700; color: var(--accent-emerald); display: flex; justify-content: space-between">
              <span>✅ RESOLVED</span>
              <span>${a.length}</span>
            </div>
            <div style="padding: 12px; display: flex; flex-direction: column; gap: 10px; max-height: 340px; overflow-y: auto">
              ${Lt(a.slice(0,8))}
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- CONTROLS & TABLE -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="maint-search" placeholder="SEARCH WORK ORDER, TAIL, DEFECT..." />
      </div>
      <select class="filter-select" id="maint-tail-filter">
        <option value="all">ALL AIRCRAFT TAILS</option>
        ${n.map(o=>`<option>${o}</option>`).join("")}
      </select>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>WORK ORDER</th><th>TAIL</th><th>FLIGHT</th><th>TYPE</th><th>DEFECT TYPE</th><th>SEVERITY</th><th>STATUS</th><th>DURATION</th><th>TECH ID</th>
              </tr>
            </thead>
            <tbody id="maint-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `,ge(t),(s=document.getElementById("maint-search"))==null||s.addEventListener("input",o=>{const v=o.target.value.toLowerCase(),d=document.getElementById("maint-tail-filter").value;ne(v,d)}),(c=document.getElementById("maint-tail-filter"))==null||c.addEventListener("change",o=>{const v=document.getElementById("maint-search").value.toLowerCase();ne(v,o.target.value)}),e.addEventListener("click",o=>{const v=o.target.closest("[data-wo]");v&&Ci(v.dataset.wo)})}function Li(){}function Lt(e){return e.map(t=>`
    <div data-wo="${t.work_order}" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 12px; border-radius: 8px; cursor: pointer; transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px">
        <span class="mono bright neon" style="font-weight:700">${t.work_order}</span>
        <span class="chip ${t.severity==1?"red":t.severity==2?"amber":"neon"}" style="font-size:0.65rem">SEV-${t.severity}</span>
      </div>
      <div style="font-weight:600; color:var(--text-main); font-size:0.85rem">${t.defect_type}</div>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px">Tail: ${t.tail_number} · Tech: ${t.tech_id}</div>
    </div>
  `).join("")}function ne(e,t){let i=r.maintenance_logs;e&&(i=i.filter(l=>{var a,n,s;return((a=l.work_order)==null?void 0:a.toLowerCase().includes(e))||((n=l.defect_type)==null?void 0:n.toLowerCase().includes(e))||((s=l.tail_number)==null?void 0:s.toLowerCase().includes(e))})),t&&t!=="all"&&(i=i.filter(l=>l.tail_number===t)),ge(i)}function ge(e){const t=document.getElementById("maint-tbody");t&&(t.innerHTML=e.slice(0,60).map(i=>`
    <tr data-wo="${i.work_order}">
      <td class="mono bright neon">${i.work_order}</td>
      <td class="mono bright">${i.tail_number}</td>
      <td class="mono dim">${i.flight_id}</td>
      <td class="dim">${i.work_type}</td>
      <td class="bright">${i.defect_type}</td>
      <td><span class="chip ${i.severity==1?"red":i.severity==2?"amber":"neon"}">SEV-${i.severity}</span></td>
      <td><span class="chip ${i._simStatus==="Resolved"?"green":i._simStatus==="In Progress"?"amber":"red"}">${i._simStatus}</span></td>
      <td class="mono dim">${i.duration_hrs}h</td>
      <td class="mono dim">${i.tech_id}</td>
    </tr>
  `).join(""))}function Ci(e){const t=r.maintenance_logs.find(l=>l.work_order===e);if(!t)return;const i=`
    <div class="modal-sect">
      <div class="modal-sect-title">WORK ORDER DETAILS</div>
      <div class="info-grid">
        <div class="info-item"><div class="l">Work Order</div><div class="v mono">${t.work_order}</div></div>
        <div class="info-item"><div class="l">Tail Number</div><div class="v mono">${t.tail_number}</div></div>
        <div class="info-item"><div class="l">Flight ID</div><div class="v mono">${t.flight_id}</div></div>
        <div class="info-item"><div class="l">Work Type</div><div class="v">${t.work_type}</div></div>
        <div class="info-item"><div class="l">Defect Type</div><div class="v">${t.defect_type}</div></div>
        <div class="info-item"><div class="l">Fix Type</div><div class="v">${t.fix_type}</div></div>
        <div class="info-item"><div class="l">Severity</div><div><span class="chip ${t.severity==1?"red":t.severity==2?"amber":"neon"}">SEV-${t.severity}</span></div></div>
        <div class="info-item"><div class="l">Status</div><div><span class="chip ${t._simStatus==="Resolved"?"green":t._simStatus==="In Progress"?"amber":"red"}">${t._simStatus}</span></div></div>
        <div class="info-item"><div class="l">Duration</div><div class="v">${t.duration_hrs}h</div></div>
        <div class="info-item"><div class="l">Technician ID</div><div class="v mono">${t.tech_id}</div></div>
      </div>
    </div>
  `;Et(`WORK ORDER: ${t.work_order}`,`AIRCRAFT: ${t.tail_number} · SEVERITY: ${t.severity}`,i)}let O=0,j="",Dt="all";const st=50;function wi(e){var s,c,o;const t=r.staff_shifts,i=[...new Set(t.map(v=>v.dept))].sort(),l=t.filter(v=>v.overtime).length,a={};t.forEach(v=>{a[v.dept]=(a[v.dept]||0)+1}),e.innerHTML=`
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">👔</div>
        <div>
          <h1>STAFF ROSTER & DEPLOYMENT MATRIX</h1>
          <div class="view-hd-sub">${t.length} ACTIVE PERSONNEL ON SHIFT ACROSS ${i.length} DEPARTMENTS</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE ROSTER FEED
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row">
      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">TOTAL PERSONNEL</div>
        <div class="kpi-value" data-accent="neon">${t.length}</div>
        <div class="kpi-sub">On active shift</div>
        <div class="kpi-glyph">👔</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">DEPARTMENTS</div>
        <div class="kpi-value">${i.length}</div>
        <div class="kpi-sub">Airport operational units</div>
        <div class="kpi-glyph">🏢</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">OVERTIME SHIFTS</div>
        <div class="kpi-value" data-accent="amber">${l}</div>
        <div class="kpi-sub">Extra shift allocation</div>
        <div class="kpi-glyph">⏰</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">SHIFT DURATION</div>
        <div class="kpi-value" data-accent="acid">8h</div>
        <div class="kpi-sub">Standard shift length</div>
        <div class="kpi-glyph">🕐</div>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="g2">
      <div class="panel">
        <div class="panel-hd"><div class="panel-hd-label">👥 DEPLOYMENT BY DEPARTMENT</div></div>
        <div class="panel-bd" style="height: 200px">
          <canvas id="staff-dept-chart"></canvas>
        </div>
      </div>

      <div class="panel">
        <div class="panel-hd"><div class="panel-hd-label">📊 DEPARTMENT COVERAGE LIST</div></div>
        <div class="panel-bd" id="staff-dept-summary" style="display:flex; flex-direction:column; gap:10px"></div>
      </div>
    </div>

    <!-- CONTROLS & TABLE -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="staff-search" placeholder="SEARCH STAFF NAME, ID, GATE..." />
      </div>
      <div class="filter-group" id="staff-dept-chips">
        <button class="filter-btn active" data-val="all">ALL DEPTS</button>
        ${i.map(v=>`<button class="filter-btn" data-val="${v}">${v.toUpperCase()}</button>`).join("")}
      </div>
      <div class="filter-group">
        <button class="filter-btn" id="staff-ot-filter">OVERTIME ONLY ⏰</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>STAFF ID</th><th>STAFF NAME</th><th>DEPARTMENT</th><th>ROLE</th><th>GATE ASSIGNMENT</th><th>SHIFT DATE</th><th>HOURS</th><th>OVERTIME</th><th>LANGUAGE</th>
              </tr>
            </thead>
            <tbody id="staff-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="staff-page-info"></span>
          <div class="pagination" id="staff-pagination"></div>
        </div>
      </div>
    </div>
  `,Mi(),V(),(s=document.getElementById("staff-search"))==null||s.addEventListener("input",v=>{j=v.target.value.toLowerCase(),O=0,V()}),(c=document.getElementById("staff-dept-chips"))==null||c.addEventListener("click",v=>{const d=v.target.closest(".filter-btn");d&&(document.querySelectorAll("#staff-dept-chips .filter-btn").forEach(p=>p.classList.remove("active")),d.classList.add("active"),Dt=d.dataset.val,O=0,V())});let n=!1;(o=document.getElementById("staff-ot-filter"))==null||o.addEventListener("click",v=>{n=!n,v.currentTarget.classList.toggle("active",n),window._staff_ot=n,O=0,V()})}function Ri(){}function Mi(){const e=r.staff_shifts,t={};e.forEach(a=>{t[a.dept]=(t[a.dept]||0)+1});const i=document.getElementById("staff-dept-chart");i&&new Chart(i,{type:"bar",data:{labels:Object.keys(t),datasets:[{data:Object.values(t),backgroundColor:"#38bdf8",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},ticks:{color:"#94a3b8"}},y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#94a3b8"}}}}});const l=document.getElementById("staff-dept-summary");l&&(l.innerHTML=Object.entries(t).sort((a,n)=>n[1]-a[1]).map(([a,n])=>`
      <div style="display:flex; align-items:center; justify-content:space-between">
        <span style="font-size:0.85rem; color:var(--text-main); font-weight:500">${a}</span>
        <span class="chip neon">${n} PERSONNEL</span>
      </div>
    `).join(""))}function V(){let e=r.staff_shifts;j&&(e=e.filter(s=>{var c,o,v;return((c=s.name)==null?void 0:c.toLowerCase().includes(j))||((o=s.staff_id)==null?void 0:o.toLowerCase().includes(j))||((v=s.gate)==null?void 0:v.toLowerCase().includes(j))})),Dt!=="all"&&(e=e.filter(s=>s.dept===Dt)),window._staff_ot&&(e=e.filter(s=>s.overtime));const t=O*st,i=e.slice(t,t+st),l=document.getElementById("staff-tbody");if(!l)return;l.innerHTML=i.map(s=>`
    <tr>
      <td class="mono dim">${s.staff_id}</td>
      <td class="bright text-accent">${s.name}</td>
      <td><span class="chip neon">${s.dept}</span></td>
      <td class="dim">${s.role}</td>
      <td class="mono bright">${s.gate||"--"}</td>
      <td class="mono dim">${s.shift_date||"--"}</td>
      <td class="mono">${s.hours}h</td>
      <td>${s.overtime?'<span class="chip amber">⏰ OVERTIME</span>':'<span class="chip grey">REGULAR</span>'}</td>
      <td class="dim">${s.language||"--"}</td>
    </tr>
  `).join("");const a=document.getElementById("staff-page-info"),n=document.getElementById("staff-pagination");if(a&&(a.textContent=`Showing ${t+1}–${Math.min(t+st,e.length)} of ${e.length} personnel`),n){const s=Math.ceil(e.length/st);n.innerHTML=Array.from({length:Math.min(s,8)},(c,o)=>`<button class="pg-btn ${o===O?"active":""}" data-p="${o}">${o+1}</button>`).join(""),n.querySelectorAll(".pg-btn").forEach(c=>c.addEventListener("click",()=>{O=parseInt(c.dataset.p),V()}))}}let yt=null,rt=0;const nt=40;function Bi(e){var o,v;const t=r.retail_transactions,i=t.reduce((d,p)=>d+parseInt(p.total_amount||0),0),l=Math.round(i/(t.length||1)),a={};t.forEach(d=>{a[d.item]=(a[d.item]||0)+1});const n=Object.entries(a).sort((d,p)=>p[1]-d[1]).slice(0,5),s=Array(24).fill(0);t.forEach(d=>{try{const p=new Date(d.txn_time).getHours();s[p]+=parseInt(d.total_amount||0)}catch{}}),e.innerHTML=`
    <!-- HEADER -->
    <div class="view-hd">
      <div class="view-hd-left">
        <div class="view-hd-icon">🛍</div>
        <div>
          <h1>RETAIL REVENUE & COMMERCE</h1>
          <div class="view-hd-sub">${t.length} TRANSACTIONS · ${X(i)} TOTAL REVENUE</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        LIVE COMMERCE STREAM
      </div>
    </div>

    <!-- KPI STRIP -->
    <div class="kpi-row">
      <div class="kpi-tile" style="--accent: var(--accent-emerald)">
        <div class="kpi-label">TOTAL REVENUE</div>
        <div class="kpi-value" data-accent="acid" id="ret-total">${X(i)}</div>
        <div class="kpi-sub">Today's airside sales</div>
        <div class="kpi-glyph">💰</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-blue)">
        <div class="kpi-label">TRANSACTIONS</div>
        <div class="kpi-value" data-accent="neon" id="ret-count">${t.length}</div>
        <div class="kpi-sub">Total receipts</div>
        <div class="kpi-glyph">🧾</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-amber)">
        <div class="kpi-label">AVG TRANSACTION</div>
        <div class="kpi-value" data-accent="amber">₹${pt(l)}</div>
        <div class="kpi-sub">Basket size average</div>
        <div class="kpi-glyph">📊</div>
      </div>

      <div class="kpi-tile" style="--accent: var(--accent-purple)">
        <div class="kpi-label">TOP CATEGORY</div>
        <div class="kpi-value" style="font-size: 1.4rem; color: var(--accent-purple)">${((o=n[0])==null?void 0:o[0])||"Duty Free"}</div>
        <div class="kpi-sub">Highest volume item</div>
        <div class="kpi-glyph">🏆</div>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="g21">
      <!-- LEFT: Live feed -->
      <div class="panel">
        <div class="panel-hd">
          <div class="panel-hd-label">💳 LIVE TRANSACTION FEED</div>
          <span class="live-tag"><span class="live-dot"></span> REAL-TIME</span>
        </div>
        <div class="panel-bd nopad">
          <div id="ret-feed" style="padding: 12px; max-height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px"></div>
        </div>
      </div>

      <!-- RIGHT: Charts -->
      <div class="gc">
        <div class="panel">
          <div class="panel-hd"><div class="panel-hd-label">🏆 TOP ITEMS BY VOLUME</div></div>
          <div class="panel-bd" style="height: 170px"><canvas id="ret-items-chart"></canvas></div>
        </div>
        <div class="panel">
          <div class="panel-hd"><div class="panel-hd-label">💳 PAYMENT METHOD SPLIT</div></div>
          <div class="panel-bd" style="height: 150px; display:flex; align-items:center; justify-content:center">
            <canvas id="ret-payment-chart" style="max-width: 150px; max-height: 150px"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- HOURLY CHART -->
    <div class="panel">
      <div class="panel-hd"><div class="panel-hd-label">📈 HOURLY REVENUE VELOCITY</div></div>
      <div class="panel-bd" style="height: 180px"><canvas id="ret-hourly-chart"></canvas></div>
    </div>

    <!-- CONTROLS & TABLE -->
    <div class="ctrl-bar">
      <div class="search-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="ret-search" placeholder="SEARCH ITEM, PNR, SHOP NAME..." />
      </div>
    </div>

    <div class="panel">
      <div class="panel-bd nopad">
        <div class="tbl-wrap">
          <table class="tbl">
            <thead>
              <tr>
                <th>TXN ID</th><th>SHOP NAME</th><th>ITEM</th><th>PNR</th><th>FLIGHT</th><th>AMOUNT</th><th>QTY</th><th>PAYMENT</th><th>TIME</th><th>AIRSIDE</th>
              </tr>
            </thead>
            <tbody id="ret-tbody"></tbody>
          </table>
        </div>
        <div class="tbl-foot">
          <span class="page-info" id="ret-page-info"></span>
          <div class="pagination" id="ret-pagination"></div>
        </div>
      </div>
    </div>
  `,Oi(n,s),Gt(),r.retail_transactions.slice(0,6).forEach(d=>le(d)),(v=document.getElementById("ret-search"))==null||v.addEventListener("input",d=>{window._ret_search=d.target.value.toLowerCase(),rt=0,Gt()}),yt=d=>{le(d);const p=document.getElementById("ret-count");if(p){const y=parseInt(p.dataset.val||r.retail_transactions.length);E(p,y+1)}},$("retail_txn",yt)}function Ni(){yt&&D("retail_txn",yt)}function le(e){const t=document.getElementById("ret-feed");if(!t)return;const i=document.createElement("div");for(i.style.cssText="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:var(--bg-dark); border:1px solid var(--border-subtle); border-radius:8px;",i.innerHTML=`
    <div style="display:flex; align-items:center; gap:12px">
      <div style="font-family:var(--font-display); font-size:1rem; font-weight:800; color:var(--accent-emerald)">${X(e.total_amount)}</div>
      <div>
        <div style="font-weight:600; color:var(--text-main); font-size:0.85rem">${e.item}</div>
        <div style="font-size:0.75rem; color:var(--text-muted)">${e.shop_name}</div>
      </div>
    </div>
    <div style="text-align:right">
      <div class="chip neon" style="font-size:0.7rem">${e.flight_id}</div>
      <div style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-dim); margin-top:2px">${_(e.txn_time)}</div>
    </div>
  `,t.insertBefore(i,t.firstChild);t.children.length>12;)t.removeChild(t.lastChild)}function Oi(e,t){const i=document.getElementById("ret-items-chart");i&&new Chart(i,{type:"bar",data:{labels:e.map(n=>n[0]),datasets:[{data:e.map(n=>n[1]),backgroundColor:["#34d399","#38bdf8","#c084fc","#fbbf24","#f43f5e"],borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,indexAxis:"y",plugins:{legend:{display:!1}},scales:{x:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#94a3b8"}},y:{grid:{display:!1},ticks:{color:"#f8fafc"}}}}});const l=document.getElementById("ret-payment-chart");if(l){const n={};r.retail_transactions.forEach(s=>{n[s.payment_method]=(n[s.payment_method]||0)+1}),new Chart(l,{type:"doughnut",data:{labels:Object.keys(n),datasets:[{data:Object.values(n),backgroundColor:["#38bdf8","#34d399","#c084fc","#fbbf24"],borderWidth:0}]},options:{cutout:"65%",responsive:!0,maintainAspectRatio:!0,plugins:{legend:{display:!0,position:"right",labels:{color:"#94a3b8",font:{size:10}}}}}})}const a=document.getElementById("ret-hourly-chart");a&&new Chart(a,{type:"line",data:{labels:Array.from({length:24},(n,s)=>`${String(s).padStart(2,"0")}:00`),datasets:[{data:t,borderColor:"#34d399",borderWidth:2,fill:!0,backgroundColor:"rgba(52,211,153,0.1)",tension:.4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},ticks:{color:"#94a3b8"}},y:{grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#94a3b8",callback:n=>"₹"+(n/1e3).toFixed(0)+"K"}}}}})}function Gt(){let e=r.retail_transactions;const t=window._ret_search||"";t&&(e=e.filter(c=>{var o,v,d;return((o=c.item)==null?void 0:o.toLowerCase().includes(t))||((v=c.pnr_code)==null?void 0:v.toLowerCase().includes(t))||((d=c.shop_name)==null?void 0:d.toLowerCase().includes(t))}));const i=rt*nt,l=e.slice(i,i+nt),a=document.getElementById("ret-tbody");if(!a)return;a.innerHTML=l.map(c=>{var o;return`
    <tr>
      <td class="mono dim">${(o=c.txn_id)==null?void 0:o.slice(0,16)}</td>
      <td class="bright">${c.shop_name}</td>
      <td class="bright text-accent">${c.item}</td>
      <td class="mono dim">${c.pnr_code}</td>
      <td class="mono bright">${c.flight_id}</td>
      <td class="mono bright text-emerald">${X(c.total_amount)}</td>
      <td class="mono">${c.quantity}</td>
      <td><span class="chip neon">${c.payment_method}</span></td>
      <td class="mono dim">${_(c.txn_time)}</td>
      <td>${c.is_airside?'<span class="chip green">AIRSIDE</span>':""}</td>
    </tr>
  `}).join("");const n=document.getElementById("ret-page-info"),s=document.getElementById("ret-pagination");if(n&&(n.textContent=`Showing ${i+1}–${Math.min(i+nt,e.length)} of ${e.length} transactions`),s){const c=Math.ceil(e.length/nt);s.innerHTML=Array.from({length:Math.min(c,8)},(o,v)=>`<button class="pg-btn ${v===rt?"active":""}" data-p="${v}">${v+1}</button>`).join(""),s.querySelectorAll(".pg-btn").forEach(o=>o.addEventListener("click",()=>{rt=parseInt(o.dataset.p),Gt()}))}}const lt={overview:{render:di,destroy:ci},flights:{render:vi,destroy:pi},gates:{render:hi,destroy:fi},baggage:{render:bi,destroy:Ei},passengers:{render:_i,destroy:Ii},security:{render:Ai,destroy:ki},maintenance:{render:$i,destroy:Li},staff:{render:wi,destroy:Ri},retail:{render:Bi,destroy:Ni}};let dt=null;const ue=[{key:"flights",label:"flights.csv"},{key:"passengers",label:"passengers.csv"},{key:"baggage",label:"baggage.csv"},{key:"gate_events",label:"gate_events.csv"},{key:"security_screening",label:"security_screening.csv"},{key:"maintenance_logs",label:"maintenance_logs.csv"},{key:"staff_shifts",label:"staff_shifts.csv"},{key:"retail_transactions",label:"retail_transactions.csv"}];async function Di(){ai(),Gi(),await Pi(),await Fi(),Hi()}function Gi(){const e=document.getElementById("boot-files");e&&(e.innerHTML=ue.map(t=>`
    <div class="boot-file-row" id="boot-row-${t.key}">
      <div class="boot-file-name">${t.label}</div>
      <div class="boot-file-bar-wrap">
        <div class="boot-file-bar" id="boot-bar-${t.key}"></div>
      </div>
      <div class="boot-file-pct" id="boot-pct-${t.key}">0%</div>
    </div>
  `).join(""))}async function Pi(){let e=0;const t=await _e((i,l)=>{const a=document.getElementById(`boot-bar-${i}`),n=document.getElementById(`boot-pct-${i}`);a&&(a.style.width=l+"%"),n&&(n.textContent=l+"%"),l===100&&e++;const s=Math.round(e/ue.length*100),c=document.getElementById("boot-total-bar");c&&(c.style.width=s+"%");const o=document.getElementById("boot-status");o&&(o.textContent=`LOADING DATASET // ${i.toUpperCase()}`)});Ae(t)}async function Fi(){const e=document.getElementById("boot-status"),t=["PARSING TELEMETRY STREAMS","INITIALIZING IN-MEMORY DATA STORE","BUILDING CROSS-REFERENCE INDEXES","STARTING REAL-TIME SIMULATION ENGINE","SYSTEM ONLINE // ALL UNITS ACTIVE"];for(const l of t)e&&(e.textContent=l),await Ct(180);await Ct(250);const i=document.getElementById("boot-screen");i&&i.classList.add("fade-out"),await Ct(600)}function Ct(e){return new Promise(t=>setTimeout(t,e))}function Hi(){const e=document.getElementById("app");e&&e.classList.add("visible"),ri(),Ui(),Vi(),Yi(),qi(),Ki(),De(),he("overview"),$("tick",({simTime:t})=>{ji()})}function Ui(){var i,l,a;de(),setInterval(de,1e3);let e=!1;const t=document.getElementById("sim-playpause");(i=document.getElementById("sim-faster"))==null||i.addEventListener("click",()=>{Fe(),document.getElementById("sim-speed-label").textContent=Xt()+"×"}),(l=document.getElementById("sim-slower"))==null||l.addEventListener("click",()=>{He(),document.getElementById("sim-speed-label").textContent=Xt()+"×"}),t==null||t.addEventListener("click",()=>{e=!e,e?(Ge(),t.textContent="▶",t.classList.remove("active")):(Pe(),t.textContent="⏸",t.classList.add("active"))}),(a=document.getElementById("alerts-btn"))==null||a.addEventListener("click",()=>{var n;(n=document.getElementById("alert-drawer"))==null||n.classList.toggle("open")})}function de(){const e=new Date,t=document.getElementById("clock-time"),i=document.getElementById("clock-date");t&&(t.textContent=e.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"})),i&&(i.textContent=e.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}))}function ji(e){document.getElementById("sim-time-display")}function Vi(){document.querySelectorAll(".nav-tab[data-view]").forEach(e=>{e.addEventListener("click",()=>{he(e.dataset.view)})})}function he(e){var i,l;if(document.querySelectorAll(".nav-tab").forEach(a=>a.classList.remove("active")),(i=document.querySelector(`.nav-tab[data-view="${e}"]`))==null||i.classList.add("active"),document.querySelectorAll(".view").forEach(a=>a.classList.remove("active")),dt&&lt[dt])try{lt[dt].destroy()}catch{}dt=e;const t=document.getElementById(`view-${e}`);if(t){if(t.innerHTML="",t.classList.add("active"),lt[e])try{lt[e].render(t)}catch(a){console.error(`Error rendering view [${e}]:`,a)}(l=document.getElementById("main"))==null||l.scrollTo(0,0)}}function Yi(){var e;(e=document.getElementById("alert-close"))==null||e.addEventListener("click",()=>{var t;(t=document.getElementById("alert-drawer"))==null||t.classList.remove("open")})}function qi(){oe(e=>{Wi(e),fe(),zi()})}function Wi(e){const t=document.getElementById("alert-list");if(!t)return;const i=document.createElement("div");for(i.className=`alert-item ${e.type||"info"}`,i.id=`alert-${e.id}`,i.innerHTML=`
    <div class="alert-title">${e.title}</div>
    <div class="alert-msg">${e.msg}</div>
    <div class="alert-time">${new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
    <button class="alert-dismiss" onclick="window._dismissAlert('${e.id}')">✕</button>
  `,t.insertBefore(i,t.firstChild);t.children.length>25;)t.removeChild(t.lastChild)}window._dismissAlert=function(e){Oe(e);const t=document.getElementById(`alert-${e}`);t&&t.remove(),fe()};function fe(){const e=A.length,t=document.getElementById("alerts-count");t&&(t.textContent=Math.min(e,99),e>0?t.classList.add("show"):t.classList.remove("show"))}function zi(){const e=A.filter(s=>s.type==="critical"&&s.flightId).length,t=A.filter(s=>{var c;return(c=s.title)==null?void 0:c.includes("Security")}).length,i=A.filter(s=>{var c;return(c=s.title)==null?void 0:c.includes("Maintenance")}).length,l=document.getElementById("nav-badge-flights");l&&(l.textContent=e,l.classList.toggle("show",e>0));const a=document.getElementById("nav-badge-security");a&&(a.textContent=t,a.classList.toggle("show",t>0));const n=document.getElementById("nav-badge-maint");n&&(n.textContent=i,n.classList.toggle("show",i>0))}function Ki(){const e=[{type:"info",text:"DEL OCC SYSTEM ONLINE // TELEMETRY LINKED"},{type:"ok",text:"TERMINAL 3 OPERATIONAL // 50 ACTIVE GATES"},{type:"info",text:`${r.flights.length} FLIGHTS MONITORED // REAL-TIME SIM ACTIVE`},{type:"warning",text:`${r.flights.filter(l=>l.delay_mins>0).length} FLIGHTS DELAYED // MONITORING AIRSPACE`},{type:"ok",text:`${r.passengers.length} PASSENGERS PROCESSED IN CURRENT WINDOW`},{type:"info",text:"SECURITY CHECKPOINTS: 8 LANES ACTIVE"},{type:"ok",text:`${r.baggage.length} BAGGAGE TAGS TRACKED ACROSS 10 CAROUSELS`},{type:"warning",text:`${r.maintenance_logs.filter(l=>!l.resolved).length} OPEN MAINTENANCE WORK ORDERS`}],t=document.getElementById("ticker-inner");if(!t)return;const i=[...e,...e];t.innerHTML=i.map(l=>`
    <span class="ticker-item ${l.type}">
      <span class="ticker-dot"></span>
      ${l.text}
    </span>
  `).join(""),oe(l=>{const a=document.createElement("span");a.className=`ticker-item ${l.type==="critical"?"critical":l.type==="vip"?"warning":"info"}`,a.innerHTML=`<span class="ticker-dot"></span>${l.title} · ${l.msg.slice(0,60)}...`,t.appendChild(a.cloneNode(!0)),t.insertBefore(a,t.firstChild),t.children.length>40&&t.removeChild(t.lastChild)})}Di().catch(console.error);
