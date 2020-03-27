class GeoJson {
  type: string;
  properties: {
    isSelected: boolean;
    node: any;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  constructor(resource) {
    this.type = "feature";
    this.properties = {
      isSelected: false,
      node: resource
    };
    this.geometry = {
      type: "Point",
      coordinates: [resource.longitude, resource.latitude]
    };
  }
}

export default GeoJson;
