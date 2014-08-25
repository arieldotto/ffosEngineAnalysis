(function () {

    //Ready
    document.getElementById('doAnalysis').addEventListener('click',doAnalysis);
    document.getElementById('flechavoltar').addEventListener('click',voltar);
    document.getElementById('eloD').focus();

    String.prototype.asDouble = function(){
      return parseDouble(this);
    }
    function parseDouble(value) {
        value = String(value).trim();
        if (value.length === 0 || value === 'undefined' || value === 'null')
            value = '0';
        if (value.indexOf(',') !== -1)
            value = value.replace('.', '').replace('.', '').replace(',', '.');
        return parseFloat(parseFloat(value).toFixed(12));
    }
    function toDegrees (angle) {
        return angle * (180 / Math.PI);
    }
    function toRadians (angle) {
        return angle * (Math.PI / 180);
    }
    Number.prototype.formatMoney = function(c, d, t){
      var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
         return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
     }
    function doAnalysis() {
	  document.getElementById('log').textContent = '';
	  document.getElementById('log').style.backgroundColor = 'white'
      var eloD = parseDouble(document.getElementById('eloD').value);
      var eloA = parseDouble(document.getElementById('eloA').value);
      var eloB = parseDouble(document.getElementById('eloB').value);
      var eloC = parseDouble(document.getElementById('eloC').value);
      var eloD = parseDouble(document.getElementById('eloD').value);
      var t2 = parseDouble(document.getElementById('t2').value);
      var w2 = parseDouble(document.getElementById('w2').value);
      var ax = calcAx(eloA,t2).asDouble();
      var ay = calcAy(eloA,t2).asDouble();
      var p = calcP(eloD,ay,ax).asDouble();
      var s = calcS(eloA,eloB,eloC,eloD,ax).asDouble();
      var q = calcQ(eloD,ax,ay,s).asDouble();
      var r = calcR(eloD,eloC,s).asDouble();
      var byp = calcByPlus(p,q,r).asDouble();
      var bym = calcByMinus(p,q,r).asDouble();
      var bxp = calcBx(ay,ax,eloD,byp,s,'bxp').asDouble();
      var bxm = calcBx(ay,ax,eloD,bym,s,'bxm').asDouble();
      var t3p = calcT3(byp,bxp,ax,ay,'t3p').asDouble();
      var t3m = calcT3(bym,bxm,ax,ay,'t3m').asDouble();
      var t4p = calcT4(bxp,byp,eloD,'t4p').asDouble();
      var t4m = calcT4(bxm,bym,eloD,'t4m').asDouble();
      var w3p = calcW3(eloA,eloB,t2,t3p,t4p,w2,'w3p');
      var w3m = calcW3(eloA,eloB,t2,t3m,t4m,w2,'w3m');
      var w4p = calcW4(eloA,eloC,t2,t3p,t4p,w2,'w4p').asDouble();
      var w4m = calcW4(eloA,eloC,t2,t3m,t4m,w2,'w4m').asDouble();
      calcVa(eloA,w2);
      calcVb(eloC,w4p,'vbp');
      calcVb(eloC,w4m,'vbm');
      grashofAnalisys();

      document.getElementById('fsDados').style.display = '';
      document.getElementById('flechavoltar').style.display = '';
      document.getElementById('form').style.display = 'none';
    }
    function calcAx(eloA,t2){
      return document.getElementById('ax').textContent = (eloA*Math.cos(toRadians(t2))).formatMoney('3',',','.');
    }
    function calcAy(eloA,t2){
      return document.getElementById('ay').textContent = (eloA*Math.sin(toRadians(t2))).formatMoney('3',',','.');
    }
    function calcP(eloD,ay,ax){
      return document.getElementById('p').textContent = ((Math.pow(ay,2)/Math.pow((ax-eloD),2))+1).formatMoney('3',',','.');
    }
    function calcS(eloA,eloB,eloC,eloD,ax){
      return document.getElementById('s').textContent = ((Math.pow(eloA,2)-Math.pow(eloB,2)+Math.pow(eloC,2)-Math.pow(eloD,2))/(2*(ax-eloD))).formatMoney('3',',','.');
    }
    function calcQ(eloD,ax,ay,s){
      return document.getElementById('q').textContent = ((2*ay*(eloD-s))/(ax-eloD)).formatMoney('3',',','.');
    }
    function calcR(eloD,eloC,s){
      return document.getElementById('r').textContent = (Math.pow((eloD-s),2)-Math.pow(eloC,2)).formatMoney('3',',','.');
    }
    function calcByPlus(p,q,r){
      return document.getElementById('byp').textContent = ((-q+Math.sqrt(Math.pow(q,2)-(4*p*r)))/(2*p)).formatMoney('3',',','.');
    }
    function calcByMinus(p,q,r){
      return document.getElementById('bym').textContent = ((-q-Math.sqrt(Math.pow(q,2)-(4*p*r)))/(2*p)).formatMoney('3',',','.');
    }
    function calcBx(ay,ax,eloD,by,s,id){
      return document.getElementById(id).textContent = (s-((2*ay*by)/(2*(ax-eloD)))).formatMoney('3',',','.');
    }
    function calcT3(by,bx,ax,ay,id){
      var x = bx-ax, y = by-ay;
      return document.getElementById(id).textContent = (toDegrees(Math.atan((y)/(x)))+normalizeAngle(x,y)).formatMoney('3',',','.');
    }
    function calcT4(bx,by,eloD,id){
      return document.getElementById(id).textContent = (toDegrees(Math.atan(by/(bx-eloD)))+normalizeAngle((bx-eloD),by)).formatMoney('3',',','.');
    }
    function calcW3(eloA,eloB,t2,t3,t4,w2,id){
      return document.getElementById(id).textContent = (((eloA*w2)/eloB)*(Math.sin(toRadians(t4-t2))/Math.sin(toRadians(t3-t4)))).formatMoney('3',',','.');
    }
    function calcW4(eloA,eloC,t2,t3,t4,w2,id){
      return document.getElementById(id).textContent = (((eloA*w2)/eloC)*((Math.sin(toRadians(t2-t3)))/(Math.sin(toRadians(t4-t3))))).formatMoney('3',',','.');
    }
    function calcVa(eloA,w2){
      return document.getElementById('va').textContent = ((eloA/1000)*w2).formatMoney('3',',','.');
    }
    function calcVb(eloC,w4,id){
      return document.getElementById(id).textContent = ((eloC/1000)*w4).formatMoney('3',',','.');
    }
    function normalizeAngle(x,y){
      //normalize angle to a correct quadrant	  
      if(x > 0){
        return 0;
      }else if(x == 0){
        if(y > 0)
          return 90;
        else if(y < 0)
          return -90;
        else if(y == 0)
          document.getElementById('log').textContent = 'XY analysis not exists for current angle!';
		  document.getElementById('log').style.backgroundColor = 'yellow'
          return 0;
      }else if(x < 0){
        if(y >= 0)
          return 180;
        else if(y < 0)
          return -180;
      }
    }
    function grashofAnalisys(){      
      var beamValues = [document.getElementById('eloA').value,document.getElementById('eloB').value,document.getElementById('eloC').value,document.getElementById('eloD').value];      
      beamValues.sort(function(a, b){return a-b});
      if(beamValues[0].asDouble()+beamValues[3].asDouble() <= beamValues[1].asDouble()+beamValues[2].asDouble()){
        document.getElementById('ga').textContent = 'True';
		document.getElementById('ga').parentNode.style.backgroundColor = 'green';
      }else{
        document.getElementById('ga').textContent = 'False';
		document.getElementById('ga').parentNode.style.backgroundColor = 'red';
	  }
    }

    function voltar() {
      document.getElementById('fsDados').style.display = 'none';
      document.getElementById('flechavoltar').style.display = 'none';
      document.getElementById('form').style.display = '';
    }
})();
