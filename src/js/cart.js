require(['config'],function(){

	require(['jquery'],function(){

		//引入头部
		$('.cart_head').load('./head.html header',function(){
			//高亮
			$('header').find('a').eq(2).addClass('active');
		});

		//引入尾部
		$('.cart_foot').load('./foot.html .footbox');

		//购物车商品
		//字面量
		var Cart = {

			//属性
			$parent:$('.cart_goods_list'),

			//方法
			//初始化
			init:function(){
				//生成结构
				//获取cookie
				var data = []
				var cookie = document.cookie;
				if(cookie.length>0){
					cookie = cookie.split('; ');
					cookie.forEach(item=>{
						var res = item.split('=');
		
						if(res[0] == 'goods'){
							if(JSON.parse(res[1])==''){
								console.log(666)
								data = [];

								//生成结构
								var $ly_cart = $('<div/>');
								$ly_cart.addClass('ly_cart');
								$ly_cart.html(`
										<img src="../img/cart.png">
										<span>您的购物车还是空空如也哦，事不宜迟，赶紧尽情地去<a href="../index.html">shopping</a>吧！！！</span>
									`)
								this.$parent.html('');
								this.$parent.append($ly_cart);
							}else{
								data = JSON.parse(res[1]);
							}
							

						}else{
							data = [];
							//生成结构
							var $ly_cart = $('<div/>');
							$ly_cart.addClass('ly_cart');
							$ly_cart.html(`
									<img src="../img/cart.png">
									<span>您的购物车还是空空如也哦，事不宜迟，赶紧尽情地去<a href="../index.html">shopping</a>吧！！！</span>
								`)
							this.$parent.html('');
							this.$parent.append($ly_cart);
							return;
						}
					})
				}else{
					data = [];
					//生成结构
					var $ly_cart = $('<div/>');
					$ly_cart.addClass('ly_cart');
					$ly_cart.html(`
							<img src="../img/cart.png">
							<span>您的购物车还是空空如也哦，事不宜迟，赶紧尽情地去<a href="../index.html">shopping</a>吧！！！</span>
						`)
					this.$parent.html('');
					this.$parent.append($ly_cart);
					return;
				}

				//生成表头
				var $table = $('<table/>');
				var $thead = $('<thead/>');
				$thead.html(`
						<tr>
							<td><input type="checkbox" checked/>全选</td>
							<td>商品信息</td>
							<td>单价</td>
							<td>数量</td>
							<td>金额</td>
							<td>操作</td>
						</tr>
					`).appendTo($table);

				//生成表体
				//总价格
				var cart_total = 0;
				var $tbody = $('<tbody/>');
				$tbody[0].innerHTML = data.map(function(item){
					//价格
					var total = Number(item.qty)* Number(item.pirce);
					//总价格
					cart_total += total;
				
					return `
						<tr data-id="${item.id}">
							<td><input type="checkbox" checked/></td>
							<td>
								<div>
									<img src="../css/${item.img.split(',')[0]}"/>
									<strong>${item.total}</strong>
								</div>
								<p>
									<a href="##" title="${item.list}">${item.list}</a>
									<span>优惠<i>${item.rebate}</i>元</span>
									<em>还剩<i>${item.surplus}</i>张</em>
								</p>
								
							</td>
							<td>${item.pirce}</td>
							<td>
								<a href="##" id="jian">-</a>
								<input type="text" value="${item.qty}">
								<a href="##" id="jia">+</a>
							</td>
							<td><b>${total}</b></td>
							<td>
								<a href="##" id="datalist">删除</a>
							</td>
						</tr>
					`
				}).join('');
				$tbody.appendTo($table);

				//表尾
				$tfoot = $('<tfoot/>');
				$tfoot.html(`	
						<tr>
							<td><input type="checkbox"/>反选</td>
							<td><a href="##" id="cart_qk">清空</a></td>
							<td>总价:<b>${cart_total}</b></td>
							<td></td>
							<td><a href="../index.html">继续购物</a></td>
							<td><a href="##" class="cart_btn"></a></td>
							
						</tr>
					`);
				$tfoot.appendTo($table);
				this.$parent.html('');
				$table.appendTo(this.$parent);

				//绑定点击事件
				$table[0].onclick = e=>{
					var target = e.target;
			
					if(target.id == 'datalist'){
						//获取id
						var id = $(target).closest('tr').attr('data-id');
						this.removeCookie(id);
					}
							
				}

				//点击清空购物车
				$table.on('click','#cart_qk',()=>{
					this.qkCookie();

				});	


				this.data = data;
				//链式调用
				return this;
			},

			//删除
			removeCookie:function(id){

				this.data.forEach((item,idx)=>{
					if(item.id == id){
						this.data.splice(idx,1);
					}


				});
				//写入cookie
				document.cookie = 'goods='+JSON.stringify(this.data);
				this.init();
			},

			//清空cookie
			qkCookie:function(){
				//设置过期时间
				var now = new Date();
				now.setDate(now.getDate()-1);
				//写入cookie
				document.cookie = 'goods=xxx;expires='+now;

				this.init();
			}

		}

		
			
		

		Cart.init();
		//热卖代金卷
		$.ajax({
			url:'../api/hot.php',
			data:{
				hot:'style',
			},
			success:function(res){
				var res = JSON.parse(res);
				//创建ul
				var $ul = $('<ul/>');
				$ul[0].innerHTML = res.map(function(item){
					return `
						<li data-id="${item.id}">
							<strong>剩余:${item.surplus}</strong>
							<a href="./details.html?id=${item.id}"><img src="../css/${item.img.split(',')[0]}"></a>
							<a href="##" class="title">${item.list}</a>
							<p>
								<span>面值:<b>${item.pirce}</b>元</span>
								<em>返利${item.rebate}元</em>
							</p>
						</li>
					`
				}).join('');

				$ul.appendTo($('.cart_hot'));
			}
		})

	});
});