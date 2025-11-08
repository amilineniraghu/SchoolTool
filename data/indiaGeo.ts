// Fix: Replace placeholder content with a valid GeoJSON FeatureCollection for Indian states.
// This resolves the module error in MapPointingPage.tsx.
export const indiaGeo = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature", "id": "IN-DL", "properties": { "name": "Delhi" },
      "geometry": { "type": "Polygon", "coordinates": [[[76.8, 28.4], [77.3, 28.4], [77.3, 28.9], [76.8, 28.9], [76.8, 28.4]]] }
    },
    {
      "type": "Feature", "id": "IN-GJ", "properties": { "name": "Gujarat" },
      "geometry": { "type": "Polygon", "coordinates": [[[68.1, 20.1], [74.5, 20.1], [74.5, 24.7], [68.1, 24.7], [68.1, 20.1]]] }
    },
    {
      "type": "Feature", "id": "IN-KA", "properties": { "name": "Karnataka" },
      "geometry": { "type": "Polygon", "coordinates": [[[74.0, 11.5], [78.6, 11.5], [78.6, 18.5], [74.0, 18.5], [74.0, 11.5]]] }
    },
    {
      "type": "Feature", "id": "IN-KL", "properties": { "name": "Kerala" },
      "geometry": { "type": "Polygon", "coordinates": [[[74.8, 8.2], [77.5, 8.2], [77.5, 12.8], [74.8, 12.8], [74.8, 8.2]]] }
    },
    {
      "type": "Feature", "id": "IN-MH", "properties": { "name": "Maharashtra" },
      "geometry": { "type": "Polygon", "coordinates": [[[72.6, 15.6], [80.9, 15.6], [80.9, 22.0], [72.6, 22.0], [72.6, 15.6]]] }
    },
    {
      "type": "Feature", "id": "IN-RJ", "properties": { "name": "Rajasthan" },
      "geometry": { "type": "Polygon", "coordinates": [[[69.5, 23.0], [78.3, 23.0], [78.3, 30.2], [69.5, 30.2], [69.5, 23.0]]] }
    },
    {
      "type": "Feature", "id": "IN-TN", "properties": { "name": "Tamil Nadu" },
      "geometry": { "type": "Polygon", "coordinates": [[[76.2, 8.0], [80.3, 8.0], [80.3, 13.6], [76.2, 13.6], [76.2, 8.0]]] }
    },
    {
      "type": "Feature", "id": "IN-UP", "properties": { "name": "Uttar Pradesh" },
      "geometry": { "type": "Polygon", "coordinates": [[[77.0, 23.8], [84.6, 23.8], [84.6, 30.4], [77.0, 30.4], [77.0, 23.8]]] }
    },
    {
      "type": "Feature", "id": "IN-WB", "properties": { "name": "West Bengal" },
      "geometry": { "type": "Polygon", "coordinates": [[[85.8, 21.5], [89.9, 21.5], [89.9, 27.2], [85.8, 27.2], [85.8, 21.5]]] }
    }
  ]
};
