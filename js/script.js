class App {
	constructor(r){
		
		this.fundlist = [];
		this.highlist = [];
		this.invlist = [];

		r.forEach((e)=>{
			this.fundlist.push(new Fund(e.number, e.name, e.endDate, e.total, e.current, e.investorList));
			this.highlist.push(new Fund(e.number, e.name, e.endDate, e.total, e.current, e.investorList));
			e.investorList.forEach((x)=>{
				this.invlist.push(new Investor(e.number, e.name, e.total, e.current, x.email, x.pay, x.datetime));
			});
		});

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

	remove(e) {
		e.parentNode.removeChild(e);
	}

	mainLoader() {
		this.highlist = this.highlist.sort((a,b) => (b.current / b.total) - (a.current / a.total));
		this.highlist = this.highlist.filter(x => new Date(x.endDate) > new Date());
		
		let form = document.querySelector(".ranking-form");
		for(let i = 0; i < 4; i++){
			let div = document.createElement("div");
			div.classList.add("ranking");
			div.innerHTML = this.mainRanking(this.highlist[i]);
			let canvas = div.querySelector("canvas");
			this.makeGraph(canvas, this.highlist[i]);
			form.append(div);
			let btn = div.querySelector("button");
			btn.addEventListener("click", ()=>{
				this.makePopup(this.highlist[i]);	
			});
		}
	}

	makePopup(x) {
		let back = document.createElement("div");
		back.classList.add("back");
		back.innerHTML = this.popupTemp(x);
		document.querySelector("body").append(back);
		$(".pop").on("click", ()=>{
			this.remove(back);
		});
		$(".close-pop").on("click",()=>{
			this.remove(back);
		});
	}

	popupTemp(x) {
		let total = parseInt(x.total).toLocaleString();
		let current = parseInt(x.current).toLocaleString();
		let temp = `
			<div class="pop"></div>
			<div class="up">
				<span class="close-pop">&times;</span>
				<div class="up-box">
					<div class="up-left">펀드번호</div>
					<span>${x.number}</span>
				</div>
				<div class="up-box">
					<div class="up-left">창업펀드명</div>
					<span>${x.name}</span>
				</div>
				<div class="up-box">
					<div class="up-left">모집마감일</div>
					<span>${x.endDate}</span>
				</div>
				<div class="up-box">
					<div class="up-left">모집금액</div>
					<span>${x.total}</span>
				</div>
				<div class="up-box">
					<div class="up-left">현재금액</div>
					<span>${x.current}</span>
				</div>
			</div>
		`;
		return temp;
	}

	mainRanking(x) {
		let current = parseInt(x.current).toLocaleString();
		let temp = `
			<canvas width="240" height="200"></canvas>
			<h3>${x.number}</h3>
			<h2>${x.name}</h2>
			<div class="rank-div">
				<div class="rank-left">달성율</div>
				<span>${x.current / x.total * 100}%</span>
			</div>
			<div class="rank-div">
				<div class="rank-left">모집마감일</div>
				<span>${x.endDate}</span>
			</div>
			<div class="rank-div">
				<div class="rank-left">현재금액</div>
				<span>${current}</span>
			</div>
			<button>상세보기</button>
		`;
		return temp;
	}

	makeGraph(canvas, x) {
		let w = canvas.width;
		let h = canvas.height;
		let ctx = canvas.getContext("2d");
		let term = x.current / 45;
		let now = 0;

		let frame = setInterval(()=>{
			now += term;
			if(now >= x.current){
				now = x.current;
				clearInterval(frame);
			}
			this.drawGraph(ctx, now, w, h, x.total); 
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
		ctx.arc(w/2, h/2, 90, -Math.PI/2, -Math.PI/2 + (now / total) * ( 2 * Math.PI));
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(w/2, h/2);
		ctx.fillStyle = "#fff";
		ctx.arc(w/2, h/2, 60, -Math.PI*2, 3/2*Math.PI);
		ctx.fill();
		ctx.closePath();

		let percent = Math.floor(now / total * 100);
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
	$.getJSON('/js/fund.json', function(result){
		let app = new App(result);
	})
}