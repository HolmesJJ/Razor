## 更新日志

### 1.0.15

_2019-07-17_

- 修复 Autocomplete 组件，输入后没有给出匹配建议的问题，#BIZFRONT-104 [http://jira.sensetime.com/browse/BIZFRONT-104]
- 修复 在 Select 选择器，可创建条目输入文字后整个网页卡死 #BIZFRONT-107[http://jira.sensetime.com/browse/BIZFRONT-107?filter=-1]
- 应用新的地图 rz-s-map
- 修复 上传文件 demo 出问题

### 1.0.17

_2019-07-23_

- 修复地图标注子组件在自定义标注的情况下，setPosition 方法缺失 #BIZFRONT-108 [http://jira.sensetime.com/browse/BIZFRONT-108]
- 修复地图标注子组件 offset 设置无效
- 新增 地图组件的百度离线地图支持
- 新增 地图折线组件隐藏 / 显示功能
- 新增 字体（思源黑体）支持
- 新增 Collapse Transition

### 1.1.0

_2019-07-25_

- 新增 PolygonDrawer 组件
- 新增 百度地图在线版本 midnight 主题

### 1.1.1

- 新增 MapDrawingTools 子组件, 提供在地图上绘制长方形，圆形，多边形的功能
- 新增 ImageEditor 组件, 图片预处理器,提供标注功能
- 新增 整体项目 lint 工具, 规范代码
- 添加 BidDataTree 组件，支持大数据树的基础操作，待完善样式

### 1.1.2

_2019-08-09_

- 完成基础样式变量编写 查看地址 http://confluence.sensetime.com/pages/viewpage.action?pageId=72292119 (Razor 空间 / 技术研究 / 样式方案)
- BidDataTree 组件 完成基础 API
- Input 组件完成样式规范
- Button 组件完成部分样式规范
- Radio 组件完成样式规范
- Backtop 组件完成功能, 特别感谢李鹏志提的 MR
- 项目样式开发模式优化
- 地图文档 优化

### 1.1.3

_2019-08-09_

- Button 按钮组件 样式规范 新增 size large
- Pagination 分页器组件 样式规范
- Dropdown 下拉框组件 样式规范
- selectDropdown 下拉选择组件 样式规范
- Steps 步骤条组件 样式规范
- Dialog 弹框组件 样式规范
- ScrollBar 滚动条组件 样式规范

### 1.1.4

_2019-08-12_

- MapCluster 子组件新增 map/reduce 聚合配置，新增标注定制
- MapPolyline 子组件新增箭头配置项
- 地图文档完善：新增 MapMarker 子组件文档， MapPolyline 子组件文档， MapCluster 子组件文档, MapCircle 子组件文档，MapPolygon 子组件文档

### 1.1.5

_2019-08-12_

- UI 组件规范初版

### 1.1.6

-

### 1.1.7

_2019-08-14_

- 大数据树 BIgDataTree 组件
- 地图文档更新
- 彩色球 colorfulBall 组件完成
- 添加 ImageEditor 画矩形功能
- 修复字体文件加载错误问题

### 1.2.0

_2019-09-03_

- TreeMap 组件改版，有 API 变动，
- 新增 大数据处理的 MassTree 组件性能优化到 ms 级响应，组件样式规范更新，选中态交互样式更新（已更新在 4.0）
- 更新 Table、Upload 、TimePicker、tag 等组件的样式规范
- VideoPlayer 叠框功能
- 地图新增功能，midnight 主题更新等
- 新增面包屑导航，关闭按钮 Close ,Scrollbox 等组件
- 部分组件 API 变动，如 SearchInput 组件 API 变动 inputValue => v-model
- ImageEditor / SMap 等组件根据实际使用调整以及改 bug
- Scrollbar（滚动条）组件的更新了 barType 属性来支持不同的 scroll bar 类型
- Tag 组件更新规范，新增 taglist 组件 ，用来支持库标签选择器
- 更新文档如以下，其他更新属性，可以在文档中查看

### 1.2.2

_2019-09-20_

- 添加了 FramePlayer 组件
- 修复了 Slider 的一些 bug

### 1.3.0
- 新增Card 组件 卡片组件主要用于展示
- 新增 Placeholder 组件 用于占位，table 空页面的占位等
- 新增Message 组件规范 用于消息提醒
- 新增framePlayer 组件 用于播放图片和视频 
- 新增 Digit数字动画组件 用于展示数字
- 新增 新的截图交互组件 截图上传检索等功能使用
- 新增Timeline 时间线组件,另新增dashed 配置项
- 新增地图热力图组件
- DateTimePicker 新增reset函数,具体使用请看文档
- 新增 colorPicker 颜色选择器 用于检索 选择衣服等颜色
- 移除默认发布的文字文件,放在具体项目中；
- 修改 Backtop 规范;
- SearchInput 新增disable(可用) default-option(默认选项) show-search(显示icon)选项;
- 组件国际化置入
- 地图多边形绘制方式改动为先画线后画多边形
- Taglist 添加 单选模式
- Button 新增圆形大小按钮 ,具体可以看文档使用
- ImageEditor组件改动，新增放大缩小功能;
- 更新了较多组件的视觉规范和bug
