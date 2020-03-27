
import RazorMapCluster from "../_abstract/cluster";
import uniqueId from "lodash/uniqueId";
import { ClusterGenerationOpt } from "../../types";

export default class MineMapCluster extends RazorMapCluster {
  map: any;

  defaultGenerationOpt: ClusterGenerationOpt = {
    radius: 300,
    minZoom: 3,
    maxZoom: 16,
    log: false
  }

  defaultOpts: any = {
    unclustered: {
      icon: "http://10.111.32.60/map-test-data/images/marker_icon.png",
      iconId: 'unclusteredIcon',
      offsetX: -14,
      offsetY: -40,
      width: 28,
      height: 42,
      methods: {
        mouseover: (data: any, marker: any) => {
          // this.openInfo(marker);
          // let location = { x: data.location.lng, y: data.location.lat };
          // location = this.encodeCors(location);
          // this.handlerHoverMarker({ ...data, location }, marker, "over");
        },
        mouseleave: (data: any, marker: any) => {
          // this.openInfo(marker);
          // this.handlerHoverMarker(data, marker, "leave");
        }
      }
    },
    clustered: {
      icon: "http://10.111.32.60/map-test-data/images/cluster_icon.png",
      iconId: 'clusteredIcon',
      offsetX: -16,
      offsetY: -16,
      width: 60,
      height: 60,
      textStyle: {
        display: "inline-block",
        fontSize: "14px",
        color: "#fff",
        width: "60px",
        height: "60px",
        textAlign: "center",
        padding: "21px 0"
      },
      methods: {
        click(data: any) {}
      }
    }
  };

  options!: any;

  clusterGenerationOpt!: any;

  constructor(mapInstance: any) {
    super(mapInstance);
  }

  private _initOpts(options: any, clusterGenOpt: ClusterGenerationOpt) {
    this.options = Object.assign(this.defaultOpts, options);
    this.clusterGenerationOpt = Object.assign(this.defaultGenerationOpt, clusterGenOpt);
  } 

  private _loadIconImage(imageId: string, imageUrl: string) {
    return new Promise((resolve, reject) => {
      if (!this.map.hasImage(imageId)) {
        this.map.loadImage(imageUrl, (err: any, img: any) => {
          if (err) reject(err);
          this.map.addImage(imageId, img);
          resolve();
        });
      } else {
        resolve();
      }
    })
  }

  private _geoJsonConverter(data: any[]) {
    return {
      type: "FeatureCollection",
      features: data
    }
  }

  async load(points: any[], options: any, clusterGenOpt: ClusterGenerationOpt) {
    // 准备好配置参数
    this._initOpts(options, clusterGenOpt);
    // 载入配置的marker图片
    try {
      const { clustered, unclustered } = this.options;
      await Promise.all([
        this._loadIconImage(clustered.iconId, clustered.icon),
        this._loadIconImage(unclustered.iconId, unclustered.icon)
      ])
    } catch (err) {
      throw new Error(err);
    }
    // 第二步进行cluster点的配置
    const { map } = this;
    const geoJsonPoints = this._geoJsonConverter(points);
    const sourceName = `cluster_${uniqueId()}`

    map.addSource(sourceName, {
      type: "geojson",
      data: geoJsonPoints,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    
    map.addLayer({
      id: "clusters",
      type: 'symbol',
      source: sourceName,
      filter: ["has", "point_count"],
      layout: {
        'icon-image': this.options.clustered.iconId,
        'icon-allow-overlap': true
      }
    });
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: sourceName,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 12
      }
    });
    map.addLayer({
      id: "unclustered-point",
      type: 'symbol',
      source: sourceName,
      filter: ["!", ["has", "point_count"]],
      layout: {
        'icon-image': this.options.unclustered.iconId,
        'icon-allow-overlap': true
      }
    });
  }
}