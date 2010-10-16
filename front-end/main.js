var WIDTH = 4000;
var HEIGHT = 3000;

var ctx = null;
var main_data = new Array();

function draw()
{
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	for(item in main_data)
	{
		ctx.font = 'bold ' + Math.floor(main_data[item].size) + 'px Georgia';
		ctx.fillText(main_data[item].text, main_data[item].pos[0], main_data[item].pos[1]);
	}
}

function generate_pos(idx, total, width, height)
{
	// This will only be reasonably pretty for total < 7
	switch(total)
	{
	case 1:
		return [width/2, height/2];
	case 2:
		return [width/2, height/3 * idx];
	default:
		var x = 0;
		var y = 0;
		var increment = width / (total - Math.floor(total / 3) + 1);
		// Calculate x offset
		if(idx > 0 && idx % 3 == 2)
			x = increment * idx;
		else
			x = increment * (idx + 1);
		// Calculate y offset
		if(idx > 0 && idx % 3 == 2)
			y = height / 4 * 3;
		else if((idx+1) % 3 == 2)
			y = height / 4;
		else
			y = height / 2;
		return [x, y];
	}
}

function process_item(item, depth, total, total_count, width, height, index)
{
	var children = 0;
	var child_index = 0;
	var new_item = {};
	new_item.text = item.name;
	new_item.size = (Math.log(item.count / total + 1) / Math.log(5) + 0.05) * (height / 2);
	new_item.pos = generate_pos(index, total_count, width, height);
	for(child in item.children){ children += item.children[child].count; }
	for(child in item.children)
	{
		process_item(item.children[child], depth + 1, children, item.children.length, width / 3, height / 3, child_index++);
	}
	main_data.push(new_item);
}

function init(data)
{
	var total = 0;
	var index = 0;
	for(item in data.contents){	total += data.contents[item].count; }
	for(item in data.contents){ process_item(data.contents[item], 1, total, data.contents.length, WIDTH, HEIGHT, index++); }
	draw();
}

$(document).ready(function()
{
	var canvas = document.getElementById('canvas');  
	ctx = canvas.getContext('2d');
	ctx.fillStyle = '#333';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.scale(0.16, 0.16);
	ctx.translate(WIDTH/7, 0);
	$.getJSON('example.json', init);
});
