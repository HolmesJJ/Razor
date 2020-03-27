// 本文件通过 /build/bin/build-component-entry.js 生成
import Alert from './alert';
import Annulus from './annulus';
import Autocomplete from './autocomplete';
import Avatar from './avatar';
import Backtop from './backtop';
import Badge from './badge';
import BigDataTree from './bigDataTree';
import Breadcrumb from './breadcrumb';
import BreadcrumbItem from './breadcrumbItem';
import Button from './button';
import ButtonGroup from './buttonGroup';
import Card from './card';
import Carousel from './carousel';
import CarouselItem from './carouselItem';
import Cascader from './cascader';
import Checkbox from './checkbox';
import CheckboxButton from './checkboxButton';
import CheckboxGroup from './checkboxGroup';
import Close from './close';
import Col from './col';
import Collapse from './collapse';
import CollapseItem from './collapseItem';
import ColorPicker from './colorPicker';
import ColorfulBall from './colorfulBall';
import DashedCircle from './dashedCircle';
import DatePicker from './datePicker';
import Dialog from './dialog';
import Digit from './digit';
import DragUpload from './dragUpload';
import Dropdown from './dropdown';
import DropdownItem from './dropdownItem';
import DropdownMenu from './dropdownMenu';
import Form from './form';
import FormItem from './formItem';
import FramePlayer from './framePlayer';
import Icon from './icon';
import Image from './image';
import ImageCard from './imageCard';
import ImageClose from './imageClose';
import ImageEditor from './imageEditor';
import Input from './input';
import InputNumber from './inputNumber';
import Loading from './loading';
import MapCanvasLayer from './mapCanvasLayer';
import MapCircle from './mapCircle';
import MapCluster from './mapCluster';
import MapDrawingTools from './mapDrawingTools';
import MapHeatmap from './mapHeatmap';
import MapLinePlayer from './mapLinePlayer';
import MapMarker from './mapMarker';
import MapPolygon from './mapPolygon';
import MapPolyline from './mapPolyline';
import MapTool from './mapTool';
import MassTree from './massTree';
import MassTreeMap from './massTreeMap';
import Message from './message';
import MessageBox from './messageBox';
import Notification from './notification';
import NotificationPlus from './notificationPlus';
import OnOff from './onOff';
import Option from './option';
import OptionGroup from './optionGroup';
import Pagination from './pagination';
import Placeholder from './placeholder';
import PolygonDrawer from './polygonDrawer';
import Popover from './popover';
import Progress from './progress';
import Radio from './radio';
import RadioButton from './radioButton';
import RadioGroup from './radioGroup';
import Row from './row';
import RtspPlayer from './rtspPlayer';
import SImage from './sImage';
import SMap from './sMap';
import ScrollBox from './scrollBox';
import Scrollbar from './scrollbar';
import Scroller from './scroller';
import SearchInput from './searchInput';
import Select from './select';
import SelectDropdown from './selectDropdown';
import Slider from './slider';
import Spinner from './spinner';
import Step from './step';
import Steps from './steps';
import TabPane from './tabPane';
import Table from './table';
import TableColumn from './tableColumn';
import Tabs from './tabs';
import Tag from './tag';
import TagList from './tagList';
import TimePicker from './timePicker';
import TimeSelect from './timeSelect';
import Timeline from './timeline';
import TimelineItem from './timeline-item';
import Tooltip from './tooltip';
import Transfer from './transfer';
import Tree from './tree';
import TreeMap from './treeMap';
import Upload from './upload';
import UploadMask from './uploadMask';
import VideoPlayer from './videoPlayer';
import WaterMarker from './waterMarker';
import CollapseTransition from 'rz/transitions/collapse-transition';
import _locale from 'rz/locale';

