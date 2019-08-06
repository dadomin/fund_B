class App {
	constructor(r){

		this.fundlist = [];
		this.highlist = [];
		this.invlist = [];

		r.forEach((e)=>{
			this.fundlist.push(new Fund(e.number, e.name, e.endDate, e.total, e.current, e.investorList));
			this.highlist.push(new Fund(e.number, e.name, e.endDate, e.total, e.current, e.investorList));
		});

		r.forEach((e)=>{
			e.investorList.forEach((x)=>{
				this.invlist.push(new Investor(e.number, e.name, e.total, e.current, x.email, x.pay, x.datetime));
			});
		});

		console.log(this.invlist);

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

	}

	mainLoader() {

		// 랭킹 정렬
		this.highlist = this.highlist.sort((a,b) => (b.current / b.total) - (a.current / a.total));
		this.highlist = this.highlist.filter(x => new Date(x.endDate) > new Date());

		let form = document.querySelector(".ranking-form");
		for(let i = 0; i < 4; i++){
			let div = document.createElement("div");
			div.classList.add("ranking");
			div.innerHTML = this.mainRank(this.highlist[i]);
			form.append(div);
			let canvas = div.querySelector("canvas");
			this.makeGraph(canvas, this.highlist[i]);
		}
	}

	mainRank(x) {
		let current = parseInt(x.current).toLocaleString();
		let temp = `
			<canvas width="240" height="200"></canvas>
			<h3>${x.number}</h3>
			<h2>${x.name}</h2>
			<div class="rank-div">
				<div class="rank-left">
					달성율
				</div>
				<span>${x.current / x.total * 100}%</span>
			</div>
			<div class="rank-div">
				<div class="rank-left">
					모집마감일
				</div>
				<span>${x.endDate}</span>
			</div>
			<div class="rank-div">
				<div class="rank-left">
					현재금액
				</div>
				<span>${current}원</span>
			</div>
			<button>상세보기</button>
		`

		return temp;
	}

	makeGraph(canvas, x) {
		let w = canvas.width;
		let h = canvas.height;
		let ctx = canvas.getContext("2d");
		let term = x.current / 45;
		let now = 0;
		let total = x.total;

		let frame = setInterval(()=>{
			now += term;
			if(now >= x.current){
				now = x.current;
				clearInterval(frame);
			}
			this.drawGraph(ctx, now, w, h, total); 
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

	fundLoader() {
		$("#fcnt").text(this.fundlist.length);

		let form = document.querySelector(".fund-form");

		this.fundlist.forEach((e)=>{
			let div = document.createElement("div");
			div.classList.add("fund");
			div.innerHTML = this.fundTemp(e);
			form.append(div);
			let canvas = div.querySelector("canvas");
			this.makeGraph(canvas, e);
		})
	}

	fundTemp(e) {
		let current = parseInt(e.current).toLocaleString();
		let total = parseInt(e.total).toLocaleString();
		let temp = `
			<div class="fund-title">
				<h3>${e.number}</h3>
				<h2>${e.name}</h2>
				<div class="fund-status">모집중</div>
			</div>
			<div class="fund-views">
				<canvas width="220" height="220"></canvas>
				<div class="fund-notice">
					<div>
						<h3>모집마감일</h3>
						<div class="line50"></div>
						<p>${e.endDate}</p>
					</div>
					<div>
						<h3>모집금액</h3>
						<div class="line50"></div>
						<p>${e.total}</p>
					</div>
					<div>
						<h3>현재금액</h3>
						<div class="line50"></div>
						<p>${e.current}</p>
					</div>
					<div>
						<h3>펀드등록자</h3>
						<div class="line50"></div>
						<p>김아무개</p>
					</div>
				</div>
			</div>
			<div class="fund-btns">
				<button>투자하기</button>
				<button>상세보기</button>
			</div>
		`
		return temp;
	}

	adaptLoader() {

	}

	investorLoader() {
		$("#icnt").text(this.invlist.length);
		let form = document.querySelector(".investors");
		this.invlist.forEach((x)=>{
			let div = document.createElement("div");
			div.classList.add("investor");
			let pay = parseInt(x.pay).toLocaleString();
			let percent = Math.floor(x.pay / x.total * 100);
			div.innerHTML = `
				<div>${x.number}</div>
				<div>${x.name}</div>
				<div>${x.email}</div>
				<div>${pay}원</div>
				<div><canvas width="120" height="30"></canvas>${percent}%</div>
				<div>${x.datetime}</div>
			`;
			let canvas = div.querySelector("canvas");
			this.makeLine(canvas, x.total, x.pay);
			form.append(div);
		});
	}

	makeLine(canvas, total, pay) {
		let w = canvas.width;
		let h = canvas.height;
		let ctx = canvas.getContext("2d");
		let now = 0;
		let term = pay / 45;

		let frame = setInterval(()=>{
			now += term;
			if(now >= pay){
				now = pay;
				clearInterval(frame);
			}
			this.drawLine(ctx, w, h, now, total);
		}, 1000/30);
	}

	drawLine(ctx, w, h, now, total) {
		ctx.clearRect(0,0,w,h);

		ctx.fillStyle = "#bddff0";
		ctx.fillRect(0,0,w,h);

		ctx.fillStyle = "#2292d1";
		ctx.fillRect(0, 0, (now / total) * w,  h);

	}
}

window.onload = function(){
	$.getJSON('./js/fund.json', function(result){
		let app = new App(result);
	});
}