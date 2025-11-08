// Fix: Replace placeholder content with a valid GeoJSON FeatureCollection for world countries.
// This resolves the module error in MapPointingPage.tsx.
export const worldGeo = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature", "id": "Brazil", "properties": { "name": "Brazil" },
      "geometry": { "type": "Polygon", "coordinates": [[[-74, -34], [-34, -34], [-34, 5], [-74, 5], [-74, -34]]] }
    },
    {
      "type": "Feature", "id": "Australia", "properties": { "name": "Australia" },
      "geometry": { "type": "Polygon", "coordinates": [[[112, -44], [154, -44], [154, -10], [112, -10], [112, -44]]] }
    },
    {
      "type": "Feature", "id": "Canada", "properties": { "name": "Canada" },
      "geometry": { "type": "Polygon", "coordinates": [[[-141, 41], [-52, 41], [-52, 83], [-141, 83], [-141, 41]]] }
    },
    {
      "type": "Feature", "id": "China", "properties": { "name": "China" },
      "geometry": { "type": "Polygon", "coordinates": [[[73, 18], [135, 18], [135, 54], [73, 54], [73, 18]]] }
    },
    {
      "type": "Feature", "id": "Egypt", "properties": { "name": "Egypt" },
      "geometry": { "type": "Polygon", "coordinates": [[[25, 22], [36, 22], [36, 32], [25, 32], [25, 22]]] }
    },
    {
      "type": "Feature", "id": "Germany", "properties": { "name": "Germany" },
      "geometry": { "type": "Polygon", "coordinates": [[[5, 47], [15, 47], [15, 55], [5, 55], [5, 47]]] }
    },
    {
      "type": "Feature", "id": "India", "properties": { "name": "India" },
      "geometry": { "type": "Polygon", "coordinates": [[[68, 8], [98, 8], [98, 37], [68, 37], [68, 8]]] }
    },
    {
      "type": "Feature", "id": "Japan", "properties": { "name": "Japan" },
      "geometry": { "type": "Polygon", "coordinates": [[[122, 24], [146, 24], [146, 46], [122, 46], [122, 24]]] }
    },
    {
      "type": "Feature", "id": "Russia", "properties": { "name": "Russia" },
      "geometry": { "type": "Polygon", "coordinates": [[[19, 41], [180, 41], [180, 82], [19, 82], [19, 41]]] }
    },
    {
      "type": "Feature", "id": "South Africa", "properties": { "name": "South Africa" },
      "geometry": { "type": "Polygon", "coordinates": [[[16, -35], [33, -35], [33, -22], [16, -22], [16, -35]]] }
    }
  ]
};
