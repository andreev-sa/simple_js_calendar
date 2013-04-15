
//Document   : cldScrpt
//Created on : 13.04.2013, 9:11:47
//Author     : andreev.s.a



if (typeof(cld) == "undefined"){
    _c = {};
}

_c.CLDRS = Array();

_c.autoinit = function(query){
    if(query.indexOf("#")==0){
        _c.autoinitById(query.substr(1))
    }else if(query.indexOf(".")==0){
        _c.autoinitByClsName(query.substr(1))
    }
}

_c.autoinitById = function(id){
    var cld = new _c.calendar(id, {});
                        cld.init();
}

_c.autoinitByClsName = function(className){
    (function(clsNm){
                var cls = "b-cld";
                var idPref = "myCldID_";
                if(clsNm&&1){
                    if(typeof(clsNm)=="string") cls = clsNm;
                }
	

    

                var clds = _c.DOM.gEsByCls(cls);
                for(var it=0; it < clds.length; it++){
                    if(clds[it]&&1){
                        var curDiv = clds[it];
                        var curId = curDiv.id;
                        if(curId===undefined||curId.length==0){
                            curId = idPref+Math.random()+"_" + Date.now();
                            while(_c.DOM.gE(curId).length==0){
                                curId = idPref+Math.random()+"_" + Date.now();
                            }
                            curDiv.id = curId;
                        }
                        var cld = new _c.calendar(curId, {});
                        cld.init();
                    }
                }})(className);
}

if (typeof(_c.calendar) == "undefined")
    _c.calendar = {};
            
_c.calendar = function(id,param){
                
    if (!document.getElementById){
        return 0;
    }
                
    this.cldr = _c.DOM.gE(id);
                
    if (!this.cldr){
        return 0;
    }
    
    this.id = id;
    
    this.options = param ? param : {};
    
    this.controls = {};
    
    var today = new Date();
    
    var dateStr = today.getFullYear()+ ","+today.getMonth()+","+ today.getDate();

// defaults	
    var k, def = {
        date : dateStr,
        daysOfWeekShort : ["\u043f\u043d" , "\u0432\u0442" , "\u0441\u0440" , "\u0447\u0442" , "\u043f\u0442" , "\u0441\u0431" , "\u0432\u0441" ],
        years: ["2010","2011","2012","2013","2014","2015","2016"]
        };
    for (k in def)
    {
        if (typeof(this.options[k]) != typeof(def[k]))
            this.options[k] = def[k];
    }
    
    var splt = this.options.date.split(',');
    if(splt.length==3){
        this.selDate = new Date(splt[0],splt[1],splt[2]);
    }
    else{
        this.selDate = today
    }
    this.options.months = ["\u042f\u043d\u0432\u0430\u0440\u044c", "\u0424\u0435\u0432\u0440\u0430\u043b\u044c",
                        "\u041c\u0430\u0440\u0442", "\u0410\u043f\u0440\u0435\u043b\u044c",
                        "\u041c\u0430\u0439", "\u0418\u044e\u043d\u044c",
                        "\u0418\u044e\u043b\u044c", "\u0410\u0432\u0433\u0443\u0441\u0442",
                        "\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c", "\u041e\u043a\u0442\u044f\u0431\u0440\u044c",
                         "\u041d\u043e\u044f\u0431\u0440\u044c", "\u0414\u0435\u043a\u0430\u0431\u0440\u044c"];
    this.month = {};
    this.controls = {};
    
    _c.CLDRS.push(this);
}

_c.calendar.prototype.findCld = function(id){
    var cld_i;
    for(var i=0;i < _c.CLDRS.length; i++){
        cld_i = _c.CLDRS[i];
        var cId = cld_i.id;
        if( cId == id){
        
            return cld_i;
        }
    }
    return _c.calendar(id,{});
}

_c.calendar.prototype.init = function(){
    this.controls = this.makeControls(this.selDate, this.options);
    this.month = this.makeMonth(this.selDate, this.options);
    this.draw();
}

_c.calendar.prototype.makeControls = function(selDate, options){
    var today = new Date(selDate);
    
    var m = today.getMonth();
    var y = today.getFullYear();
    
    var div = _c.DOM.cE("div", {className:"cld_controls"});
    var m_select =  _c.DOM.cE("select", {className:"cld_monthChange"});
    var y_select =  _c.DOM.cE("select", {className:"cld_yearChange"});
        
        y_select.onchange = function(){
            var id = this.parentNode.parentNode.id;
            var cld = _c.calendar.prototype.findCld(id);
            var d = cld.selDate.getDate();
            var m = cld.selDate.getMonth();
            cld.selDate = new Date(this.value,m,d);
            cld.init();
        }
        
        if(options.years!==undefined){
            
            for(var j in options.years){
                var y_optn =  _c.DOM.cE("option", {value:options.years[j]},options.years[j],true);
                if(options.years[j]==y){ 
                    y_optn.setAttribute("selected", true)
                }
                y_select.appendChild(y_optn);
            }
            
        }
        
        m_select.onchange = function(){
            var id = this.parentNode.parentNode.id;
            var cld = _c.calendar.prototype.findCld(id);
            var d = cld.selDate.getDate();
            var y = cld.selDate.getFullYear();
            cld.selDate = new Date(y,this.value,d);
            cld.init();
        }
        if(options.months!==undefined){
            for(var i in options.months){
                var m_optn =  _c.DOM.cE("option", {value:i},options.months[i],true);
                if(i==m){
                    m_optn.setAttribute("selected", true)
                }
                m_select.appendChild(m_optn);
            }
        }
        
        div.appendChild(m_select);
        div.appendChild(y_select);
        
        return div;
}

