# device-listener

> Custom device listener tool for JavaScript.you can addListener on device.
> 你可以使用此工具对设备进行绑定感应监听事件

#### Build Setup
# install dependencies
```javascript
npm i device-listener
```

#### Readme

```javascript
1. import deviceListener from 'device-listener'
2. // start device listener
    deviceListener.start()
3. // add listener event
    deviceListener.addListener("devicemotion", () => {
      console.log('devicemotion')
    })
4. finish listener
 deviceListener.finish()

```
#### listener type
```javascript
设备加速度监听	orientationchange
设备旋转感应监听	deviceorientation
设备加速度监听	devicemotion

摇一摇监听		shake
		
倾斜  			tilt
左倾斜			lefttilt
右倾斜			righttilt
上倾斜			uptilt
下倾斜			downtilt

转动 			turn
顺时针转动		cwturn
逆时针转动		ccwturn

```