const components = [
  Alert,
  Annulus,
  Autocomplete,
  Avatar,
  Backtop,
  Badge,
  BigDataTree,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  CarouselItem,
  Cascader,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Close,
  Col,
  Collapse,
  CollapseItem,
  ColorPicker,
  ColorfulBall,
  DashedCircle,
  DatePicker,
  Dialog,
  Digit,
  DragUpload,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Form,
  FormItem,
  FramePlayer,
  Icon,
  Image,
  ImageCard,
  ImageClose,
  ImageEditor,
  Input,
  InputNumber,
  MapCanvasLayer,
  MapCircle,
  MapCluster,
  MapDrawingTools,
  MapHeatmap,
  MapLinePlayer,
  MapMarker,
  MapPolygon,
  MapPolyline,
  MapTool,
  MassTree,
  MassTreeMap,
  NotificationPlus,
  OnOff,
  Option,
  OptionGroup,
  Pagination,
  Placeholder,
  PolygonDrawer,
  Popover,
  Progress,
  Radio,
  RadioButton,
  RadioGroup,
  Row,
  RtspPlayer,
  SImage,
  SMap,
  ScrollBox,
  Scrollbar,
  Scroller,
  SearchInput,
  Select,
  SelectDropdown,
  Slider,
  Spinner,
  Step,
  Steps,
  TabPane,
  Table,
  TableColumn,
  Tabs,
  Tag,
  TagList,
  TimePicker,
  TimeSelect,
  Timeline,
  TimelineItem,
  Tooltip,
  Transfer,
  Tree,
  TreeMap,
  Upload,
  UploadMask,
  VideoPlayer,
  WaterMarker
];

const directives = [Scroller.directive, Loading.directive];

const installDirectives = (Vue, directives) => {
  directives.forEach(directive => {
    if (
      directive.install &&
      toString.call(directive.install) === '[object Function]' &&
      directive.useInstall
    ) {
      Vue.use(directive);
    } else {
      Vue.directive(directive.name, directive);
    }
  });
};
const install = (Vue, Opts = {}) => {
  _locale.use(Opts.locale);
  _locale.i18n(Opts.i18n);
  /**
   * 全局注册组件
   * 使用的时候不需要再次component
   * 例子： <rz-map {...props} />
   */
  components.forEach(component => {
    Vue.use(component);
  });
  // register CollapseTransition
  Vue.component('Rz' + CollapseTransition.name, CollapseTransition);
  // if(Opts['map']){
  //   Vue.prototype.$mapConfig = Opts['map'];
  // }
  // 全局配置项
  Vue.prototype.$RAZOR = {
    size: Opts.size || '',
    zIndex: Opts.zIndex || 2000
  };

  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

  // 安装所有directive
  installDirectives(Vue, directives);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const version = '1.5.2';

export default {
  version,
  install,
  locale: _locale.use,
  i18n: _locale.i18n,
};
const locale = _locale.use
const i18n = _locale.use
export {
  version,
  locale,
  i18n,
  install,
  Alert,
  Annulus,
  Autocomplete,
  Avatar,
  Backtop,
  Badge,
  BigDataTree,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  CarouselItem,
  Cascader,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Close,
  Col,
  Collapse,
  CollapseItem,
  ColorPicker,
  ColorfulBall,
  DashedCircle,
  DatePicker,
  Dialog,
  Digit,
  DragUpload,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Form,
  FormItem,
  FramePlayer,
  Icon,
  Image,
  ImageCard,
  ImageClose,
  ImageEditor,
  Input,
  InputNumber,
  Loading,
  MapCanvasLayer,
  MapCircle,
  MapCluster,
  MapDrawingTools,
  MapHeatmap,
  MapLinePlayer,
  MapMarker,
  MapPolygon,
  MapPolyline,
  MapTool,
  MassTree,
  MassTreeMap,
  Message,
  MessageBox,
  Notification,
  NotificationPlus,
  OnOff,
  Option,
  OptionGroup,
  Pagination,
  Placeholder,
  PolygonDrawer,
  Popover,
  Progress,
  Radio,
  RadioButton,
  RadioGroup,
  Row,
  RtspPlayer,
  SImage,
  SMap,
  ScrollBox,
  Scrollbar,
  Scroller,
  SearchInput,
  Select,
  SelectDropdown,
  Slider,
  Spinner,
  Step,
  Steps,
  TabPane,
  Table,
  TableColumn,
  Tabs,
  Tag,
  TagList,
  TimePicker,
  TimeSelect,
  Timeline,
  TimelineItem,
  Tooltip,
  Transfer,
  Tree,
  TreeMap,
  Upload,
  UploadMask,
  VideoPlayer,
  WaterMarker
};
