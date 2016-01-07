function beginScroll(){
    var height = 799 * (document.body.clientWidth/600);
    $("#first").css("height", height+"px");
    $("#second").css("top", (((height - document.body.clientWidth) * -1)*2));
    $("#third").css("top", (((height - document.body.clientWidth) * -1)*3));
    i = 0;
    backgrounds = [{name: "first", top: (height - document.body.clientWidth) * -1}, {name: "second", top: ((height - document.body.clientWidth) * -1)*2}, {name: "third", top: ((height - document.body.clientWidth) * -1)*3}];
    function scroll(){        
        for(var i = 0; i < backgrounds.length; i ++){
            backgrounds[i].top ++;
            $("#"+backgrounds[i].name).css("top", backgrounds[i].top+"px");
            if (backgrounds[i].top < 0 && backgrounds[i].top > -50) {
                $("#"+backgrounds[i].name).css("height", height+"px");
            }
            else if (backgrounds[i].top > document.body.clientHeight) {
                $("#"+backgrounds[i].name).css("height", "0px");
                $("#"+backgrounds[i].name).css("top", (((height - document.body.clientWidth) * -1)* (i+1)));
            }
        }
    }
    setInterval(scroll, 50);
}