_c.calendar.prototype.makeMonth = function(dt,options){
    var m = dt.getMonth();
    var y = dt.getFullYear();
    var firstDay = new Date(Date.UTC(y, m, 1));
    var lastDay = new Date(Date.UTC(y, m+1, 0));
    var maxDate = lastDay.getDate();
    var startDay = (firstDay.getDay()+6)%7;
    var numberOfWeeks = 6;
    
    var t = new Date();
    var t_d = t.getDate();
    var t_m = t.getMonth();
    var t_y = t.getFullYear();
    
    var hasToday = false;
    if(m==t_m&&y==t_y){
        hasToday = true;
    }
    
    var month = _c.DOM.cE("div", {className:"cld_month"});
    var week = _c.DOM.cE("ul", {className:"cld_header"});
    var li;
    var day;
    for(var i=0;i<options.daysOfWeekShort.length;i++){
        li = _c.DOM.cE("li", {className:"cld_day"});
        day = _c.DOM.cE("span", {className:(i<5?"cld_day_value cld_woorkingDay":"cld_day cld_weekend")},options.daysOfWeekShort[i],true);
        li.appendChild(day);
        week.appendChild(li);
    }
    
    month.appendChild(week);
    
    var date = 0;
    for(var w_i=0;w_i<numberOfWeeks;w_i++){
        var wk = _c.DOM.cE("ul", {className:"cld_week"});

        for(var d_i=0;d_i<options.daysOfWeekShort.length;d_i++){
            if((w_i*7+d_i)>=startDay){ 
                date++;
            }
            li = _c.DOM.cE("li", {className:"cld_day"});
            day = _c.DOM.cE("span", {className:(d_i<5?"cld_day_value cld_woorkingDay":"cld_day cld_weekend")},(date>0&&date<=maxDate?(date+""):""),true);
            if(hasToday&&t_d==date) day.className += " cld_day-today"
            li.appendChild(day);
            wk.appendChild(li);
        }
        
        month.appendChild(wk);
        if(date>=maxDate) break;
    }

    return month;
}

_c.calendar.prototype.draw = function(){
    this.cldr.innerHTML = "";
    this.cldr.appendChild(this.controls);
    this.cldr.appendChild(this.month);
}            
            
/*DOM*/
if (typeof(_c.DOM) == "undefined"){
    _c.DOM = {};
}
            
/* create element */
_c.DOM.cE = function ( type, attr, cont, html )
{
    var ne = document.createElement( type );
    if (!ne)
        return 0;
		
    for (var a in attr)
        if(ne[a]===undefined) {
            ne.setAttribute(a, attr[a]);
        }
        else{
            ne[a] = attr[a];
        }
    //alert(html);
    var t = typeof(cont);
    //alert( t + " " + attr + " " + ne + "  c=" + cont);
    if (window.t == "string" && !html)
        $(ne).appendChild( document.createTextNode(cont) );
    else if (t == "string" && html)
        ne.innerHTML = cont;
    else if (t == "object")
        $(ne).appendChild( cont );
    //else if (t == "undefined"){}

    return ne;
};
            
/*get element*/
_c.DOM.gE = function ( e )
{
    var t=typeof(e);
    if (t == "undefined")
        return 0;
    else if (t == "string")
    {
        var re = document.getElementById( e );
        if (!re)
            return 0;
        else if (typeof(re.appendChild) != "undefined" )
            return re;
        else
            return 0;
    }
    else if (typeof(e.appendChild) != "undefined")
        return e;
    else
        return 0;
};

_c.DOM.gEsByCls = function ( e )
{
    var t=typeof(e);
    if (t == "undefined")
        return 0;
    else if (t == "string")
    {
            if(document.getElementsByClassName === undefined) { 
                document.getElementsByClassName = function(cl) { 
                    var retnode = []; 
                    var myclass = new RegExp('\\b'+cl+'\\b'); 
                    var elem = this.getElementsByTagName('*'); 
                    for (var i = 0; i < elem.length; i++) { 
                        var classes = elem[i].className; 
                        if (myclass.test(classes)) { 
                            retnode.push(elem[i]); 
                        } 
                    } 
                    return retnode; 
                } 
            }; 
        var re = document.getElementsByClassName( e );
        if (re.length>0)
            return re;
        
    }
    else if (typeof(e.appendChild) != "undefined")
        return e;
    else
        return 0;
};

/* remove element */
_c.DOM.remE = function ( ele )
{
    var e = this.gE(ele);

    if (!e)
        return 0;
    else if (e.parentNode.removeChild(e))
        return true;
    else
        return 0;
};