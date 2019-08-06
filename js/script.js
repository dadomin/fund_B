class App {
	constructor(){
		let clicking = document.getElementsByClassName("click")[0].innerHTML;
		if(clicking == "메인페이지"){
			this.mainLoader();
		}else if(clicking == "펀드등록"){
			this.adaptLoader();
		}else if(clicking == "펀드보기"){
			this.fundLoader();
		}else if(clicking == "투자자목록"){
			this.investorLoader();
		}
		console.log(clicking);
	}

	mainLoader() {
		let ranking = document.getElementsByClassName("ranking");
		
		for(let i = 0; i < ranking.length; i++) {
			let canvas = ranking[i].querySelector("canvas");
			let p = 100 - (10 * i);
			this.makeGraph(canvas, p);
		}
	}

	makeGraph(canvas, x) {
		let w = canvas.width;
		let h = canvas.height;
		let ctx = canvas.getContext("2d");
		let term = x / 45;
		let now = 0;

		let frame = setInterval(()=>{
			now += term;
			if(now >= x){
				now = x;
				clearInterval(frame);
			}
			this.drawGraph(ctx, now, w, h, x); 
		}, 1000/30);
	}

	drawGraph(ctx, now, w, h, total) {
		ctx.clearRect(0, 0, w, h);

		ctx.beginPath();
		ctx.moveTo(w/2, h/2);
		ctx.fillStyle = "#bddff0";
		ctx.arc(w/2, h/2, 90, -Math.PI*2, 3/2*Math.PI);
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(w/2, h/2);
		ctx.fillStyle = "#2292d1";
		ctx.arc(w/2, h/2, 90, -Math.PI/2, -Math.PI/2 + (now / 100) * ( 2 * Math.PI));
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(w/2, h/2);
		ctx.fillStyle = "#fff";
		ctx.arc(w/2, h/2, 60, -Math.PI*2, 3/2*Math.PI);
		ctx.fill();
		ctx.closePath();

		let percent = Math.floor(now);
		ctx.fillStyle = "#002758";
		ctx.font = "25px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(percent + "%", w/2, h/2);
	}

	makeLine(canvas, x) {
		let w = canvas.width;
		let h = canvas.height;
		let ctx = canvas.getContext("2d");
		let now = 0;
		let term = x / 45;

		let frame = setInterval(()=>{
			now += term;
			if(now >= x){
				now = x;
				clearInterval(frame);
			}
			this.drawLine(ctx, w, h, now, x);
		}, 1000/30);
	}

	drawLine(ctx, w, h, now, x) {
		ctx.clearRect(0,0,w,h);

		ctx.fillStyle = "#bddff0";
		ctx.fillRect(0,0,w,h);

		ctx.fillStyle = "#2292d1";
		ctx.fillRect(0, 0, (now / 100) * w,  h);

	}

	adaptLoader() {

	}

	fundLoader() {
		let fund = document.getElementsByClassName("fund");

		for(let i = 0; i < fund.length; i++){
			let canvas = fund[i].querySelector("canvas");
			let p = 100 - (10*i);
			this.makeGraph(canvas, p);
		}
	}

	investorLoader() {
		let inv = document.getElementsByClassName("investor");
		for(let i = 0; i < inv.length; i++){
			let canvas = inv[i].querySelector("canvas");
			let p = 100 - (10 * i);
			this.makeLine(canvas, p);
		}
	}
}

window.onload = function(){
	console.log("뭔데");
	let app = new App();
}