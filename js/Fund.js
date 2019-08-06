class Fund {
	constructor(number, name, endDate, total, current, investorList){
		this.number = number;
		this.name = name;
		this.endDate = endDate;
		this.total = total;
		this.current = current;
		if(current == "" || current === undefined) this.current = 0;
		this.investorList = investorList;
	}
}