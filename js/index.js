(function () {
  
  var wrapper = document.querySelector('.wrapper'),//外层父级
      btn = document.querySelector('.btn'),//按钮
      imgBox = document.querySelector('.imgBox'),//img盒子
      imgArr = [];//正序图片数组
      luanArr = [];//乱序图片数组
      row = 3;//行
      col = 3;//列
  init()
  //初始化
  function init() {
    bindEvent();
    renderImg()
  }

  //渲染拼图
  function renderImg() {
    var box = document.createDocumentFragment();
    imgBox.innerHTML = '';//清空下imgBox里的标签
    imgArr = [];//清空下正序数组
    forArr(function (i,j) {
      var item = document.createElement('div');
          item.classList.add('item',i*col+j);
          item.style.backgroundPosition = -j * 100 + 'px '+ -i * 100 + 'px';
          item.style.left = j * 100 + 'px ';
          item.style.top =  i * 100 +'px';
          box.appendChild(item)
          imgArr.push(item)
    })
    imgBox.appendChild(box);
  }

  //打乱拼图
  function luan() {
    var num = 0;
    var obj = {};
    luanArr = [];
    while(num != (col * row) ){
      var index = Math.floor(Math.random() * (row * col));//0-8的随机数
      if(!obj[index]){//通过对象来去重
        num++;
        obj[index] = true;
        luanArr.push(imgArr[index]);
      }
    }
    //然后遍历乱序数组
    forArr(function (i,j) {
      luanArr[i*3+j].style.left = j * 100 + 'px';
      luanArr[i*3+j].style.top  = i * 100 + 'px';
    })
  }

  //绑定事件
  function bindEvent() {
    btn.addEventListener('click',btnClick);
    imgBox.addEventListener('mousedown',imgBoxDown)
  }

  //循环格子
  function forArr (callback) {
    for(var i = 0; i < row; i++){
      for(var j = 0; j < col; j++){
        callback(i,j)
      }
    }
  }

  //按钮点击
  function btnClick(e) {
    var e = e || window.event;
    if(e.target.innerText === '开始'){
      luan()
      e.target.innerText = '重新';
    }else{
      e.target.innerText = '开始';
      renderImg()
    }
  }
  
  //格子鼠标下落
  function imgBoxDown(e) {
    if(btn.innerText === '重新'){
      var lastLeft = e.target.offsetLeft,
      lastTop = e.target.offsetTop;
      //鼠标坐标-imgBox的坐标-格子的一半的尺寸 = 中心点位置
      var left = e.pageX - this.offsetLeft - e.target.offsetWidth/2,
          top = e.pageY - this.offsetTop - e.target.offsetHeight/2;
      var dom = e.target;
      dom.style.zIndex = '10';
      dom.style.left = left + 'px';
      dom.style.top = top + 'px';
      document.addEventListener('mousemove',targetMove);
      imgBox.addEventListener('mouseup',imgBoxUp)
    }
    //拖动元素
    function targetMove(e) {
      var left = e.pageX - imgBox.offsetLeft - dom.offsetWidth/2,
          top = e.pageY - imgBox.offsetTop - dom.offsetHeight/2;
          dom.style.left = left + 'px';
          dom.style.top = top + 'px';
         
    }
    //鼠标抬起的时候
    function imgBoxUp(e) {
    
      //获取鼠标当前位置的left和top,反推取得i和j值,这样就能获得这个位置的index索引值
      var j = Math.round((e.pageX - this.offsetLeft - e.target.offsetWidth /2)/100),
          i = Math.round((e.pageY - this.offsetTop - e.target.offsetHeight /2)/100),
          index = i*3 +j,
          num = 0;
      var obj = {};
      var targetIndex = luanArr.indexOf(e.target);//拿到当前放下格子的索引值
      obj.left = luanArr[index].offsetLeft;
      obj.top = luanArr[index].offsetTop;
      obj.target = luanArr[index];//当前位置的dom保存起来
      luanArr[index].style.left = lastLeft +'px';
      luanArr[index].style.top = lastTop + 'px';
      //判断边界,当格子的移动范围超出imgBox的范围,就返回原先的位置,如果还是原来的索引也是返回原先的位置
      if(e.pageX - e.target.offsetWidth / 2 < this.offsetLeft 
        || e.pageX + e.target.offsetWidth / 2 > this.offsetWidth + this.offsetLeft 
        || e.pageY - e.target.offsetHeight / 2 < this.offsetTop 
        || e.pageY + e.target.offsetHeight / 2  > this.offsetHeight + this.offsetTop
        || targetIndex === index){
        e.target.style.left = lastLeft + 'px';
        e.target.style.top = lastTop + 'px';
      }
      
      //交换位置
      luanArr[index] = e.target;
      luanArr[targetIndex] = obj.target;
      e.target.style.left = obj.left + 'px';
      e.target.style.top = obj.top + 'px';
      dom.style.zIndex = '0';
      //遍历数组判断下数组里的每一位是否相等
      forArr(function (i,j) {
        if(luanArr[i * row + j]  === imgArr [i * row + j]){
          num++;
        }
      })
      
      //如果num = 9说明 俩个数组的顺序相等,这个时候加个延迟,体验更好
      if(num === 9){
        setTimeout(function () {
            alert('good')
        },0)
      }
      //取消绑定事件
      document.removeEventListener('mousemove',targetMove);
      imgBox.removeEventListener('mouseup',imgBoxUp)
    }
  }

 
}())