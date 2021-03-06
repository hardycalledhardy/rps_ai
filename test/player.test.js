define(["jquery","../js/PlayerError.js","../js/game.js","../js/player/template.js","../js/player/human.js","../js/player/bot.js"],
function($,PlayerError,Game,template,Human,Bot){
  describe("player:human",function()
  {
    it("basic",function(done)
    {
      var p1={doms:Array(3)};
      var p2={doms:Array(3)};
      for(var i=0;i<3;i++){
        p1.doms[i]=$("<div></div>");
        p2.doms[i]=$("<div></div>");
      }
      var h1=Human(p1);
      var h2=Human(p2);
      var nth=function(){};
      var delay=0;
      var hand1=[];
      var hand2=[];
      var click=function(hand,doms){
        var h=(Math.random()*3)|0;
        hand.push(h);
        $(doms[h]).click();
      };
      var start=function()
      {
        window.setTimeout(function(){
          click(hand1,p1.doms);
          click(hand2,p2.doms);
        },delay);
      };
      var end=function(message)
      {
        expect(message).toBe("no more turns");
        var hand12=hand1.map(function(h1,i){
          return h1+hand2[i]*4;
        });
        var history=game.history.map(function(x){return x&15;});
        expect(hand12).toEqual(history);
        done();
      };
      var game=Game(h1,h2,100,start,nth,nth,end,10);
    });
  });
  describe("player:bot",function(){
    var nth=function(){};
    it("basic",function(done)
    {
      var b1=Bot({boturi:"/base/js/botTemplate.js",botparam:"{}",dataurl:""});
      var b2=Bot({boturi:"/base/js/botTemplate.js",botparam:"{}",dataurl:""});
      var n=20;
      var end=function(message)
      {
        expect(message).toBe("no more turns");
        expect(game.history.length).toBe(n);
        done();
      };
      var game=Game(b1,b2,200,nth,nth,nth,end,n);

    });
    it("handle bot source not found",function(done)
    {
      var b1=Bot({boturi:"/base/js/botTemplate.js",botparam:"{}",dataurl:""});
      var b2=Bot({boturi:"/base/js/botTemplate___.js",botparam:"{}",dataurl:""});
      var n=20;
      var end=function(message)
      {
        expect(message instanceof PlayerError).toBe(true);
        expect(message.message.indexOf("uri")!==-1).toBe(true);
        done();
      };
      var game=Game(b1,b2,100,nth,nth,nth,end,n);
    });
    xit("handle bot source not readable",function()
    {
      console.warn("Cannot test reading bot source from github");
    });
  });
});
